# Creek-size watersheds — Tillamook and Clatsop

You’re on the map to see how many people per creek-size watershed have drinking water that might be impacted by forestry pesticides and forestry practices.

These numbers were queried from public endpoints on 2026-09-04. They are not estimates.

## Foley Creek is the size

**Foley Creek** (Tillamook), code `171002020603`, is **43.83 km²** (10,829.55 acres). That is the Foley-size unit on this desk.

Its parent, Lower Nehalem River `1710020206`, has five creek-size children: Cook Creek, Lost Creek–Nehalem River, Foley Creek, Anderson Creek–Nehalem River, and Nehalem Bay.

The public map draws every USGS WBD unit of that Foley size whose polygon intersects Clatsop or Tillamook County. **96** units. The map does not publish home, well, or stream-POD points, owner names, or addresses.

## Counts on the map

| Layer | Count | How counted |
| --- | ---: | --- |
| Creek-size units | **96** | USGS WBD Foley-size polygons intersecting Clatsop or Tillamook |
| Wells | **5,373** | Unique OWRD `wl_id` inside each creek polygon |
| Surface stream PODs | **4,081** | Unique OWRD `pod_use_id` on the Streams layer inside each creek polygon |
| Homes off city | **22,689** | Residential taxlot centroids in Clatsop or Tillamook, outside city limits, assigned to a creek polygon |

Foley Creek itself: **121** wells, **34** surface PODs, **167** homes off city.

Homes off city use the Clatsop taxlot FeatureServer and the OWRD Tillamook public taxlots only. Creeks that run into Columbia, Washington, Yamhill, Lincoln, or Washington State are incomplete for homes. Wells and surface PODs are counted for the whole creek polygon.

Breakdown of the 22,689 homes: **10,202 Clatsop** + **12,487 Tillamook**.

## Endpoints queried

1. **Oregon Framework counties** — Clatsop and Tillamook polygons
2. **USGS WBD creek-size units** — `https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/6` (12-digit codes; Foley Creek = `171002020603`)
3. **Clatsop taxlots** — `https://delta.co.clatsop.or.us/server/rest/services/Taxlots/FeatureServer/1`
4. **Tillamook taxlots** — `https://gis.wrd.state.or.us/server/rest/services/tax/Tax_Lots_Public_Query_WGS84/FeatureServer/2` where `county_name='Tillamook'`
5. **Oregon Framework city limits** — `https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/0`
6. **OWRD water wells** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/Wells_by_Theme_WGS84/FeatureServer/2`
7. **OWRD surface stream PODs** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/PODs_By_Source_WGS84/FeatureServer/3`

Each layer was pulled for the county or creek envelope, then assigned to the Foley-size polygon. Same privacy rule as [Nehalem](../nccwp-nehalem/COUNTS.md): aggregates only.

## Rules

**Selection:** the USGS creek-size polygon intersects Clatsop or Tillamook.

**Wells:** 6,437 well-log rows in those polygons collapse to **5,373** unique `wl_id`.

**Stream PODs:** 4,349 Streams-layer rows collapse to **4,081** unique `pod_use_id`.

**Clatsop residential** via `PROPERTY_C`: keep 0 / 1 / 7xx or 400 / 401 / 409; drop 5xx farm and 6xx forest.

**Tillamook residential** (no class field): keep a lot if it has a `site_address` and acreage is empty or ≤ 80.

**Off city:** centroid is outside Oregon Framework city limits.

Cities touching these counties in the query: Astoria, Bay City, Cannon Beach, Garibaldi, Gearhart, Manzanita, Nehalem, Rockaway Beach, Seaside, Tillamook, Warrenton, Wheeler.

Replay: `python3 nccwp/query_huc12.py`

Inventory: [wbd_inventory_tillamook_clatsop.json](wbd_inventory_tillamook_clatsop.json)
