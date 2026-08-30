const assert = require("assert");
const fs = require("fs");
const path = require("path");
const inv = require("../art-inventory.js");

const onDisk = fs.readdirSync(path.join(__dirname, "../assets/art")).filter((f) => /\.jpe?g$/i.test(f));

assert.strictEqual(new Set(inv.HANG).size, inv.HANG.length, "hang each work once");
assert.ok(inv.HANG.includes("mixed-media-gouache.jpg"), "prefer the file already in assets/art");
assert.ok(inv.HANG.includes("mixed-media-gouache-on-canson.jpg"), "hang the Canson work once");
assert.strictEqual(inv.HANG.filter((f) => f === "mixed-media-gouache.jpg").length, 1);
assert.strictEqual(inv.HANG.filter((f) => f === "mixed-media-gouache-on-canson.jpg").length, 1);
assert.ok(!(inv.ALIAS && inv.ALIAS["mixed-media-gouache-on-canson.jpg"]), "Canson is not an alias");
assert.ok(inv.shouldHang("mixed-media-gouache.jpg"));
assert.ok(inv.shouldHang("mixed-media-gouache-on-canson.jpg"));
assert.ok(!inv.shouldHang("identity-canvas.jpg"), "identity-canvas stays private");
assert.ok(!inv.HANG.some((f) => /identity-canvas/i.test(f)));

["20201025_145254.jpg", "20201025_145149.jpg", "0321232309_HDR.jpg", "20201206_134759.jpg"].forEach((f) => {
  assert.ok(inv.HANG.includes(f), "hang missing studio file " + f);
  assert.ok(onDisk.includes(f), f + " is on disk");
});

inv.HANG.forEach((f) => {
  assert.ok(onDisk.includes(f), "hung file exists: " + f);
});

assert.strictEqual(inv.titleFromFile("still-life-charcoal-3.jpg"), "still life charcoal 3");
assert.strictEqual(inv.titleFromFile("neahkahnie.jpg"), "neahkahnie");
assert.ok(!inv.HANG.includes("Still life") && !inv.HANG.includes("Portraits") && !inv.HANG.includes("Coast"));

["look.js", "index.html", "chrome.css", "art-inventory.js"].forEach((file) => {
  const src = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});

console.log("art-inventory: " + inv.HANG.length + " unique works, all assertions passed");
