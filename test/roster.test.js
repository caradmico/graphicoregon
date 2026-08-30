const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "faces.js"), "utf8");
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
assert.deepStrictEqual(home.pose, Roster.LINEUP_POSE, "Esc returns to the lineup pose");
assert.notDeepStrictEqual(Roster.LINEUP_POSE, Roster.ROSTER_POSE, "lineup is not leftover field pose");
assert.ok(Roster.LINEUP_POSE.y >= 1.4 && Roster.LINEUP_POSE.y <= 1.7, "lineup camera is chest height");
assert.ok(Math.abs(Roster.LINEUP_POSE.yaw - Math.PI) < 1e-9, "lineup faces the dusk plane, not the field ring");

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
assert.ok(/id="roster"[^>]*\bhidden\b/.test(html), "markup hides the name list before JS");
assert.ok(html.includes('src="faces.js"'), "index loads the renamed faces script");
assert.ok(!/src="look\.js"/.test(html), "do not keep the cached look.js src");
assert.ok(!/src="field\.js"/.test(html), "do not keep the cached field.js src");
assert.ok(!/src="app\.js"/.test(html), "do not keep the cached app.js src");
assert.ok(html.includes('href="chrome.css"'), "index loads the renamed chrome sheet");
assert.ok(html.includes('id="back"'), "visible Back control exists");
assert.ok(/tap a face/i.test(help), "help says tap a face");
assert.ok(!/WASD/i.test(help), "help does not advertise WASD as the way in");
assert.ok(!/WASD/i.test(html.match(/id="help"[\s\S]*?<\/div>/)[0]), "help copy has no WASD");

const css = fs.readFileSync(path.join(root, "chrome.css"), "utf8");
assert.ok(/#roster,\s*#roster\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important/.test(css), "CSS kills the name list even if hidden is fought");
const mobile = css.slice(css.indexOf("@media (max-width: 760px)"));
assert.ok(/#roster,\s*#roster\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important/.test(mobile), "the 760px query repeats the hide");
assert.ok(!/left:\s*12px/.test(mobile) && !/flex-direction:\s*row/.test(mobile), "mobile query does not restore a name column");

assert.ok(app.includes("returnToRoster"), "Esc/Back can restore the roster");
assert.ok(/flags\.escape[\s\S]*hand\.selected\(\)[\s\S]*returnToRoster/.test(app), "Esc returns when a class is picked");
assert.ok(app.includes("pickClass"), "a name tap dollies without a walk");
assert.ok(app.includes("openMuseumVolume") || app.includes("enterMuseum"), "artist reuses the hall path");
assert.ok(!/new THREE\.PointLight/.test(app), "no extra PointLights");
assert.ok(!/identity-canvas/.test(app), "identity-canvas stays private");

assert.ok(/applyPose\(Roster\.LINEUP_POSE\)/.test(app), "boot pose is lineup, not leftover field");
assert.ok(!/applyPose\(Roster\.ROSTER_POSE\)/.test(app), "boot does not apply leftover field pose");
assert.ok(app.includes("fieldRoot"), "leftover lawn is a hideable group");
assert.ok(/fieldRoot\.visible = false/.test(app), "field starts hidden");
assert.ok(/function returnToRoster[\s\S]*showField\(false\)/.test(app), "Esc hides leftover lawn");
assert.ok(/function returnToRoster[\s\S]*showLineup\(true\)/.test(app), "Esc restores the lineup hook");
assert.ok(/function returnToRoster[\s\S]*applyPose\(home\.pose\)/.test(app), "Esc applies the lineup pose");
assert.ok(/function pickClass[\s\S]*showField\(true\)/.test(app), "a land pick may show the field");
assert.ok(app.includes("buildLineupHook"), "one dusk plane is the first-paint hook");
assert.ok(!app.includes("function buildBoxSelf"), "do not dress six dummy bodies");
assert.ok(!app.includes("standLineup"), "do not copy the closed lawn row");
assert.ok(/if \(onRosterHome\(\)\) return/.test(app), "WASD is not first-paint travel");

const plant = app.slice(app.indexOf("function plantOneOfHer"), app.indexOf("function plantSixOfHer"));
assert.ok(/addClick\(face/.test(plant), "a face card is a clickable pick");
assert.ok(/PlaneGeometry\(FACE_W \* 1\.55/.test(plant), "an invisible larger hit mesh covers the card");
assert.ok(/userData\.id[\s\S]*Roster\.isId[\s\S]*pickClass/.test(app), "tapping a face dollies that class");
assert.ok(/setRosterChrome\(true\)/.test(app), "boot keeps the name list off");
assert.ok(html.includes('rel="preload"'), "lineup images preload");
assert.ok(!/\?v=/.test(html), "boot still strips query; no cache-buster on assets");
assert.ok(/onRosterHome\(\)\) el\.requestPointerLock|!onRosterHome\(\)\) el\.requestPointerLock/.test(app), "roster home does not lock the pointer");

["faces.js", "index.html", "chrome.css", "roster.js"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
  assert.ok(!/health.?bar|street fighter|vs\./i.test(src), file + " has no fighter chrome");
});

console.log("roster: ids, Esc home, no WASD door — all assertions passed");
