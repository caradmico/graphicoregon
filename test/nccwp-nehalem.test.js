const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "nccwp-nehalem");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(root, "data", "nehalem_huc8.geojson"), "utf8"));

assert.ok(html.includes("leaflet@1.9.4"), "Leaflet 1.9.4");
assert.ok(html.includes("tile.openstreetmap.org"), "OSM tiles only");
assert.ok(!/arcgisonline|basemaps\.arcgis|mapbox\.com/i.test(html), "no ArcGIS or Mapbox tiles");
assert.ok(/NCCWP · public draft/.test(html), "public draft kicker");
assert.ok(/PENDING|Pending/.test(html), "home counts stay pending");
assert.ok(!/\b\d{2,}\s+homes\b/i.test(html), "do not invent home counts");
assert.ok(html.includes("HUC-8 → residential outside forestry/ag/city water → OWRD/OWRIS → simple home counts"));
assert.ok(html.includes("45.86") && html.includes("-123.49"), "Nehalem center");

assert.strictEqual(geo.type, "FeatureCollection");
assert.strictEqual(geo.features.length, 1, "one HUC-8 feature");
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
