const assert = require("assert");
const fs = require("fs");
const path = require("path");
const data = require("../museum-data.js");

const artDir = path.join(__dirname, "..", "assets", "art");
const disk = fs.readdirSync(artDir).filter((f) => /\.jpe?g$/i.test(f)).sort();
const listed = data.artFiles().slice().sort();

assert.strictEqual(listed.length, disk.length, "catalog count matches assets/art");
assert.deepStrictEqual(listed, disk, "hang list is exactly assets/art/* — no invented files");
assert.strictEqual(data.ART_COUNT, 68, "sample-page portfolio is 68 pieces");
assert.ok(listed.indexOf("neahkahnie.jpg") !== -1, "Neahkahnie hangs with the collection");

const forestDoor = data.forestDoor();
assert.strictEqual(data.portalCross(-10.4, -1.2, -13.1, -1.2, forestDoor), 1, "westbound plaza walk enters the booth");
assert.strictEqual(data.portalCross(-13.1, -1.2, -10.4, -1.2, forestDoor), -1, "eastbound booth walk leaves the booth");
assert.strictEqual(data.portalCross(-10.4, 8, -13.1, 8, forestDoor), 0, "missing the doorway does not teleport");

const museumDoor = data.museumDoor();
assert.strictEqual(data.portalCross(-2.2, 400, 0.8, 400, museumDoor), -1, "walking out the museum door exits");
assert.strictEqual(data.portalCross(0.8, 400, -2.2, 400, museumDoor), 1, "walking into the museum door enters");

const forest = data.clampRoom("forest", { x: 900, y: 4, z: -900 }, { xz: 220, y: 121 });
assert.ok(Math.abs(forest.x) <= 220 && Math.abs(forest.z) <= 220, "forest clamp stays on the field");

const inside = data.clampRoom("museum", { x: -20, y: 1.7, z: 400 }, { xz: 220, y: 121 });
assert.ok(inside.z > 220, "museum is larger than the forest door — past field bounds");
assert.ok(inside.x < data.FOREST_PORTAL.x, "museum hall runs deeper than the booth");

const stray = data.clampRoom("museum", { x: 80, y: 40, z: 0 }, { xz: 220, y: 121 });
assert.ok(stray.z >= data.MUSEUM.minZ && stray.x <= data.MUSEUM.maxX, "museum clamp cannot wander into a third room");

const hrefs = data.paperHrefs();
assert.ok(hrefs.length >= 20, "newspaper carries a coast edition, not one link");
hrefs.forEach((href) => {
  assert.ok(/^https:\/\//.test(href), "paper links are live http(s): " + href);
  assert.ok(!/\.pdf($|\?)/i.test(href), "paper is not a wall of PDFs: " + href);
});
assert.ok(hrefs.indexOf(data.PAPER_LEAD.href) !== -1, "lead story is in the edition");
assert.ok(hrefs.some((h) => /seasidesignal\.com/.test(h)), "Signal bylines are in the edition");
assert.ok(hrefs.some((h) => /tillamookcountypioneer\.net/.test(h)), "Pioneer bylines are in the edition");
assert.ok(hrefs.some((h) => /portlandmercury\.com/.test(h)), "Mercury bylines are in the edition");

const hallDepth = data.MUSEUM.doorX - data.MUSEUM.minX;
const booth = 2.4;
assert.ok(hallDepth > booth * 8, "museum hall is bigger on the inside than the forest booth");

console.log("museum-data: all assertions passed");
