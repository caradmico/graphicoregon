const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "nccwp-nehalem");
const dataDir = path.join(root, "data");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(dataDir, "nehalem_huc8.geojson"), "utf8"));
const summary = JSON.parse(fs.readFileSync(path.join(dataDir, "summary.json"), "utf8"));
const cities = JSON.parse(fs.readFileSync(path.join(dataDir, "cities.geojson"), "utf8"));
const countsMd = fs.readFileSync(path.join(root, "COUNTS.md"), "utf8");
const queryPy = fs.readFileSync(path.join(root, "query_layers.py"), "utf8");

assert.ok(/location\.replace\(["']\.\.\/nccwp\/["']\)/.test(html), "old Nehalem URL redirects to the desk map");
assert.ok(html.includes('http-equiv="refresh"') && html.includes("../nccwp/"), "meta refresh to nccwp/");
assert.ok(html.includes('href="../nccwp/"'), "no-JS link to the desk map");
assert.ok(
  /how many people per HUC-8 watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(html),
  "lead with why"
);
assert.ok(!html.includes("leaflet@"), "redirect is not a second Leaflet map");
assert.ok(!/circleMarker|pointToLayer/.test(html), "no point markers");
assert.ok(!html.includes("data/homes.geojson"), "do not load homes points");
assert.ok(!html.includes("data/wells.geojson"), "do not load well points");
assert.ok(!html.includes("data/pods.geojson"), "do not load POD points");
assert.ok(!html.includes("p.situs") && !html.includes("SITUS_ADDR"), "no situs in popups");
assert.ok(!/owner_name|OWNER_LINE|owner_address/i.test(html), "no owner fields on the public page");

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(html), "strip invent-disclaimer speak");
assert.ok(!/OWRD\/OWRIS/.test(html), "method essay stays out of the public page");
assert.ok(!/8-HUC KEEP/.test(html + countsMd), "do not claim 8-HUC KEEP");
assert.ok(!/\$\d/.test(html), "do not invent dollars on the public page");

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
assert.strictEqual(summary.public_map.choropleth_metric, "homes_off_city");
assert.deepStrictEqual(summary.public_map.popup_metrics, ["homes_off_city", "wells", "surface_pods"]);
assert.ok(summary.counts.homes_off_city > 1000, "real home query, not an empty layer");
assert.ok(summary.counts.wells > 1000, "real well query");
assert.ok(summary.counts.surface_pods > 1000, "real POD query");
assert.strictEqual(summary.counts.homes_off_city, 3873);
assert.strictEqual(summary.counts.wells, 1554);
assert.strictEqual(summary.counts.surface_pods, 1143);
assert.strictEqual(summary.counts.cities, cities.features.length);
assert.strictEqual(
  summary.counts.homes_clatsop_off_city + summary.counts.homes_tillamook_off_city,
  summary.counts.homes_off_city
);

["homes.geojson", "wells.geojson", "pods.geojson"].forEach((name) => {
  assert.ok(!fs.existsSync(path.join(dataDir, name)), name + " must not be on the public path");
});

const privateKey = /^(owner|owner_name|owner_address|owner_line|situs|situs_addr|site_address|address)$/i;
function assertPublicProps(collection, label) {
  for (const f of collection.features || []) {
    for (const key of Object.keys(f.properties || {})) {
      assert.ok(!privateKey.test(key), label + " must not ship " + key);
      assert.ok(!/owner|situs|addr/i.test(key), label + " must not ship " + key);
    }
  }
}
assertPublicProps(geo, "huc8");
assertPublicProps(cities, "cities");

assert.ok(countsMd.includes("homes_off_city"), "COUNTS.md names the choropleth metric");
assert.ok(/homes-off-city proxy/i.test(countsMd), "COUNTS.md labels the proxy honestly");
assert.ok(/not a parcel-level assignment/i.test(countsMd), "COUNTS.md does not invent well assignment");
assert.ok(countsMd.includes("3,873") || countsMd.includes("3873"), "COUNTS.md has queried homes");
assert.ok(countsMd.includes("1,554") || countsMd.includes("1554"), "COUNTS.md has queried wells");
assert.ok(countsMd.includes("1,143") || countsMd.includes("1143"), "COUNTS.md has queried PODs");
assert.ok(countsMd.includes("delta.co.clatsop.or.us"), "COUNTS.md cites Clatsop endpoint");
assert.ok(countsMd.includes("Wells_by_Theme_WGS84"), "COUNTS.md cites wells endpoint");

assert.ok(queryPy.includes("write_public_geojson"), "pipeline writes stripped public geojson");
assert.ok(queryPy.includes("BANNED_PUBLIC_PROP"), "pipeline bans owner/address on public writes");
assert.ok(!/DATA\.joinpath\("homes\.geojson"\)/.test(queryPy), "pipeline does not write homes.geojson to data/");
assert.ok(!/DATA\.joinpath\("wells\.geojson"\)/.test(queryPy), "pipeline does not write wells.geojson to data/");
assert.ok(!/DATA\.joinpath\("pods\.geojson"\)/.test(queryPy), "pipeline does not write pods.geojson to data/");

console.log("nccwp-nehalem: data + privacy stand; public URL redirects to desk — all assertions passed");
