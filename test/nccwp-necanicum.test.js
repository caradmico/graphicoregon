const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "nccwp-necanicum");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(root, "data", "necanicum_huc8.geojson"), "utf8"));
const summary = JSON.parse(fs.readFileSync(path.join(root, "data", "summary.json"), "utf8"));
const cities = JSON.parse(fs.readFileSync(path.join(root, "data", "cities.geojson"), "utf8"));
const countsMd = fs.readFileSync(path.join(root, "COUNTS.md"), "utf8");
const query = fs.readFileSync(path.join(root, "query_layers.py"), "utf8");
const desk = fs.readFileSync(path.join(__dirname, "..", "nccwp", "index.html"), "utf8");

assert.ok(/location\.replace\(["']\.\.\/nccwp\/["']\)/.test(html), "old Necanicum URL redirects to the desk map");
assert.ok(html.includes('http-equiv="refresh"') && html.includes("../nccwp/"), "meta refresh to nccwp/");
assert.ok(html.includes('href="../nccwp/"'), "no-JS link to the desk map");
assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(html),
  "lead with why"
);
assert.ok(!html.includes("leaflet@"), "redirect is not a second Leaflet map");
assert.ok(!html.includes("data/homes.geojson"), "no public home points");
assert.ok(!html.includes("data/wells.geojson"), "no public well points");
assert.ok(!html.includes("data/pods.geojson"), "no public POD points");
assert.ok(!/circleMarker|pointToLayer/.test(html), "no point markers");
assert.ok(!/situs|site_address|owner_name|OWNER_LINE|owner_address/i.test(html), "no owner or address on the page");

["homes.geojson", "wells.geojson", "pods.geojson"].forEach((name) => {
  assert.ok(!fs.existsSync(path.join(root, "data", name)), name + " is not in the public data folder");
});

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(html), "strip invent-disclaimer speak");
assert.ok(!/OWRD\/OWRIS/.test(html), "method essay stays out of the public page");
assert.ok(!/\$|KEEP/i.test(html), "no invented dollars or KEEP");

assert.strictEqual(geo.type, "FeatureCollection");
assert.strictEqual(geo.features.length, 1, "one HUC-8");
const feat = geo.features[0];
assert.strictEqual(feat.properties.huc8, "17100201");
assert.strictEqual(feat.properties.name, "Necanicum");
assert.strictEqual(feat.properties.states, "OR");
assert.ok(typeof feat.properties.areasqkm === "number" && feat.properties.areasqkm > 0);
assert.ok(feat.geometry && feat.geometry.type === "Polygon");
assert.ok(feat.geometry.coordinates[0].length > 100, "real USGS ring, not a toy box");
assert.ok(!JSON.stringify(feat.properties).match(/situs|address|owner/i), "HUC properties have no PII");

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
assert.ok(Math.abs(lat - 45.96) < 0.05, "centroid lat near 45.96, got " + lat);
assert.ok(Math.abs(lon + 123.92) < 0.05, "centroid lon near -123.92, got " + lon);

assert.strictEqual(summary.huc8, "17100201");
assert.strictEqual(summary.name, "Necanicum");
assert.strictEqual(summary.counts.homes_off_city, 4076);
assert.strictEqual(summary.counts.wells, 470);
assert.strictEqual(summary.counts.surface_pods, 347);
assert.strictEqual(summary.counts.cities, cities.features.length);
assert.ok(summary.counts.homes_off_city > 1000, "real home query, not an empty layer");
assert.ok(summary.counts.wells > 100, "real well query");
assert.ok(summary.counts.surface_pods > 100, "real POD query");
assert.strictEqual(
  summary.counts.homes_clatsop_off_city + summary.counts.homes_tillamook_off_city,
  summary.counts.homes_off_city
);
assert.ok(/polygon heat only/i.test(summary.rules.public_map), "summary records the privacy rule");
assert.ok(!JSON.stringify(summary).match(/situs|owner_name|OWNER_LINE/i), "summary has no owner or address");

cities.features.forEach((city) => {
  const keys = Object.keys(city.properties || {});
  assert.ok(keys.every((k) => /^(name|source)$/i.test(k)), "city properties stay name/source, got " + keys.join(","));
});

assert.ok(countsMd.includes("4,076") || countsMd.includes("4076"), "COUNTS.md has queried homes");
assert.ok(countsMd.includes("470"), "COUNTS.md has queried wells");
assert.ok(countsMd.includes("347"), "COUNTS.md has queried PODs");
assert.ok(countsMd.includes("delta.co.clatsop.or.us"), "COUNTS.md cites Clatsop endpoint");
assert.ok(countsMd.includes("Wells_by_Theme_WGS84"), "COUNTS.md cites wells endpoint");
assert.ok(countsMd.includes("17100201"), "COUNTS.md names this HUC");
assert.ok(/does not publish home, well, or stream-POD points/i.test(countsMd), "COUNTS.md states the privacy rule");

assert.ok(!/data\/homes\.geojson/.test(query), "query does not write public home points");
assert.ok(!/SITUS_ADDR|OWNER_LINE|owner_name|owner_address/.test(query), "query does not pull owner or situs into public fields");

assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(desk),
  "desk leads with why"
);
assert.ok(desk.includes("nccwp-necanicum/data/"), "desk reuses Necanicum queried data");
assert.ok(desk.includes("nccwp-nehalem/data/"), "desk reuses Nehalem queried data");
assert.ok(!/href=["']\.\.\/nccwp-nehalem\/["']/.test(desk), "desk does not send people to a second Nehalem map");
assert.ok(!/href=["']\.\.\/nccwp-necanicum\/["']/.test(desk), "desk does not send people to a second Necanicum map");
assert.ok(!banned.test(desk), "desk has no invent-speak");

console.log("nccwp-necanicum: data + privacy stand; public URL redirects to desk — all assertions passed");
