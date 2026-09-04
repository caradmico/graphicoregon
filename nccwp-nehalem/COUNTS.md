# Nehalem HUC-8 17100202 — queried counts

You’re on the map to see how many people in this HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices.

These numbers were queried from public endpoints on 2026-09-04. They are not estimates.

## Public map metric

The public page is a **single HUC-8 polygon heat**, not home / well / POD points.

**Choropleth fill uses `homes_off_city` (3,873)** from `data/summary.json`: residential parcels inside HUC-8 17100202 and outside city limits. That is the queried count of homes not on city water. It is a **homes-off-city proxy** for well-related residential intensity — not a parcel-level assignment of each home to a well or a surface POD. This pipeline did not compute that join.

The watershed popup shows those same queried aggregates, labeled as what they are:

- **3,873** residential parcels in this HUC-8 off city water (`homes_off_city`)
- **1,554** registered wells in this HUC-8 (`wells`, unique OWRD `wl_id`)
- **1,143** surface stream PODs in this HUC-8 (`surface_pods`, unique OWRD `pod_use_id`)

Owner names and addresses are not written to files the client loads. `homes.geojson` / `wells.geojson` / `pods.geojson` are not on the public path.

## Counts behind the heat

| Metric | Count | How counted |
| --- | ---: | --- |
| Homes off city water | **3,873** | Residential taxlot centroids inside the HUC-8 and outside city limits |
| Wells | **1,554** | Unique OWRD `wl_id` inside the HUC-8 |
| Surface stream PODs | **1,143** | Unique OWRD `pod_use_id` on the Streams layer inside the HUC-8 |
| City limits touching the HUC | 5 | Manzanita, Nehalem, Wheeler, Vernonia, Rockaway Beach (sliver) |

Breakdown of the 3,873 homes: **1,808 Clatsop** (PROPERTY_C) + **2,065 Tillamook** (heuristic).

USGS WBD area for HUC-8 17100202: **2,213.88 km²** (547,061.34 acres).

## Endpoints queried

1. **USGS WBD HUC-8** — `https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4` where `huc8='17100202'`
2. **Clatsop taxlots** — `https://delta.co.clatsop.or.us/server/rest/services/Taxlots/FeatureServer/1`
3. **Tillamook taxlots** — `https://gis.wrd.state.or.us/server/rest/services/tax/Tax_Lots_Public_Query_WGS84/FeatureServer/2` where `county_name='Tillamook'` (this public layer has no property class)
4. **Oregon Framework city limits** — `https://navigator.state.or.us/arcgis/rest/services/Framework/Admin_Bounds/MapServer/0`
5. **OWRD water wells** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/Wells_by_Theme_WGS84/FeatureServer/2`
6. **OWRD surface stream PODs** — `https://gis.wrd.state.or.us/server/rest/services/dynamic/PODs_By_Source_WGS84/FeatureServer/3`

Each layer was pulled for the HUC-8 envelope, then clipped to the USGS polygon.

## Rules

**Clatsop residential** via `PROPERTY_C`: keep 0 / 1 / 7xx or 400 / 401 / 409; drop 5xx farm and 6xx forest. In this HUC that is 1,808 lots (no 7xx fell inside the watershed). Classes kept: 101 (483), 401 (572), 100 (288), 400 (168), 009 (83), 109 (75), 019 (62), 409 (44), and smaller 0xx counts.

**Tillamook residential** (no class field): keep a lot if it has a `site_address` and acreage is empty or ≤ 80. 3,167 lots in the HUC; 1,102 of those centroids sit inside city limits; **2,065** remain off-city.

**Off city:** centroid is inside HUC-8 17100202 and outside Oregon Framework city limits.

**Wells:** 1,958 well-log rows in the HUC collapse to **1,554** unique `wl_id`.

**Stream PODs:** 1,242 Streams-layer rows in the HUC collapse to **1,143** unique `pod_use_id`.

Clatsop and Tillamook are the counties on those two taxlot services. The OWRD public taxlot layer returned Tillamook only for this envelope.

## Versus the ~3,454 / ~1,554 / ~1,143 ballpark

Wells (1,554) and stream PODs (1,143) match that ballpark once well logs are unique on `wl_id` and PODs are unique on `pod_use_id`.

Homes came out **3,873**, not 3,454. This query keeps vacant class 0xx (178 lots) and vacant residential 100 (288 lots) because the PROPERTY_C rule names class 0 and 1. Dropping those vacant classes would be 3,407. The map uses the queried 3,873.

Replay: `python3 nccwp-nehalem/query_layers.py`
