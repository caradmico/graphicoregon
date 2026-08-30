const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Roster = require("../roster.js");
const Figure = require("../figure.js");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const figSrc = fs.readFileSync(path.join(root, "figure.js"), "utf8");

assert.ok(/id="roster"[^>]*hidden/.test(html), "roster is hidden in markup");
assert.ok(/#roster,\s*#roster\[hidden\]/.test(css) || /#roster[\s\S]*display:\s*none\s*!important/.test(css), "roster never paints as a sidebar");
assert.ok(!/roster\.hidden\s*=\s*false/.test(app), "app never unhides the roster");
assert.ok(/roster\.hidden\s*=\s*true/.test(app), "first paint keeps #roster hidden");
assert.ok(!/Tap a name/.test(html), "help is not an HTML name list");

assert.ok(app.includes("pickClass"), "tap still dollies through pickClass");
assert.ok(/userData\.id[\s\S]*pickClass|pickClass\(classId\)/.test(app), "a figure tap maps to pickClass");
assert.ok(app.includes("addClickTree"), "standing figures register as picks");
Figure.HER.forEach((spec) => {
  assert.ok(Roster.isId(spec.id), spec.id + " is a class pick");
  assert.ok(html.includes("assets/art/" + spec.file), spec.file + " is preloaded as a face");
});
assert.deepStrictEqual(
  Figure.HER.map((h) => h.id),
  Roster.IDS,
  "six standing figures are the six classes"
);

assert.ok(Roster.LINEUP_POSE, "lineup has its own pose");
assert.ok(
  Roster.LINEUP_POSE.y !== Roster.ROSTER_POSE.y || Roster.LINEUP_POSE.z !== Roster.ROSTER_POSE.z,
  "lineup pose is not leftover field spawn"
);
assert.ok(Roster.LINEUP_POSE.y < Roster.ROSTER_POSE.y, "camera is chest-height, not leftover eye-height");
assert.ok(app.includes("LINEUP_POSE"), "boot uses the lineup pose");
assert.ok(!/applyPose\(Roster\.ROSTER_POSE\)/.test(app), "first pose is not leftover field spawn");
const home = Roster.createHand().goHome();
assert.strictEqual(home.pose.y, Roster.LINEUP_POSE.y, "Esc returns to the 3D lineup");
assert.strictEqual(home.pose.z, Roster.LINEUP_POSE.z, "Esc pose is the lineup, not the lawn");

assert.ok(app.includes("hideLeftoverField") || app.includes("leftover-field"), "leftover field is hidden on first paint");
assert.ok(app.includes("dressLineup") && app.includes("decode"), "portraits decode before the canvas shows");
assert.ok(/visibility:\s*hidden/.test(css), "canvas stays dark until faces are on");
assert.ok(!/\?v=/.test(html), "no cache-bust query on scripts");
assert.ok(!/new THREE\.PointLight/.test(app), "no PointLights");
assert.ok(!/unity|Unity|githack/i.test(app + html + figSrc), "not Unity, not githack as the product");

const body = figSrc.slice(figSrc.indexOf("function buildFigure"), figSrc.indexOf("function duskGround"));
assert.ok(!/BoxGeometry|CylinderGeometry|SphereGeometry|CapsuleGeometry/.test(body), "figures are not box/cylinder/sphere/capsule people");
assert.ok(body.includes("headGeo") && body.includes("torsoGeo"), "a standing body, not a card");
assert.ok(figSrc.includes("faceTexture") && figSrc.includes("mapHeadUVs"), "portraits fill the head");
assert.ok(figSrc.includes("self-portrait-charcoal.jpg"), "journalist face is the charcoal");
assert.ok(body.includes("facePlate"), "her portrait fills the face, not a wall card");
assert.ok(body.includes("newsieCap") && figSrc.includes("paperProp"), "Journalist uses the newsie and paper look");
assert.ok(figSrc.includes("empty stage") && body.includes("emptyStage"), "Musician keeps an empty stage");
assert.ok(!/spotify|track 1|album|soundcloud/i.test(figSrc), "no fake tracks");
assert.ok(!/identity-canvas/i.test(figSrc + app + html), "identity-canvas stays private");
assert.ok(!/Lego|lego/.test(figSrc), "not Lego");

console.log("lineup: no roster, tap→pickClass, pose is not leftover field — all assertions passed");
