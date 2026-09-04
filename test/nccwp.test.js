const assert = require("assert");
const fs = require("fs");
const path = require("path");

const desk = fs.readFileSync(path.join(__dirname, "..", "nccwp", "index.html"), "utf8");
const countsMd = fs.readFileSync(path.join(__dirname, "..", "nccwp", "COUNTS.md"), "utf8");
const geo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "nccwp", "data", "creek_size.geojson"), "utf8"));
const summary = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "nccwp", "data", "summary.json"), "utf8"));
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "nccwp", "wbd_inventory_tillamook_clatsop.json"), "utf8"));

assert.ok(desk.includes("leaflet@1.9.4"), "Leaflet 1.9.4");
assert.ok(desk.includes("tile.openstreetmap.org"), "OSM tiles only");
assert.ok(!/arcgisonline|basemaps\.arcgis|mapbox\.com/i.test(desk), "no ArcGIS or Mapbox tiles");
assert.ok(
  /how many people per creek-size watershed have drinking water that might be impacted by forestry pesticides and forestry practices/.test(desk),
  "lead with why"
);
assert.ok(/On the map/.test(desk), "say what is on the map");
assert.ok(/Foley-size|creek-size/.test(desk), "Foley / creek-size copy");
assert.ok(!/HUC-8|HUC-10|HUC-12|HUC8|HUC10|HUC12/i.test(desk), "no HUC jargon in the public UI");
assert.ok(desk.includes("data/creek_size.geojson"), "loads creek-size polygons");
assert.ok(desk.includes("data/summary.json"), "loads queried totals");
assert.ok(desk.includes("heatStyle") && desk.includes("wells"), "choropleth by wells");
assert.ok(desk.includes("wells") && desk.includes("surface PODs"), "popup is well vs surface");
assert.ok(desk.includes("bindPopup"), "click pop-ups on polygons");
assert.ok(!/href=["']\.\.\/nccwp-nehalem\/["']/.test(desk), "desk is the product map, not a Nehalem page");
assert.ok(!/href=["']\.\.\/nccwp-necanicum\/["']/.test(desk), "desk is the product map, not a Necanicum page");

const nehalemHtml = fs.readFileSync(path.join(__dirname, "..", "nccwp-nehalem", "index.html"), "utf8");
const necanicumHtml = fs.readFileSync(path.join(__dirname, "..", "nccwp-necanicum", "index.html"), "utf8");
assert.ok(nehalemHtml.includes("../nccwp/") && necanicumHtml.includes("../nccwp/"), "old single-basin URLs redirect here");
assert.ok(/creek-size/.test(nehalemHtml) && /creek-size/.test(necanicumHtml), "redirects use creek-size copy");

assert.ok(!desk.includes("data/homes.geojson"), "no public home points");
assert.ok(!desk.includes("data/wells.geojson"), "no public well points");
assert.ok(!desk.includes("data/pods.geojson"), "no public POD points");
assert.ok(!/circleMarker|pointToLayer/.test(desk), "no point markers");
assert.ok(!/situs|site_address|owner_name|OWNER_LINE|owner_address/i.test(desk), "no owner or address");

const banned = /numbers will not be invented|do not invent|hallucinat|pending Identity|taxlot Identity|will not be invented|no home counts until/i;
assert.ok(!banned.test(desk), "strip invent-disclaimer speak");
assert.ok(!/OWRD\/OWRIS/.test(desk), "method essay stays out of the public panel");
assert.ok(!/\$\d/.test(desk), "do not invent dollars on the public page");
assert.ok(!/8-HUC KEEP|claim KEEP/i.test(desk + countsMd), "do not claim KEEP");

assert.strictEqual(geo.type, "FeatureCollection");
assert.ok(geo.features.length >= 55 && geo.features.length <= 120, "Foley-size count in the verified range, got " + geo.features.length);
assert.strictEqual(geo.features.length, 96);
assert.strictEqual(summary.counts.creek_size, 96);
assert.strictEqual(summary.counts.wells, 5373);
assert.strictEqual(summary.counts.surface_pods, 4081);
assert.strictEqual(inventory.counts.creek_size, 96);
assert.strictEqual(inventory.reference.code, "171002020603");
assert.strictEqual(inventory.reference.areasqkm, 43.83);

const foley = geo.features.find((f) => (f.properties || {}).code === "171002020603");
assert.ok(foley, "Foley Creek is on the map");
assert.strictEqual(foley.properties.name, "Foley Creek");
assert.ok(Math.abs(foley.properties.areasqkm - 43.83) < 0.05, "Foley area ~44 km², got " + foley.properties.areasqkm);
assert.strictEqual(foley.properties.wells, 121);
assert.strictEqual(foley.properties.surface_pods, 34);

function assertPublicProps(collection, label) {
  const privateKey = /^(owner|owner_name|owner_address|owner_line|situs|situs_addr|site_address|address)$/i;
  for (const f of collection.features || []) {
    for (const key of Object.keys(f.properties || {})) {
      assert.ok(!privateKey.test(key), label + " must not ship " + key);
      assert.ok(!/owner|situs|addr/i.test(key), label + " must not ship " + key);
    }
  }
}
assertPublicProps(geo, "creek_size");

["homes.geojson", "wells.geojson", "pods.geojson"].forEach((name) => {
  assert.ok(!fs.existsSync(path.join(__dirname, "..", "nccwp", "data", name)), name + " must not be on the public path");
});

assert.ok(countsMd.includes("43.83") && countsMd.includes("171002020603"), "COUNTS names Foley");
assert.ok(countsMd.includes("5,373") || countsMd.includes("5373"), "COUNTS has queried wells");
assert.ok(countsMd.includes("4,081") || countsMd.includes("4081"), "COUNTS has queried PODs");

console.log("nccwp: Foley-size creek heat, 96 units, well vs surface — all assertions passed");
