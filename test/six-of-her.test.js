const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "figures.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "chrome.css"), "utf8");
const nav = fs.readFileSync(path.join(root, "field-nav.js"), "utf8");

const her = app.slice(app.indexOf("const HER"), app.indexOf("const WALKS"));
assert.ok(app.includes("const HER"), "six of her are planted as the look");
assert.ok(app.includes("function plantSixOfHer"), "the lineup is six of her");
assert.ok(app.includes("function buildLineupHook"), "look dresses Orbit's dusk hook");
assert.ok(app.includes("plantSixOfHer()"), "the six stand on Orbit's lineup");
assert.ok(app.includes("assets/art/ocean.jpg"), "dusk is her ocean painting, not a new plate");
assert.ok(!app.includes("function paintHerPlaceholder"), "tan placeholders are gone");
assert.ok(app.includes("function latheProfile"), "the six are sculpted people, not hung cards");
assert.ok(app.includes("function dressLineup"), "self-portraits dress the cards");
const dress = app.slice(app.indexOf("function dressLineup"), app.indexOf("function hideLoader"));
assert.ok(/Promise\.all\(imgs\.map/.test(dress), "wait on every preload img");
assert.ok(/img\.decode\(\)/.test(dress), "decode the hidden lineup images before maps");
assert.ok(/crossOrigin = "anonymous"/.test(app), "decoded faces stay CORS-clean for WebGL");
assert.ok(/CanvasTexture/.test(dress) || /function textureFromDecoded/.test(app), "maps come from already-decoded images");
assert.ok(!/loadTexture/.test(dress), "do not TextureLoader the lineup");
assert.ok(!/dressLineup/.test(app.slice(app.lastIndexOf("afterFirstPaint"))), "do not dress after a live first paint");
assert.ok(/await dressLineup\(\)/.test(app), "maps apply before the first visible frame");
assert.ok(!/streamHerFaces/.test(app), "no sequential face stream");

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
assert.ok(html.includes('rel="preload"') && html.includes("assets/art/ocean.jpg"), "ocean is preloaded");
Object.keys(faces).forEach((id) => {
  const file = faces[id];
  assert.ok(her.includes(file), id + " uses " + file);
  assert.ok(fs.existsSync(path.join(root, "assets/art", file)), file + " is already on disk");
  assert.ok(html.includes("assets/art/" + file), "preload " + file);
});

assert.ok(her.includes("self-portrait-charcoal.jpg"), "charcoal side part and brow stay the face");
assert.ok(app.includes("function faceFill"), "the portrait fills the face");
assert.ok(app.includes("function artCard"), "faces read unlit, not a PointLight");
assert.ok(!/new THREE\.PointLight/.test(app), "no PointLights");
assert.ok(!/function buildBoxSelf|boxPart\(/.test(app), "no box-dummy skeleton");
assert.ok(!app.includes("standLineup"), "do not copy the closed lawn row");

const plant = app.slice(app.indexOf("function plantOneOfHer"), app.indexOf("function plantSixOfHer"));
assert.ok(plant.includes("LatheGeometry") || app.includes("function latheProfile"), "avatars are sculpted, not a box stack");
assert.ok(plant.includes("paintOfferedSheet"), "Journalist holds the printed paper");
assert.ok(plant.includes("newsieCap"), "Journalist uses the newsie look");
assert.ok(plant.includes("empty stage"), "Musician keeps an empty stage");
assert.ok(!/spotify|track 1|album|soundcloud/i.test(plant), "no fake tracks");
assert.ok(plant.includes("lineupRoot"), "figures parent to Orbit's lineup, not the leftover field");
assert.ok(/addClick\(face/.test(plant), "each face is a tap target");
assert.ok(!plant.includes("paintHerPlaceholder"), "no tan stand-in on the face");

assert.ok(nav.includes("function lerpPose"), "field-nav.js stays Orbit's");
assert.ok(!/const HER/.test(nav), "look did not rewrite the hand");
assert.ok(!/identity-canvas/i.test(app + html), "identity-canvas stays private");
assert.ok(!/health bar|Street Fighter|\bVS\b|HP bar|Diablo/i.test(app + html + css), "no fighting-game chrome");
assert.ok(!/jarvis|commander|experiment|v0/i.test(html), "canvas copy stays quiet");
["figures.js", "index.html", "chrome.css"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});
assert.ok(!/Museum|Jarvis|Commander/.test(her), "the six are not labeled as a hall");
assert.ok(html.includes('id="roster"') && html.includes('id="back"'), "Orbit's taps stay");
assert.ok(/if \(roster\) roster\.hidden = true/.test(app), "the HTML name list stays off first paint");
assert.ok(/setRosterChrome\(true\)/.test(app), "boot hides the name-stack chrome");
assert.ok(/PIXEL_RATIO = 1\.25/.test(app), "pixel ratio stays at or under 1.25");
const hook = app.slice(app.indexOf("function buildLineupHook"), app.indexOf("function framedPiece"));
assert.ok(/depthWrite:\s*true/.test(hook), "dusk writes depth so the six stay in front");
assert.ok(!/depthWrite:\s*false/.test(hook), "dusk is not a late overlay");
assert.ok(/hideLoader\(\)/.test(app) && /display = "none"/.test(app), "JS keeps the loader off first paint");
assert.ok(/id="loader"[^>]*\bhidden\b/.test(html), "markup hides the loader before JS");
assert.ok(/#loader[\s\S]*#loader\[hidden\][\s\S]*display:\s*none\s*!important/.test(css), "loader is not first paint");
assert.ok(/id="lineup-preload"/.test(html), "hidden preload images sit in markup");
assert.ok(/id="lineup-preload"[\s\S]*crossorigin="anonymous"/.test(html), "preload faces load CORS-clean for WebGL");
assert.ok(/src="figures\.js"/.test(html), "index loads the renamed figures script");
assert.ok(!/src="faces\.js"/.test(html), "do not keep the cached faces.js src");
assert.ok(!/src="look\.js"/.test(html), "do not keep the cached look.js src");
assert.ok(!/src="field\.js"/.test(html), "do not keep the cached field.js src");
assert.ok(!/\?v=/.test(html), "no cache-buster query on assets");
assert.ok(/visibility:\s*hidden/.test(css) && /canvas#stage\.ready/.test(css), "canvas stays hidden until maps");
assert.ok(/function hideStage/.test(app) && /function showStage/.test(app), "JS holds the canvas until the six are dressed");
assert.ok(/await dressLineup\(\)[\s\S]*renderer\.render[\s\S]*showStage/.test(app), "first visible WebGL frame is after all maps");

console.log("six-of-her: portraits on Orbit's dusk hook — all assertions passed");
