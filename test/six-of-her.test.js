const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "field.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "chrome.css"), "utf8");
const nav = fs.readFileSync(path.join(root, "field-nav.js"), "utf8");

const her = app.slice(app.indexOf("const HER"), app.indexOf("const WALKS"));
assert.ok(app.includes("const HER"), "six of her are planted as the look");
assert.ok(app.includes("function plantSixOfHer"), "the lineup is six of her");
assert.ok(app.includes("function buildLineupHook"), "look dresses Orbit's dusk hook");
assert.ok(app.includes("plantSixOfHer()"), "the six stand on Orbit's lineup");
assert.ok(app.includes("assets/art/ocean.jpg"), "dusk is her ocean painting, not a new plate");
assert.ok(app.includes("function streamHerFaces"), "faces stream after first frame");
assert.ok(/afterFirstPaint\([\s\S]*streamHerFaces/.test(app), "portraits wait for first paint");

Roster.IDS.forEach((id) => {
  assert.ok(new RegExp('id: "' + id + '"').test(her), "look plants " + id);
});

const faces = {
  journalist: "self-portrait-charcoal.jpg",
  scientist: "self-portrait-graphite.jpg",
  radio: "monochromatic-self-portrait.jpg",
  artist: "self-portrait-acrylic.jpg",
  teacher: "female-portrait-oil.jpg",
  musician: "female-portrait-oil-3.jpg"
};
Object.keys(faces).forEach((id) => {
  const file = faces[id];
  assert.ok(her.includes(file), id + " uses " + file);
  assert.ok(fs.existsSync(path.join(root, "assets/art", file)), file + " is already on disk");
});

assert.ok(her.includes("self-portrait-charcoal.jpg"), "charcoal side part and brow stay the face");
assert.ok(app.includes("function faceFill"), "the portrait fills the card");
assert.ok(app.includes("function artCard"), "faces read as unlit portrait cards, not a PointLight");
assert.ok(!/new THREE\.PointLight/.test(app), "no PointLights");
assert.ok(!/function buildBoxSelf|boxPart\(/.test(app), "no box-dummy skeleton");
assert.ok(!app.includes("standLineup"), "do not copy the closed lawn row");

const plant = app.slice(app.indexOf("function plantOneOfHer"), app.indexOf("function plantSixOfHer"));
assert.ok(plant.includes("paintOfferedSheet"), "Journalist holds the printed paper");
assert.ok(plant.includes("empty stage"), "Musician keeps an empty stage");
assert.ok(!/spotify|track 1|album|soundcloud/i.test(plant), "no fake tracks");
assert.ok(plant.includes("lineupRoot"), "cards parent to Orbit's lineup, not the leftover field");
assert.ok(/addClick\(face/.test(plant), "each face card is a tap target");

assert.ok(nav.includes("function lerpPose"), "field-nav.js stays Orbit's");
assert.ok(!/const HER/.test(nav), "look did not rewrite the hand");
assert.ok(!/identity-canvas/i.test(app + html), "identity-canvas stays private");
assert.ok(!/health bar|Street Fighter|\bVS\b|HP bar|Diablo/i.test(app + html + css), "no fighting-game chrome");
assert.ok(!/jarvis|commander|experiment|v0/i.test(html), "canvas copy stays quiet");
["field.js", "index.html", "chrome.css"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});
assert.ok(!/Museum|Jarvis|Commander/.test(her), "the six are not labeled as a hall");
assert.ok(html.includes('id="roster"') && html.includes('id="back"'), "Orbit's taps stay");
assert.ok(/if \(roster\) roster\.hidden = true/.test(app), "the HTML name list stays off first paint");
assert.ok(/setRosterChrome\(true\)/.test(app), "boot hides the name-stack chrome");
assert.ok(/PIXEL_RATIO = 1\.25/.test(app), "pixel ratio stays at or under 1.25");

console.log("six-of-her: portraits on Orbit's dusk hook — all assertions passed");
