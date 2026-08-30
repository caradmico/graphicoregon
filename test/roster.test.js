const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const help = (html.match(/id="help"[^>]*>([^<]+)/) || [])[1] || "";

assert.deepStrictEqual(
  Roster.IDS,
  ["journalist", "scientist", "radio", "artist", "teacher", "musician"],
  "roster ids stay exact"
);

assert.ok(Roster.FLY_SEC > 0 && Roster.FLY_SEC <= 3, "dolly finishes in three seconds");
assert.ok(Roster.requiresWasd !== true, "the module does not ask for WASD");

const hand = Roster.createHand();
assert.strictEqual(hand.selected(), null, "spawn is the roster");
assert.strictEqual(hand.requiresWasd, false, "WASD is not required to pick");

const picked = hand.pick("journalist");
assert.ok(picked, "a name pick needs only an id");
assert.strictEqual(picked.requiresWasd, false, "the pick result does not require WASD");
assert.strictEqual(picked.action, "paper", "journalist opens the paper");
assert.strictEqual(hand.selected(), "journalist");

const home = hand.goHome();
assert.strictEqual(hand.selected(), null, "Esc/home returns to the roster");
assert.strictEqual(home.action, "roster");
assert.ok(home.pose && home.pose.z > 0, "roster pose looks at the line-up");
assert.ok(Roster.LINEUP_POSE, "lineup pose exists");
assert.ok(
  Roster.LINEUP_POSE.y !== Roster.ROSTER_POSE.y || Roster.LINEUP_POSE.z !== Roster.ROSTER_POSE.z,
  "lineup pose is not leftover field spawn"
);
assert.strictEqual(home.pose.z, Roster.LINEUP_POSE.z, "Esc home is the 3D lineup");

assert.strictEqual(hand.pick("artist").action, "museum", "artist enters the hall");
hand.goHome();
assert.strictEqual(hand.pick("musician").action, "sheet", "musician is a sheet over an empty stage");
hand.goHome();

const water = Roster.sheet("scientist", "watershed");
const orbit = Roster.sheet("scientist", "orbit");
assert.ok(/Netarts|Nehalem|Nestucca|Siuslaw|Tillamook|Necanicum|Lane/.test(water.body), "watershed names the basins");
assert.ok(!/StarIS/.test(water.body), "do not mash Orbit into Watershed");
assert.ok(/StarIS/.test(orbit.body), "Orbit names StarIS");
assert.ok(!/Netarts/.test(orbit.body), "do not mash Watershed into Orbit");

const fleet = Roster.sheet("radio", "fleet");
assert.ok(/nod/i.test(fleet.body), "Fleet is a nod");
assert.ok(!/COMSEC|schoolhouse|boat/i.test(fleet.body), "no Navy internals");

const music = Roster.sheet("musician");
assert.ok(/empty/i.test(music.body), "musician admits the empty stage");
assert.ok(!/spotify|track 1|album|soundcloud/i.test(music.body), "do not invent a catalog");

const teacher = Roster.sheet("teacher");
assert.ok(/thinner|thin/i.test(teacher.body), "teacher does not pad thin work");
assert.ok(!/classroom/i.test(teacher.body) || /no classroom/i.test(teacher.body), "no invented classroom");

Roster.IDS.forEach((id) => {
  assert.ok(html.includes('data-class="' + id + '"'), "roster button for " + id);
});
assert.ok(html.includes('id="roster"'), "phone-first name list exists");
assert.ok(html.includes('id="back"'), "visible Back control exists");
assert.ok(!/WASD/i.test(help), "help does not advertise WASD as the way in");
assert.ok(!/WASD/i.test(html.match(/id="help"[\s\S]*?<\/div>/)[0]), "help copy has no WASD");

assert.ok(app.includes("returnToRoster"), "Esc/Back can restore the roster");
assert.ok(/flags\.escape[\s\S]*hand\.selected\(\)[\s\S]*returnToRoster/.test(app), "Esc returns when a class is picked");
assert.ok(app.includes("pickClass"), "a name tap dollies without a walk");
assert.ok(app.includes("openMuseumVolume") || app.includes("enterMuseum"), "artist reuses the hall path");
assert.ok(!/new THREE\.PointLight/.test(app), "no extra PointLights");
assert.ok(!/identity-canvas/.test(app), "identity-canvas stays private");

["app.js", "index.html", "styles.css", "roster.js"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
  assert.ok(!/health.?bar|street fighter|vs\./i.test(src), file + " has no fighter chrome");
});

console.log("roster: ids, Esc home, no WASD door — all assertions passed");
