#!/usr/bin/env python3
"""Query public GIS endpoints for Necanicum HUC-8 17100201 drinking-water layers.

Writes data/*.geojson and data/summary.json. Numbers come from the endpoints;
nothing is invented. Same method as nccwp-nehalem/query_layers.py.
"""
from __future__ import annotations

import json
import time
from collections import Counter
from pathlib import Path
import requests
from shapely.geometry import mapping, shape
from shapely.ops import unary_union
from shapely.prepared import prep
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
CACHE = Path("/tmp/nccwp-necanicum-cache")
CACHE.mkdir(parents=True, exist_ok=True)

HUC8 = "17100201"
HUC_NAME = "Necanicum"

UA = "GraphicOregon-NCCWP/1.0 (https://caradmico.github.io/graphicoregon/nccwp-necanicum/)"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "application/json"})

USGS_HUC8 = "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4/query"
CLATSOP = "https://delta.co.clatsop.or.us/server/rest/services/Taxlots/FeatureServer/1/query"
TILLAMOOK = "https://gis.wrd.state.or.us/server/rest/services/tax/Tax_Lots_Public_Query_WGS84/FeatureServer/2/query"
CITIES = "https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/0/query"
WELLS = "https://gis.wrd.state.or.us/server/rest/services/dynamic/Wells_by_Theme_WGS84/FeatureServer/2/query"
PODS = "https://gis.wrd.state.or.us/server/rest/services/dynamic/PODs_By_Source_WGS84/FeatureServer/3/query"


def retry_sleep(attempt: int) -> None:
    time.sleep(min(32, 2 ** attempt))


def post_json(url: str, payload: dict, tries: int = 5) -> dict:
    last = None
    for attempt in range(tries):
        try:
            r = SESSION.post(url, data=payload, timeout=120)
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
    """Paginate JSON features with centroids (no heavy polygons)."""
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


def bbox_of(geom) -> list[float]:
    minx, miny, maxx, maxy = geom.bounds
    pad = 0.01
    return [minx - pad, miny - pad, maxx + pad, maxy + pad]


def geom_payload(bbox: list[float]) -> dict:
    xmin, ymin, xmax, ymax = bbox
    return {
        "geometry": json.dumps(
            {"xmin": xmin, "ymin": ymin, "xmax": xmax, "ymax": ymax, "spatialReference": {"wkid": 4326}}
        ),
        "geometryType": "esriGeometryEnvelope",
        "spatialRel": "esriSpatialRelIntersects",
    }


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
    """Heuristic: a home-like lot when the public layer has no property class.

    Count a lot if it has a site address (a place someone can live) and is not
    a large timber/ranch tract. Empty addresses stay out.
    """
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
    if geom:
        g = shape(geom)
        if not g.is_empty:
            p = g.representative_point()
            return float(p.x), float(p.y)
    return None


def in_prepared(prepared, x, y) -> bool:
    from shapely.geometry import Point

    return prepared.contains(Point(x, y))


def fetch_huc8() -> dict:
    cache = CACHE / "necanicum_huc8.geojson"
    if cache.exists():
        print("HUC-8 cache hit")
        return json.loads(cache.read_text())
    print(f"Query USGS WBD HUC-8 {HUC8}")
    feats = query_all(
        USGS_HUC8,
        {
            "where": f"huc8='{HUC8}'",
            "outFields": "huc8,name,states,areasqkm,areaacres",
        },
        page=10,
    )
    if not feats:
        raise RuntimeError(f"USGS WBD returned no HUC-8 {HUC8}")
    feat = feats[0]
    props = feat.get("properties") or {}
    out = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": props.get("name") or HUC_NAME,
                    "huc8": str(props.get("huc8") or HUC8),
                    "states": props.get("states") or "OR",
                    "areasqkm": props.get("areasqkm"),
                    "areaacres": props.get("areaacres"),
                    "source": "USGS Watershed Boundary Dataset",
                    "source_url": "https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4",
                },
                "geometry": feat["geometry"],
            }
        ],
    }
    cache.write_text(json.dumps(out, separators=(",", ":")))
    return out


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    huc_fc = fetch_huc8()
    huc_feat = huc_fc["features"][0]
    huc_geom = make_valid(shape(huc_feat["geometry"]))
    huc_prep = prep(huc_geom)
    bbox = bbox_of(huc_geom)
    env = geom_payload(bbox)
    print(f"HUC-8 bbox {bbox} area_km2={huc_feat['properties'].get('areasqkm')}")

    print("Query Oregon Framework city limits")
    city_cache = CACHE / "cities.geojson"
    if city_cache.exists():
        city_feats = json.loads(city_cache.read_text())["features"]
        print(f"  cache {len(city_feats)}")
    else:
        city_feats = query_all(
            CITIES,
            {
                **env,
                "where": "1=1",
                "outFields": "CITY_NAME,acres",
            },
            page=200,
        )
        city_cache.write_text(json.dumps({"type": "FeatureCollection", "features": city_feats}))
    city_in = []
    city_geoms = []
    for f in city_feats:
        g = make_valid(shape(f["geometry"]))
        if g.is_empty or not g.intersects(huc_geom):
            continue
        name = (f.get("properties") or {}).get("CITY_NAME") or (f.get("properties") or {}).get("city_name")
        city_in.append(
            {
                "type": "Feature",
                "properties": {"name": name, "source": "Oregon Framework Admin_Bounds city limits"},
                "geometry": mapping(g.intersection(huc_geom) if not g.within(huc_geom) else g),
            }
        )
        city_geoms.append(g)
    cities_union = unary_union(city_geoms) if city_geoms else None
    cities_prep = prep(cities_union) if cities_union is not None else None
    print(f"  cities intersecting HUC-8: {[c['properties']['name'] for c in city_in]}")

    print("Query Clatsop taxlots")
    cl_cache = CACHE / "clatsop.json"
    if cl_cache.exists():
        cl_raw = json.loads(cl_cache.read_text())
        print(f"  cache {len(cl_raw)}")
    else:
        cl_raw = query_centroids(
            CLATSOP,
            {
                **env,
                "where": "1=1",
                "outFields": "OBJECTID,TAXLOTKEY,PROPERTY_C,STAT_CLASS",
            },
            page=2000,
        )
        cl_cache.write_text(json.dumps(cl_raw))
    cl_codes = Counter(str((f.get("attributes") or {}).get("PROPERTY_C") or "") for f in cl_raw)
    print(f"  PROPERTY_C top: {cl_codes.most_common(20)}")

    print("Query OWRD/Tillamook taxlots")
    ti_cache = CACHE / "tillamook.json"
    if ti_cache.exists():
        ti_raw = json.loads(ti_cache.read_text())
        print(f"  cache {len(ti_raw)}")
    else:
        ti_raw = query_centroids(
            TILLAMOOK,
            {
                **env,
                "where": "county_name='Tillamook'",
                "outFields": "OBJECTID,county_name,maptaxlot,taxlot,site_address,taxlot_acre",
            },
            page=2000,
        )
        ti_cache.write_text(json.dumps(ti_raw))

    print("Query OWRD wells")
    we_cache = CACHE / "wells.geojson"
    if we_cache.exists():
        we_raw = json.loads(we_cache.read_text())["features"]
        print(f"  cache {len(we_raw)}")
    else:
        we_raw = query_all(
            WELLS,
            {
                **env,
                "where": "1=1",
                "outFields": "wl_id,type_of_log,wl_nbr,well_tag_nbr,exempt_use,primary_use,wl_county_code",
            },
            page=2000,
        )
        we_cache.write_text(json.dumps({"type": "FeatureCollection", "features": we_raw}))

    print("Query OWRD surface stream PODs")
    po_cache = CACHE / "pods.geojson"
    if po_cache.exists():
        po_raw = json.loads(po_cache.read_text())["features"]
        print(f"  cache {len(po_raw)}")
    else:
        po_raw = query_all(
            PODS,
            {
                **env,
                "where": "1=1",
                "outFields": "pod_display,pod_display_short,wris_link,pod_use_id,pod_location_id,use_code,use_code_description,source,stream_name,wr_type",
            },
            page=2000,
        )
        po_cache.write_text(json.dumps({"type": "FeatureCollection", "features": po_raw}))

    homes = []
    cl_in_huc = cl_res = cl_off = 0
    cl_res_codes = Counter()
    for f in cl_raw:
        xy = centroid_xy(f)
        if not xy:
            continue
        x, y = xy
        if not in_prepared(huc_prep, x, y):
            continue
        cl_in_huc += 1
        attrs = f.get("attributes") or {}
        code = attrs.get("PROPERTY_C")
        if not clatsop_residential(code):
            continue
        cl_res += 1
        cl_res_codes[str(code)] += 1
        in_city = cities_prep is not None and in_prepared(cities_prep, x, y)
        if in_city:
            continue
        cl_off += 1
        homes.append({"county": "Clatsop", "class": str(code) if code is not None else ""})

    ti_in_huc = ti_res = ti_off = 0
    for f in ti_raw:
        xy = centroid_xy(f)
        if not xy:
            continue
        x, y = xy
        if not in_prepared(huc_prep, x, y):
            continue
        ti_in_huc += 1
        attrs = f.get("attributes") or {}
        if not tillamook_residential(attrs):
            continue
        ti_res += 1
        acres = attrs.get("taxlot_acre")
        in_city = cities_prep is not None and in_prepared(cities_prep, x, y)
        if in_city:
            continue
        ti_off += 1
        homes.append({"county": "Tillamook", "class": "", "acres": acres})

    wells = []
    seen_wells = set()
    well_rows_in_huc = 0
    for f in we_raw:
        g = f.get("geometry")
        if not g:
            continue
        x, y = g["coordinates"][:2]
        if not in_prepared(huc_prep, x, y):
            continue
        well_rows_in_huc += 1
        p = f.get("properties") or {}
        key = p.get("wl_id")
        if key in seen_wells:
            continue
        if key is not None:
            seen_wells.add(key)
        wells.append({"wl_id": key})

    pods = []
    seen_pods = set()
    pod_rows_in_huc = 0
    pod_uses = Counter()
    for f in po_raw:
        g = f.get("geometry")
        if not g:
            continue
        x, y = g["coordinates"][:2]
        if not in_prepared(huc_prep, x, y):
            continue
        pod_rows_in_huc += 1
        p = f.get("properties") or {}
        use = (p.get("use_code_description") or p.get("use_code") or "").strip()
        pod_uses[use] += 1
        key = p.get("pod_use_id")
        if key in seen_pods:
            continue
        if key is not None:
            seen_pods.add(key)
        pods.append({"pod_use_id": key, "use": use})

    summary = {
        "huc8": HUC8,
        "name": HUC_NAME,
        "queried": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "area": {
            "areasqkm": huc_feat["properties"].get("areasqkm"),
            "areaacres": huc_feat["properties"].get("areaacres"),
        },
        "counts": {
            "homes_off_city": len(homes),
            "homes_clatsop_off_city": cl_off,
            "homes_tillamook_off_city": ti_off,
            "wells": len(wells),
            "surface_pods": len(pods),
            "cities": len(city_in),
        },
        "raw_rows": {
            "wells_in_huc": well_rows_in_huc,
            "surface_pods_in_huc": pod_rows_in_huc,
        },
        "pipeline": {
            "clatsop_in_huc": cl_in_huc,
            "clatsop_residential": cl_res,
            "clatsop_off_city": cl_off,
            "clatsop_property_c_residential": dict(cl_res_codes),
            "tillamook_in_huc": ti_in_huc,
            "tillamook_heuristic_residential": ti_res,
            "tillamook_off_city": ti_off,
            "wells_rows_in_huc": well_rows_in_huc,
            "wells_unique_wl_id": len(wells),
            "pods_rows_in_huc": pod_rows_in_huc,
            "pods_unique_pod_use_id": len(pods),
            "city_names": [c["properties"]["name"] for c in city_in],
            "pod_uses": dict(pod_uses.most_common()),
        },
        "sources": {
            "huc8": USGS_HUC8.replace("/query", ""),
            "clatsop_taxlots": CLATSOP.replace("/query", ""),
            "tillamook_taxlots": TILLAMOOK.replace("/query", ""),
            "city_limits": CITIES.replace("/query", ""),
            "wells": WELLS.replace("/query", ""),
            "surface_pods": PODS.replace("/query", ""),
        },
        "rules": {
            "clatsop_residential": "PROPERTY_C is 0, 1, 7xx, or 400/401/409; exclude 5xx farm and 6xx forest",
            "tillamook_residential": "no class field; site_address present and taxlot_acre is null or <= 80",
            "off_city": f"centroid inside HUC-8 {HUC8} and outside Oregon Framework city limits",
            "public_map": "HUC-8 polygon heat only; no home, well, or POD points; no owner or address",
        },
    }

    DATA.joinpath("necanicum_huc8.geojson").write_text(json.dumps(huc_fc, separators=(",", ":")))
    DATA.joinpath("cities.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": city_in}, separators=(",", ":")))
    DATA.joinpath("summary.json").write_text(json.dumps(summary, indent=2))

    print(json.dumps(summary["counts"], indent=2))
    print("wrote", DATA)


if __name__ == "__main__":
    main()
