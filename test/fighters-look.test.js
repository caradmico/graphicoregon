const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const nav = fs.readFileSync(path.join(root, "field-nav.js"), "utf8");

assert.ok(app.includes("const LINEUP"), "lineup is the first paint");
const lineup = app.slice(app.indexOf("const LINEUP"), app.indexOf("const WALKS"));
assert.ok(app.includes("function buildLineupBackdrop"), "one shared backdrop");
assert.ok(app.includes("function buildLineup"), "the row is built as a lineup");
const cloth = app.slice(app.indexOf("function buildLineupBackdrop"), app.indexOf("function buildLineup()"));
assert.ok(cloth.includes("BoxGeometry(48, 0.2, 17.2)"), "a stage kills the leftover lawn under spawn");
assert.ok(cloth.includes("left") && cloth.includes("right") && cloth.includes("roof"), "the backdrop fills the first frame");
assert.ok(css.includes("bottom: 16px") && css.includes("#roster button"), "Orbit's name list stays a quiet tap, not the first paint");
assert.ok((app.match(/z: -3\.2/g) || []).length >= 6, "the six share one row z");
Roster.IDS.forEach((id) => {
  assert.ok(new RegExp(id + ": \\{ x:").test(app), "lineup plants " + id);
});
assert.ok((app.match(/function buildNewsie/g) || []).length === 1, "one newsie only");
assert.ok(app.includes("paintOfferedSheet"), "Journalist holds a printed sheet");
assert.ok(app.includes("\"empty stage\""), "Musician stays empty");
assert.ok(!/teacherMap/.test(app), "no far-field lectern");
assert.ok(!/02-geology-streams/.test(app), "no lawn map this PR");
assert.ok(!/new THREE\.PointLight/.test(app), "no PointLights");
assert.ok(!/health bar|Street Fighter|\bVS\b|HP bar|Diablo/i.test(app + html + css), "no fighting-game chrome");
assert.ok(!/identity-canvas/i.test(app + html), "identity-canvas stays private");
assert.ok(html.includes('id="roster"') && html.includes('id="back"'), "Orbit's name list and Back stay");
assert.ok(!/WASD/i.test(html.match(/id="help"[\s\S]*?<\/div>/)[0]), "help does not advertise WASD");
assert.ok(nav.includes("function lerpPose"), "Orbit fly math stays in field-nav.js");
assert.ok(app.includes("Nav.lerpPose") && app.includes("pickClass"), "tap still dives");

["app.js", "index.html", "styles.css"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});

console.log("fighters-look: six in a row on one backdrop — all assertions passed");
