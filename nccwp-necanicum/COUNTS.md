# Necanicum HUC-8 17100201 — queried counts

You’re on the map to see how many people in this HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices.

These numbers were queried from public endpoints on 2026-09-04. They are not estimates.

The public map is the HUC-8 polygon. It does not publish home, well, or stream-POD points, owner names, or addresses. Parcel-to-well assignment was not computed; the map shows the three queried aggregates.

## Counts on the map

| Layer | Count | How counted |
| --- | ---: | --- |
| Homes off city water | **4,076** | Residential taxlot centroids inside the HUC-8 and outside city limits |
| Wells | **470** | Unique OWRD `wl_id` inside the HUC-8 |
| Surface stream PODs | **347** | Unique OWRD `pod_use_id` on the Streams layer inside the HUC-8 |
| City limits touching the HUC | 5 | Seaside, Cannon Beach, Gearhart, Warrenton (north edge), Manzanita (south edge) |

Breakdown of the 4,076 homes: **3,445 Clatsop** (PROPERTY_C) + **631 Tillamook** (heuristic).

USGS WBD area for HUC-8 17100201: **820.02 km²** (202,630.43 acres).

## Endpoints queried

1. **USGS WBD HUC-8** — `https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4` where `huc8='17100201'`
2. **Clatsop taxlots** — `https://delta.co.clatsop.or.us/server/rest/services/Taxlots/FeatureServer/1`
3. **Tillamook taxlots** — `https://gis.wrd.state.or.us/server/rest/services/tax/Tax_Lots_Public_Query_WGS84/FeatureServer/2` where `county_name='Tillamook'` (this public layer has no property class)
4. **Oregon Framework city limits** — `https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/0`
5. **OWRD water wells** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/Wells_by_Theme_WGS84/FeatureServer/2`
6. **OWRD surface stream PODs** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/PODs_By_Source_WGS84/FeatureServer/3`

Each layer was pulled for the HUC-8 envelope, then clipped to the USGS polygon. Same method as [Nehalem](../nccwp-nehalem/COUNTS.md).

## Rules

**Clatsop residential** via `PROPERTY_C`: keep 0 / 1 / 7xx or 400 / 401 / 409; drop 5xx farm and 6xx forest. 14,584 Clatsop lots sit in the HUC; 12,278 are residential by that rule; **3,445** remain off-city (the rest sit in Seaside, Cannon Beach, Gearhart, or the Warrenton edge). Off-city classes kept: 101 (1,221), 401 (1,058), 100 (552), 400 (299), 090 (53), 019 (50), 010 (46), 009 (45), 109 (36), 409 (25), and smaller 0xx / 1xx / 707 counts.

**Tillamook residential** (no class field): keep a lot if it has a `site_address` and acreage is empty or ≤ 80. 2,760 lots in the HUC; 2,148 meet the heuristic; 1,517 of those centroids sit inside city limits (Manzanita); **631** remain off-city.

**Off city:** centroid is inside HUC-8 17100201 and outside Oregon Framework city limits.

**Wells:** 470 well-log rows in the HUC are already unique on `wl_id` — **470**.

**Stream PODs:** 347 Streams-layer rows in the HUC are already unique on `pod_use_id` — **347**.

Clatsop and Tillamook are the counties on those two taxlot services. The USGS Necanicum polygon runs the Clatsop coast from the Warrenton edge south to Manzanita.

Replay: `python3 nccwp-necanicum/query_layers.py`
