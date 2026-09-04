const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "nccwp-nehalem");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(root, "data", "nehalem_huc8.geojson"), "utf8"));
const summary = JSON.parse(fs.readFileSync(path.join(root, "data", "summary.json"), "utf8"));
const homes = JSON.parse(fs.readFileSync(path.join(root, "data", "homes.geojson"), "utf8"));
const wells = JSON.parse(fs.readFileSync(path.join(root, "data", "wells.geojson"), "utf8"));
const pods = JSON.parse(fs.readFileSync(path.join(root, "data", "pods.geojson"), "utf8"));
const cities = JSON.parse(fs.readFileSync(path.join(root, "data", "cities.geojson"), "utf8"));
const countsMd = fs.readFileSync(path.join(root, "COUNTS.md"), "utf8");

assert.ok(html.includes("leaflet@1.9.4"), "Leaflet 1.9.4");
assert.ok(html.includes("tile.openstreetmap.org"), "OSM tiles only");
assert.ok(!/arcgisonline|basemaps\.arcgis|mapbox\.com/i.test(html), "no ArcGIS or Mapbox tiles");
assert.ok(html.includes("45.86") && html.includes("-123.49"), "Nehalem center");

assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(html),
  "lead with why"
);
assert.ok(/On the map/.test(html), "say what is on the map");
assert.ok(html.includes("bindPopup"), "click pop-ups on features");
assert.ok(html.includes("HUC-8 ") && html.includes("Watershed boundary"), "short popup labels");
assert.ok(html.includes("Homes off city"), "homes on the panel");
assert.ok(html.includes("data/summary.json"), "panel reads queried summary");
assert.ok(html.includes("data/homes.geojson") && html.includes("data/wells.geojson") && html.includes("data/pods.geojson"));
assert.ok(html.includes("homes_off_city") && html.includes("surface_pods"), "counts from summary.json");

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(html), "strip invent-disclaimer speak");
assert.ok(!/OWRD\/OWRIS/.test(html), "method essay stays out of the public panel");

assert.strictEqual(geo.type, "FeatureCollection");
assert.strictEqual(geo.features.length, 1, "one HUC-8");
const feat = geo.features[0];
assert.strictEqual(feat.properties.huc8, "17100202");
assert.strictEqual(feat.properties.name, "Nehalem");
assert.strictEqual(feat.properties.states, "OR");
assert.ok(typeof feat.properties.areasqkm === "number" && feat.properties.areasqkm > 0);
assert.ok(feat.geometry && feat.geometry.type === "Polygon");
assert.ok(feat.geometry.coordinates[0].length > 100, "real USGS ring, not a toy box");

function bbox(coords, acc) {
  if (typeof coords[0] === "number") {
    acc[0] = Math.min(acc[0], coords[0]);
    acc[1] = Math.min(acc[1], coords[1]);
    acc[2] = Math.max(acc[2], coords[0]);
    acc[3] = Math.max(acc[3], coords[1]);
    return;
  }
  coords.forEach((c) => bbox(c, acc));
}
const b = [180, 90, -180, -90];
bbox(feat.geometry.coordinates, b);
const lon = (b[0] + b[2]) / 2;
const lat = (b[1] + b[3]) / 2;
assert.ok(Math.abs(lat - 45.86) < 0.05, "centroid lat near 45.86, got " + lat);
assert.ok(Math.abs(lon + 123.49) < 0.05, "centroid lon near -123.49, got " + lon);

assert.strictEqual(summary.huc8, "17100202");
assert.strictEqual(summary.counts.homes_off_city, homes.features.length);
assert.strictEqual(summary.counts.wells, wells.features.length);
assert.strictEqual(summary.counts.surface_pods, pods.features.length);
assert.strictEqual(summary.counts.cities, cities.features.length);
assert.ok(summary.counts.homes_off_city > 1000, "real home query, not an empty layer");
assert.ok(summary.counts.wells > 1000, "real well query");
assert.ok(summary.counts.surface_pods > 1000, "real POD query");
assert.strictEqual(summary.counts.homes_clatsop_off_city + summary.counts.homes_tillamook_off_city, summary.counts.homes_off_city);

const wellIds = new Set(wells.features.map((f) => f.properties.wl_id));
assert.strictEqual(wellIds.size, wells.features.length, "wells unique on wl_id");
const podIds = new Set(pods.features.map((f) => f.properties.pod_use_id));
assert.strictEqual(podIds.size, pods.features.length, "pods unique on pod_use_id");

assert.ok(countsMd.includes("3,873") || countsMd.includes("3873"), "COUNTS.md has queried homes");
assert.ok(countsMd.includes("1,554") || countsMd.includes("1554"), "COUNTS.md has queried wells");
assert.ok(countsMd.includes("1,143") || countsMd.includes("1143"), "COUNTS.md has queried PODs");
assert.ok(countsMd.includes("delta.co.clatsop.or.us"), "COUNTS.md cites Clatsop endpoint");
assert.ok(countsMd.includes("Wells_by_Theme_WGS84"), "COUNTS.md cites wells endpoint");
