# Where these numbers come from

The map is 96 USGS creek polygons that touch Clatsop or Tillamook. Color is a count inside each creek, not a point on a house.

Queried from public servers on 4 September 2026.

## Counts

| What | Number | Meaning |
| --- | ---: | --- |
| Creeks | **96** | USGS watershed units at the creek scale that intersect either county |
| Houses off city water | **22,689** | Residential taxlots outside city limits, assigned to a creek (10,202 Clatsop, 12,487 Tillamook) |
| Registered wells | **5,373** | Unique Oregon well-log IDs inside those creeks |
| Stream water rights | **4,081** | Unique Oregon stream points of diversion inside those creeks |

A well record or a stream right is a paper trail. It is not "this house drinks from that."

Houses are only counted in Clatsop and Tillamook. A creek that runs into Columbia, Washington, Yamhill, Lincoln, or Washington State is short on the house number. Wells and stream rights are counted for the whole creek.

## How a house was kept

Clatsop: residential property class. Farm and forest lots dropped.
Tillamook: a site address and eighty acres or less (the county file has no class field).
Off city: the lot center sits outside Oregon city limits.

Cities in the query: Astoria, Bay City, Cannon Beach, Garibaldi, Gearhart, Manzanita, Nehalem, Rockaway Beach, Seaside, Tillamook, Warrenton, Wheeler.

## Sources

1. Oregon Framework counties
2. USGS Watershed Boundary Dataset, creek-scale units
3. Clatsop taxlots
4. Tillamook public taxlots (Oregon Water Resources)
5. Oregon Framework city limits
6. Oregon Water Resources wells
7. Oregon Water Resources stream points of diversion

Replay: `python3 nccwp/query_huc12.py`

The creek-scale cut was chosen so the map is not six giant basins. Foley Creek in Tillamook (~44 km²) was the size example used to pick that cut. It is not featured on the map.
