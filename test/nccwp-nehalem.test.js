const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "nccwp-nehalem");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(root, "data", "nehalem_huc8.geojson"), "utf8"));

assert.ok(html.includes("leaflet@1.9.4"), "Leaflet 1.9.4");
assert.ok(html.includes("tile.openstreetmap.org"), "OSM tiles only");
assert.ok(!/arcgisonline|basemaps\.arcgis|mapbox\.com/i.test(html), "no ArcGIS or Mapbox tiles");
assert.ok(html.includes("45.86") && html.includes("-123.49"), "Nehalem center");

assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(html),
  "lead with why"
);
assert.ok(/On the map/.test(html) && /Watershed boundary/.test(html), "say what is on the map");
assert.ok(html.includes("bindPopup"), "click pop-ups on features");
assert.ok(html.includes("HUC-8 ") && html.includes("Watershed boundary"), "short popup labels");

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(html), "strip invent-disclaimer speak");
assert.ok(!/\b\d{2,}\s+homes\b/i.test(html), "no invented home counts");
assert.ok(!/OWRD\/OWRIS/.test(html), "method essay stays out of the public panel");

assert.strictEqual(geo.type, "FeatureCollection");
assert.strictEqual(geo.features.length, 1, "one HUC-8 this PR — do not expand");
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
