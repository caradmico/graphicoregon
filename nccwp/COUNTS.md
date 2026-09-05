# Where these numbers come from

## The question

How many houses in Clatsop and Tillamook are not on a city or water-district tap — and are therefore on a well, a stream, or water brought in by truck?

## First pass (two counties together)

| What | Number |
| --- | ---: |
| Houses (Census housing units, 2025) | **43,247** |
| Taps reported by community water systems | **about 35,000** |
| Houses not on a listed public system | **about 8,000** |
| Registered well logs in these creeks | **5,373** |
| Paper gap (no log, stream, truck, vacant, unit noise) | **about 2,500** |

Clatsop 23,726 houses + Tillamook 19,521 houses = 43,247.

The tap count is OHA connections for community systems only — cities and districts. Parks, camps, and schools were left off. About 21 Clatsop systems and 31 Tillamook systems. Seaside 3,903, Astoria 4,126, Cannon Beach 1,813, Warrenton 3,737, Gearhart 1,600, Manzanita 1,904, Tillamook city 1,773, Netarts 1,111, plus Youngs River–Lewis & Clark, Wickiup, Fairview, Neskowin, and the rest.

This is a first pass. It will not be exact until someone walks the lots. A building with many apartments is one taxlot and often many taps. There are not enough of those here to flip the 8,000.

## What the map is still coloring

The creek colors are an older cut. They are not the 8,000 split by creek.

| What | Number | Meaning |
| --- | ---: | --- |
| Creeks | **96** | USGS watershed units at the creek scale that intersect either county |
| Houses outside city limits | **22,689** | Residential taxlots outside city limits, assigned to a creek (10,202 Clatsop, 12,487 Tillamook) |
| Registered wells | **5,373** | Unique Oregon well-log IDs inside those creeks |
| Stream water rights | **4,081** | Unique Oregon stream points of diversion inside those creeks |

22,689 is larger than 8,000 because most houses outside town still sit on a district pipe. City limits are not a water district.

A well record or a stream right is a paper trail. It is not "this house drinks from that."

Houses on the map are only counted in Clatsop and Tillamook. A creek that runs into Columbia, Washington, Yamhill, Lincoln, or Washington State is short on the house number. Wells and stream rights are counted for the whole creek.

## How a house was kept on the map layer

Clatsop: residential property class. Farm and forest lots dropped.
Tillamook: a site address and eighty acres or less (the county file has no class field).
Off city: the lot center sits outside Oregon city limits.

Cities in the query: Astoria, Bay City, Cannon Beach, Garibaldi, Gearhart, Manzanita, Nehalem, Rockaway Beach, Seaside, Tillamook, Warrenton, Wheeler.

## Sources

1. Census housing units for Clatsop and Tillamook, 2025
2. Oregon Health Authority community water system inventory (connections)
3. Oregon Framework counties
4. USGS Watershed Boundary Dataset, creek-scale units
5. Clatsop taxlots
6. Tillamook public taxlots (Oregon Water Resources)
7. Oregon Framework city limits
8. Oregon Water Resources wells
9. Oregon Water Resources stream points of diversion

Replay the creek layer: `python3 nccwp/query_huc12.py`

The creek-scale cut was chosen so the map is not six giant basins. Foley Creek in Tillamook (~44 km²) was the size example used to pick that cut. It is not featured on the map.
