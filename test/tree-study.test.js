const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Ink = require("../creek/tree-study/ink.js");

assert.strictEqual(Ink.NAVY, 0x1a2744, "outline is the drawing’s navy");
assert.strictEqual(Ink.RED, 0xa3262b, "hatch is the drawing’s pen red");
assert.strictEqual(Ink.PAPER, 0xf4efe6, "ground stays paper, not lawn");
assert.ok(!Ink.isLawn(Ink.PAPER_RGB), "paper is not green");
assert.ok(!Ink.isLawn(Ink.RED_RGB), "red ink is not lawn");
assert.ok(!Ink.isLawn(Ink.NAVY_RGB), "navy ink is not lawn");

const spec = Ink.tree();
assert.ok(spec.rBase > spec.rTop, "trunk tapers");
assert.ok(spec.rFlare > spec.rBase, "base flares into roots");
assert.ok(spec.roots.length >= 2, "roots are part of the tree");
const left = spec.roots.find((r) => r.name === "root-left");
const right = spec.roots.find((r) => r.name === "root-right");
assert.ok(left && right, "left and right roots exist");
assert.ok(left.reach < 0, "thick root hooks left");
assert.ok(right.reach > 0, "smaller root points right");
assert.ok(Math.abs(left.reach) > Math.abs(right.reach), "left root is the long talon");
assert.ok(left.r0 > right.r0, "left root is thicker");
assert.ok(spec.branches.length <= 4, "canopy stays sparse");
assert.ok(spec.branches.some((b) => b.name.indexOf("left") !== -1), "spindly left branches");

const px = Ink.hatchPixels(128, 128);
const st = Ink.hatchStats(px, 128, 128);
assert.ok(st.r > st.g + 8, "hatch reads red, not gray bark");
assert.ok(st.r > st.b + 8, "hatch is red, not navy fill");
assert.ok(st.redInk > 0.12, "enough red pen to read as hatching");
assert.ok(st.paperish > 0.08, "paper shows through the strokes");
assert.ok(!Ink.isLawn([st.r, st.g, st.b]), "hatch average is not lawn");

const mid = Ink.sampleHatch(px, 128, 128, 64, 64);
assert.ok(mid[0] > 20 && mid[1] < 250, "a mid-trunk sample is a real ink pixel");

const lookRight = Ink.applyOrbit(0, 0.1, 24, 0);
assert.ok(lookRight.az > 0, "drag right orbits right");
const lookUp = Ink.applyOrbit(0, 0.1, 0, -20);
assert.ok(lookUp.el > 0.1, "drag up raises elevation");
const ceiling = Ink.applyOrbit(0, Ink.EL.max, 0, -400);
assert.ok(ceiling.el <= Ink.EL.max, "elevation clamps");

const front = Ink.cameraPos(0, 0, 8, { x: 0, y: 2, z: 0 });
assert.ok(Math.abs(front.z - 8) < 1e-6, "az 0 sits on +Z looking at the trunk");
assert.ok(Math.abs(front.x) < 1e-6, "level orbit at az 0 has no X");
assert.ok(Ink.dollyDist(8, 80, 0) > 8, "scroll down dollies out");
assert.ok(Ink.dollyDist(8, -80, 0) < 8, "scroll up dollies in");
assert.ok(Ink.pinchDist(8, 1.25) < 8, "pinch in moves closer");

const html = fs.readFileSync(path.join(__dirname, "../creek/tree-study/index.html"), "utf8");
assert.ok(html.indexOf("../vendor/three.min.js") !== -1, "shares creek’s vendored THREE");
assert.ok(html.indexOf("cdnjs") === -1, "no cdnjs stub");
assert.ok(html.indexOf("0.160.1") === -1, "not the r160 path-only file");
assert.ok(html.indexOf("hair-and-river.jpg") !== -1, "source drawing is the same piece");

const study = fs.readFileSync(path.join(__dirname, "../creek/tree-study/study.js"), "utf8");
assert.ok(study.indexOf("ShaderMaterial") !== -1, "ink is a hatch shader, not a marble material");
assert.ok(study.indexOf("function horn") !== -1, "roots are lathe horns like the trunk, not crushed tubes");
assert.ok(!/MeshStandardMaterial|MeshPhongMaterial|MeshPhysicalMaterial|MeshNormalMaterial/.test(study), "no lit-marble materials");
assert.ok(study.indexOf("BoxGeometry") === -1, "no box people as the tree");
assert.ok(study.indexOf("cdnjs") === -1, "study does not load cdnjs");
assert.ok(study.indexOf("0.159.0") !== -1, "CDN fallback is three@0.159.0");
assert.ok(study.indexOf("new THREE.PointLight") === -1, "no point lights");

const vendor = fs.readFileSync(path.join(__dirname, "../creek/vendor/three.min.js"), "utf8");
assert.ok(vendor.length > 100000, "vendored THREE is not a stub");
assert.ok(/REVISION["']?\s*[:=]\s*["']?159/.test(vendor) || vendor.indexOf('const e="159"') !== -1, "vendor is three r159");

console.log("tree study ink ok");
