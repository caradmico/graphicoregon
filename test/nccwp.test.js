const assert = require("assert");
const fs = require("fs");
const path = require("path");

const desk = fs.readFileSync(path.join(__dirname, "..", "nccwp", "index.html"), "utf8");
const nehalem = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "nccwp-nehalem", "data", "summary.json"), "utf8"));
const necanicum = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "nccwp-necanicum", "data", "summary.json"), "utf8"));

assert.ok(desk.includes("leaflet@1.9.4"), "Leaflet 1.9.4");
assert.ok(desk.includes("tile.openstreetmap.org"), "OSM tiles only");
assert.ok(!/arcgisonline|basemaps\.arcgis|mapbox\.com/i.test(desk), "no ArcGIS or Mapbox tiles");
assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(desk),
  "lead with why"
);
assert.ok(/On the map/.test(desk), "say what is on the map");
assert.ok(desk.includes("FeatureCollection"), "desk builds a FeatureCollection");
assert.ok(desk.includes("17100202") && desk.includes("17100201"), "Nehalem and Necanicum HUC-8 codes");
assert.ok(desk.includes("nccwp-nehalem/data/nehalem_huc8.geojson"), "stitches Nehalem polygon");
assert.ok(desk.includes("nccwp-necanicum/data/necanicum_huc8.geojson"), "stitches Necanicum polygon");
assert.ok(desk.includes("nccwp-nehalem/data/summary.json"), "stitches Nehalem counts");
assert.ok(desk.includes("nccwp-necanicum/data/summary.json"), "stitches Necanicum counts");
assert.ok(desk.includes("heatStyle") && desk.includes("homes_off_city"), "choropleth by homes_off_city");
assert.ok(desk.includes("HUC-8 ") && desk.includes("homes off city") && desk.includes("wells") && desk.includes("surface PODs"), "popup is code + aggregates");
assert.ok(desk.includes("bindPopup"), "click pop-ups on polygons");
assert.ok(desk.includes("nccwp-nehalem"), "desk links Nehalem");
assert.ok(desk.includes("nccwp-necanicum"), "desk links Necanicum");

assert.ok(!desk.includes("data/homes.geojson"), "no public home points");
assert.ok(!desk.includes("data/wells.geojson"), "no public well points");
assert.ok(!desk.includes("data/pods.geojson"), "no public POD points");
assert.ok(!/circleMarker|pointToLayer/.test(desk), "no point markers");
assert.ok(!/situs|site_address|owner_name|OWNER_LINE|owner_address/i.test(desk), "no owner or address");

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(desk), "strip invent-disclaimer speak");
assert.ok(!/OWRD\/OWRIS/.test(desk), "method essay stays out of the public panel");
assert.ok(!/\$\d/.test(desk), "do not invent dollars on the public page");

assert.strictEqual(nehalem.huc8, "17100202");
assert.strictEqual(necanicum.huc8, "17100201");
assert.ok(nehalem.counts.homes_off_city > 0 && necanicum.counts.homes_off_city > 0, "both basins already have queried counts");

console.log("nccwp: multi HUC-8 heat from existing Nehalem + Necanicum — all assertions passed");
