#!/usr/bin/env python3
"""Query Foley-size (creek-size) USGS WBD units intersecting Clatsop + Tillamook.

Uses WBD layer 6 (12-digit codes; Foley Creek = 171002020603) plus OWRD aggregates.

Writes:
  data/creek_size.geojson — polygons + aggregate properties only
  data/summary.json
  wbd_inventory_tillamook_clatsop.json

No home / well / POD point files. No owner or address fields.
Replay: python3 nccwp/query_huc12.py
"""
from __future__ import annotations

import json
import time
from collections import Counter, defaultdict
from pathlib import Path

import requests
from shapely import STRtree
from shapely.geometry import Point, mapping, shape
from shapely.ops import unary_union
from shapely.prepared import prep
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
CACHE = Path("/tmp/nccwp-huc12-cache")
CACHE.mkdir(parents=True, exist_ok=True)
INVENTORY = ROOT / "wbd_inventory_tillamook_clatsop.json"

UA = "GraphicOregon-NCCWP/1.0 (https://caradmico.github.io/graphicoregon/nccwp/)"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "application/json"})

USGS_WBD = "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer"
COUNTIES = "https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/6/query"
CITIES = "https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/0/query"
CLATSOP = "https://delta.co.clatsop.or.us/server/rest/services/Taxlots/FeatureServer/1/query"
TILLAMOOK = "https://gis.wrd.state.or.us/server/rest/services/tax/Tax_Lots_Public_Query_WGS84/FeatureServer/2/query"
WELLS = "https://gis.wrd.state.or.us/server/rest/services/dynamic/Wells_by_Theme_WGS84/FeatureServer/2/query"
PODS = "https://gis.wrd.state.or.us/server/rest/services/dynamic/PODs_By_Source_WGS84/FeatureServer/3/query"

WBD_LAYERS = {
    "huc8": {"id": 4, "code_field": "huc8"},
    "huc10": {"id": 5, "code_field": "huc10"},
    "huc12": {"id": 6, "code_field": "huc12"},
}

BANNED_PUBLIC_PROP = (
    "owner",
    "owner_name",
    "owner_address",
    "owner_line",
    "situs",
    "situs_addr",
    "situs_city",
    "site_address",
    "site_citystatezip",
    "address",
)


def public_props(props: dict) -> dict:
    out = {}
    for key, value in (props or {}).items():
        low = str(key).lower()
        if low in BANNED_PUBLIC_PROP:
            continue
        if "owner" in low or "situs" in low or "addr" in low:
            continue
        out[key] = value
    return out


def retry_sleep(attempt: int) -> None:
    time.sleep(min(32, 2 ** attempt))


def post_json(url: str, payload: dict, tries: int = 6) -> dict:
    last = None
    for attempt in range(tries):
        try:
            r = SESSION.post(url, data=payload, timeout=180)
            r.raise_for_status()
            data = r.json()
            if isinstance(data, dict) and data.get("error"):
                raise RuntimeError(data["error"])
            return data
        except Exception as exc:  # noqa: BLE001
            last = exc
            print(f"  retry {attempt + 1}/{tries} {url.split('/rest/')[0]}: {exc}")
            retry_sleep(attempt)
    raise RuntimeError(f"failed {url}: {last}")


def query_all(url: str, extra: dict, page: int = 1000) -> list:
    features = []
    offset = 0
    while True:
        payload = {
            "f": "geojson",
            "outSR": "4326",
            "inSR": "4326",
            "returnGeometry": "true",
            "resultOffset": str(offset),
            "resultRecordCount": str(page),
            **extra,
        }
        data = post_json(url, payload)
        batch = data.get("features") or []
        features.extend(batch)
        print(f"    +{len(batch)} (total {len(features)})")
        if not data.get("exceededTransferLimit") and len(batch) < page:
            break
        if not batch:
            break
        offset += len(batch)
    return features


def query_centroids(url: str, extra: dict, page: int = 1000) -> list:
    features = []
    offset = 0
    while True:
        payload = {
            "f": "json",
            "outSR": "4326",
            "inSR": "4326",
            "returnGeometry": "false",
            "returnCentroid": "true",
            "resultOffset": str(offset),
            "resultRecordCount": str(page),
            **extra,
        }
        data = post_json(url, payload)
        batch = data.get("features") or []
        features.extend(batch)
        print(f"    +{len(batch)} (total {len(features)})")
        if not data.get("exceededTransferLimit") and len(batch) < page:
            break
        if not batch:
            break
        offset += len(batch)
    return features


def cache_json(path: Path, loader):
    if path.exists():
        print(f"  cache {path.name}")
        return json.loads(path.read_text())
    data = loader()
    path.write_text(json.dumps(data))
    return data


def geom_payload(bbox: list[float]) -> dict:
    xmin, ymin, xmax, ymax = bbox
    return {
        "geometry": json.dumps(
            {"xmin": xmin, "ymin": ymin, "xmax": xmax, "ymax": ymax, "spatialReference": {"wkid": 4326}}
        ),
        "geometryType": "esriGeometryEnvelope",
        "spatialRel": "esriSpatialRelIntersects",
    }


def bbox_of(geom, pad: float = 0.01) -> list[float]:
    minx, miny, maxx, maxy = geom.bounds
    return [minx - pad, miny - pad, maxx + pad, maxy + pad]


def clatsop_residential(code) -> bool:
    s = str(code if code is not None else "").strip()
    if not s:
        return False
    if s[0] in {"5", "6"}:
        return False
    if s in {"0", "1", "400", "401", "409"}:
        return True
    if s[0] in {"0", "1", "7"}:
        return True
    return False


def tillamook_residential(attrs: dict) -> bool:
    site = (attrs.get("site_address") or "").strip()
    if not site:
        return False
    acres = attrs.get("taxlot_acre")
    try:
        acres_f = float(acres) if acres is not None else None
    except (TypeError, ValueError):
        acres_f = None
    if acres_f is not None and acres_f > 80:
        return False
    return True


def centroid_xy(feat: dict):
    c = feat.get("centroid")
    if c and "x" in c and "y" in c:
        return float(c["x"]), float(c["y"])
    geom = feat.get("geometry")
    if geom and "x" in geom and "y" in geom:
        return float(geom["x"]), float(geom["y"])
    if geom and geom.get("coordinates"):
        g = shape(geom)
        if not g.is_empty:
            p = g.representative_point()
            return float(p.x), float(p.y)
    return None


def fetch_counties() -> dict:
    print("Query Oregon Framework counties Clatsop + Tillamook")
    raw = cache_json(
        CACHE / "counties.geojson",
        lambda: {
            "type": "FeatureCollection",
            "features": query_all(
                COUNTIES,
                {"where": "altName IN ('Clatsop','Tillamook')", "outFields": "instName,altName,instCode"},
                page=10,
            ),
        },
    )
    by_name = {}
    for f in raw["features"]:
        name = ((f.get("properties") or {}).get("altName") or "").strip()
        g = make_valid(shape(f["geometry"]))
        if name and not g.is_empty:
            by_name[name] = g
    if set(by_name) != {"Clatsop", "Tillamook"}:
        raise RuntimeError(f"expected Clatsop and Tillamook, got {sorted(by_name)}")
    union = unary_union(list(by_name.values()))
    print(f"  county bbox {bbox_of(union)}")
    return {"geoms": by_name, "union": union, "bbox": bbox_of(union)}


def inventory_level(level: str, counties: dict) -> tuple[list[dict], list[dict], int]:
    layer = WBD_LAYERS[level]
    code_field = layer["code_field"]
    print(f"Query USGS WBD {level} layer {layer['id']}")
    raw = cache_json(
        CACHE / f"{level}_envelope.geojson",
        lambda: {
            "type": "FeatureCollection",
            "features": query_all(
                f"{USGS_WBD}/{layer['id']}/query",
                {
                    **geom_payload(counties["bbox"]),
                    "where": "1=1",
                    "outFields": f"{code_field},name,states,areasqkm,areaacres",
                },
                page=1000,
            ),
        },
    )
    prepared = {name: prep(g) for name, g in counties["geoms"].items()}
    union_prep = prep(counties["union"])
    rows = []
    kept_feats = []
    bbox_only = 0
    for f in raw["features"]:
        props = f.get("properties") or {}
        code = str(props.get(code_field) or "").strip()
        if not code or not f.get("geometry"):
            continue
        g = make_valid(shape(f["geometry"]))
        if g.is_empty:
            continue
        if not (union_prep.intersects(g) or g.intersects(counties["union"])):
            bbox_only += 1
            continue
        touches = [n for n in ("Clatsop", "Tillamook") if prepared[n].intersects(g) or g.intersects(counties["geoms"][n])]
        if not touches:
            bbox_only += 1
            continue
        row = {
            "code": code,
            "name": props.get("name") or "",
            "level": level,
            "states": props.get("states") or "",
            "areasqkm": props.get("areasqkm"),
            "areaacres": props.get("areaacres"),
            "counties": touches,
            "county_touch": " and ".join(touches),
        }
        if level in {"huc10", "huc12"}:
            row["parent_huc8"] = code[:8]
        rows.append(row)
        kept_feats.append(
            {
                "type": "Feature",
                "properties": row,
                "geometry": mapping(g),
                "_geom": g,
            }
        )
    rows.sort(key=lambda r: r["code"])
    kept_feats.sort(key=lambda f: f["properties"]["code"])
    print(f"  envelope {len(raw['features'])}; intersect {len(rows)}; bbox-only {bbox_only}")
    return rows, kept_feats, len(raw["features"])


def assign_code(tree: STRtree, geoms: list, codes: list, x: float, y: float) -> str | None:
    pt = Point(x, y)
    hits = tree.query(pt, predicate="intersects")
    if len(hits) == 0:
        return None
    for i in hits:
        if geoms[int(i)].contains(pt):
            return codes[int(i)]
    return codes[int(hits[0])]


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    counties = fetch_counties()

    units = {}
    envelope_hits = {}
    huc12_feats = []
    for level in ("huc8", "huc10", "huc12"):
        rows, feats, n_env = inventory_level(level, counties)
        units[level] = rows
        envelope_hits[level] = n_env
        if level == "huc12":
            huc12_feats = feats

    if len(huc12_feats) < 40:
        raise RuntimeError(f"expected dozens of HUC-12s, got {len(huc12_feats)}")

    huc12_geoms = [f["_geom"] for f in huc12_feats]
    huc12_codes = [f["properties"]["code"] for f in huc12_feats]
    tree = STRtree(huc12_geoms)
    huc_union = unary_union(huc12_geoms)
    huc_bbox = bbox_of(huc_union, pad=0.02)
    county_env = geom_payload(counties["bbox"])
    huc_env = geom_payload(huc_bbox)
    print(f"HUC-12 union bbox {huc_bbox} n={len(huc12_feats)}")

    print("Query Oregon Framework city limits")
    city_raw = cache_json(
        CACHE / "cities.geojson",
        lambda: {
            "type": "FeatureCollection",
            "features": query_all(
                CITIES,
                {**county_env, "where": "1=1", "outFields": "CITY_NAME,acres"},
                page=200,
            ),
        },
    )
    city_geoms = []
    city_names = []
    for f in city_raw["features"]:
        g = make_valid(shape(f["geometry"]))
        if g.is_empty or not g.intersects(counties["union"]):
            continue
        name = (f.get("properties") or {}).get("CITY_NAME") or (f.get("properties") or {}).get("city_name")
        city_geoms.append(g)
        if name:
            city_names.append(name)
    cities_union = unary_union(city_geoms) if city_geoms else None
    cities_prep = prep(cities_union) if cities_union is not None else None
    print(f"  cities: {sorted(set(city_names))}")

    print("Query Clatsop taxlots (centroids)")
    cl_raw = cache_json(
        CACHE / "clatsop.json",
        lambda: query_centroids(
            CLATSOP,
            {**county_env, "where": "1=1", "outFields": "OBJECTID,TAXLOTKEY,PROPERTY_C,STAT_CLASS"},
            page=2000,
        ),
    )

    print("Query OWRD Tillamook taxlots (centroids)")
    ti_raw = cache_json(
        CACHE / "tillamook.json",
        lambda: query_centroids(
            TILLAMOOK,
            {
                **county_env,
                "where": "county_name='Tillamook'",
                "outFields": "OBJECTID,county_name,maptaxlot,taxlot,site_address,taxlot_acre",
            },
            page=2000,
        ),
    )

    print("Query OWRD wells")
    we_raw = cache_json(
        CACHE / "wells.geojson",
        lambda: {
            "type": "FeatureCollection",
            "features": query_all(
                WELLS,
                {
                    **huc_env,
                    "where": "1=1",
                    "outFields": "wl_id,type_of_log,wl_nbr,well_tag_nbr,exempt_use,primary_use,wl_county_code",
                },
                page=2000,
            ),
        },
    )

    print("Query OWRD surface stream PODs")
    po_raw = cache_json(
        CACHE / "pods.geojson",
        lambda: {
            "type": "FeatureCollection",
            "features": query_all(
                PODS,
                {
                    **huc_env,
                    "where": "1=1",
                    "outFields": "pod_display,pod_display_short,wris_link,pod_use_id,pod_location_id,use_code,use_code_description,source,stream_name,wr_type",
                },
                page=2000,
            ),
        },
    )

    wells_by = defaultdict(set)
    well_rows = 0
    for f in we_raw["features"]:
        g = f.get("geometry") or {}
        coords = g.get("coordinates")
        if not coords:
            continue
        x, y = coords[:2]
        code = assign_code(tree, huc12_geoms, huc12_codes, x, y)
        if not code:
            continue
        well_rows += 1
        key = (f.get("properties") or {}).get("wl_id")
        wells_by[code].add(key if key is not None else (x, y, well_rows))

    pods_by = defaultdict(set)
    pod_rows = 0
    for f in po_raw["features"]:
        g = f.get("geometry") or {}
        coords = g.get("coordinates")
        if not coords:
            continue
        x, y = coords[:2]
        code = assign_code(tree, huc12_geoms, huc12_codes, x, y)
        if not code:
            continue
        pod_rows += 1
        key = (f.get("properties") or {}).get("pod_use_id")
        pods_by[code].add(key if key is not None else (x, y, pod_rows))

    homes_by = Counter()
    cl_off = ti_off = 0
    for f in cl_raw:
        xy = centroid_xy(f)
        if not xy:
            continue
        x, y = xy
        if not clatsop_residential((f.get("attributes") or {}).get("PROPERTY_C")):
            continue
        if cities_prep is not None and cities_prep.contains(Point(x, y)):
            continue
        code = assign_code(tree, huc12_geoms, huc12_codes, x, y)
        if not code:
            continue
        homes_by[code] += 1
        cl_off += 1

    for f in ti_raw:
        xy = centroid_xy(f)
        if not xy:
            continue
        x, y = xy
        if not tillamook_residential(f.get("attributes") or {}):
            continue
        if cities_prep is not None and cities_prep.contains(Point(x, y)):
            continue
        code = assign_code(tree, huc12_geoms, huc12_codes, x, y)
        if not code:
            continue
        homes_by[code] += 1
        ti_off += 1

    public_features = []
    per_unit = []
    for feat in huc12_feats:
        p = feat["properties"]
        code = p["code"]
        wells = len(wells_by.get(code, ()))
        pods = len(pods_by.get(code, ()))
        homes = int(homes_by.get(code, 0))
        props = public_props(
            {
                "name": p["name"],
                "code": code,
                "areasqkm": p.get("areasqkm"),
                "wells": wells,
                "surface_pods": pods,
                "homes_off_city": homes,
                "counties": p["counties"],
            }
        )
        g = feat["_geom"].simplify(0.00025, preserve_topology=True)
        public_features.append({"type": "Feature", "properties": props, "geometry": mapping(g)})
        unit = dict(p)
        unit["wells"] = wells
        unit["surface_pods"] = pods
        unit["homes_off_city"] = homes
        per_unit.append(unit)

    totals = {
        "creek_size": len(public_features),
        "wells": sum(u["wells"] for u in per_unit),
        "surface_pods": sum(u["surface_pods"] for u in per_unit),
        "homes_off_city": sum(u["homes_off_city"] for u in per_unit),
        "homes_clatsop_off_city": cl_off,
        "homes_tillamook_off_city": ti_off,
        "cities": len(set(city_names)),
    }

    summary = {
        "level": "creek_size",
        "reference": {"name": "Foley Creek", "code": "171002020603", "areasqkm": 43.83},
        "counties": ["Clatsop", "Tillamook"],
        "queried": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "counts": totals,
        "raw_rows": {
            "wells_in_creeks": well_rows,
            "surface_pods_in_creeks": pod_rows,
        },
        "units": per_unit,
        "pipeline": {
            "city_names": sorted(set(city_names)),
            "homes_note": (
                "homes_off_city is Clatsop + Tillamook taxlots only. Creek-size units that run into "
                "Columbia, Washington, Yamhill, Lincoln, or Washington State are incomplete for homes."
            ),
        },
        "sources": {
            "creek_size": f"{USGS_WBD}/6",
            "counties": COUNTIES.replace("/query", ""),
            "clatsop_taxlots": CLATSOP.replace("/query", ""),
            "tillamook_taxlots": TILLAMOOK.replace("/query", ""),
            "city_limits": CITIES.replace("/query", ""),
            "wells": WELLS.replace("/query", ""),
            "surface_pods": PODS.replace("/query", ""),
        },
        "rules": {
            "selection": "USGS WBD Foley-size (creek-size) polygon intersects Clatsop or Tillamook county polygon",
            "wells": "unique OWRD wl_id inside the creek-size polygon",
            "surface_pods": "unique OWRD pod_use_id on the Streams layer inside the creek-size polygon",
            "clatsop_residential": "PROPERTY_C is 0, 1, 7xx, or 400/401/409; exclude 5xx farm and 6xx forest",
            "tillamook_residential": "no class field; site_address present and taxlot_acre is null or <= 80",
            "off_city": "centroid outside Oregon Framework city limits",
            "public_map": "creek-size polygon heat only; no home, well, or POD points; no owner or address",
        },
        "public_map": {
            "geometry": "creek_size_polygon",
            "choropleth_metric": "wells",
            "popup_metrics": ["wells", "surface_pods", "homes_off_city"],
            "choropleth_note": "Fill is registered wells in the Foley-size creek. Popup also shows surface stream PODs and a Clatsop/Tillamook homes-off-city count. Not a parcel-level assignment.",
        },
    }

    inv_units = [
        {
            "code": u["code"],
            "name": u["name"],
            "areasqkm": u["areasqkm"],
            "areaacres": u["areaacres"],
            "states": u.get("states") or "",
            "counties": u["counties"],
            "county_touch": u["county_touch"],
            "wells": u["wells"],
            "surface_pods": u["surface_pods"],
            "homes_off_city": u["homes_off_city"],
        }
        for u in per_unit
    ]
    inventory = {
        "title": "Creek-size USGS WBD units intersecting Tillamook and Clatsop counties, Oregon",
        "reference": {
            "name": "Foley Creek",
            "code": "171002020603",
            "areasqkm": 43.83,
            "areaacres": 10829.55,
            "note": "Tillamook reference. Lower Nehalem parent 1710020206 has five creek-size children.",
        },
        "queried": summary["queried"],
        "counties": ["Clatsop", "Tillamook"],
        "purpose": "Inventory Foley-size watersheds for the NCCWP desk. No invented homes, wells, PODs, or dollars.",
        "method": (
            "Oregon Framework county polygons for Clatsop and Tillamook. USGS WBD creek-size units "
            "(12-digit codes; Foley Creek = 171002020603) queried by the two-county envelope and kept "
            "only when the polygon intersects a county polygon. Areas are WBD unit totals."
        ),
        "sources": summary["sources"],
        "counts": {
            "creek_size": len(inv_units),
            "wells": totals["wells"],
            "surface_pods": totals["surface_pods"],
            "homes_off_city": totals["homes_off_city"],
        },
        "homes_note": summary["pipeline"]["homes_note"],
        "units": inv_units,
    }

    DATA.joinpath("creek_size.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": public_features}, separators=(",", ":"))
    )
    DATA.joinpath("summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    INVENTORY.write_text(json.dumps(inventory, indent=2) + "\n")
    for leftover in ("homes.geojson", "wells.geojson", "pods.geojson"):
        old = DATA / leftover
        if old.exists():
            old.unlink()

    print(json.dumps(totals, indent=2))
    print("wrote", DATA, "and", INVENTORY)


if __name__ == "__main__":
    main()
