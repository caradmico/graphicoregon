const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Ink = require("../creek/water-study/ink.js");

assert.strictEqual(Ink.NAVY, 0x1a2744, "outline is the drawing’s navy");
assert.strictEqual(Ink.RED, 0xa3262b, "strand ink is the drawing’s pen red");
assert.strictEqual(Ink.PAPER, 0xf4efe6, "ground stays paper, not lawn");
assert.ok(!Ink.isLawn(Ink.PAPER_RGB), "paper is not green");
assert.ok(!Ink.isLawn(Ink.RED_RGB), "red ink is not lawn");
assert.ok(!Ink.isLawn(Ink.NAVY_RGB), "navy ink is not lawn");

const b = Ink.boulder();
assert.ok(b.rx > b.ry, "boulder is wider than it is tall");
assert.ok(b.rz > 0.8, "boulder has depth");
assert.ok(b.y > 0.4 && b.y < 1.4, "boulder sits on the paper, not as a marble orb in air");

const mid = Ink.hairStrand(Math.floor(Ink.FALL_N / 2), Ink.FALL_N);
const travel = Ink.strandTravel(mid);
assert.ok(travel.falls, "hair falls over the stone");
assert.ok(travel.flattens, "hair becomes the creek");
assert.ok(travel.towardViewer, "creek comes toward the looker");
assert.ok(travel.drop > 1.5, "cascade has real vertical drop");
assert.strictEqual(Ink.waterStrand(4, 12).length, Ink.hairStrand(4, 12).length, "old waterStrand name still maps to hair");

const strands = Ink.allStrands();
assert.strictEqual(strands.length, Ink.FALL_N, "curtain has enough strands");
const wrap = Ink.wrapStats(strands);
assert.ok(wrap.left >= 3, "some strands peel left around the boulder");
assert.ok(wrap.right >= 3, "some strands peel right around the boulder");
assert.ok(wrap.over >= 2, "some strands drape the front face");
assert.ok(wrap.splits, "creek splits around the stone");
assert.strictEqual(wrap.coreHits, 0, "strands do not punch through the boulder core");

const reds = strands.filter((_, i) => Ink.strandColor(i) === "red").length;
const navies = strands.length - reds;
assert.ok(reds > navies, "fall is mostly red, as in the drawing");
assert.ok(navies >= 4, "navy strands sit in the curtain");

const rip = Ink.allRipples();
assert.ok(rip.length >= 8, "hair tails still ride the creek");
const ripNavy = rip.filter((_, i) => Ink.rippleColor(i) === "navy").length;
assert.ok(ripNavy > rip.length / 2, "tails stay mostly navy");

assert.ok(Ink.waterY() > 0.03 && Ink.waterY() < 0.12, "water is a thin film on the bed");
assert.ok(Ink.creekPatch().w > 6 && Ink.creekPatch().d > 5, "creek patch covers the boulder and bed");
assert.ok(Ink.fresnelWeight(1) < 0.02, "looking down is see-through");
assert.ok(Ink.fresnelWeight(0.12) > 0.55, "grazing is reflective");
assert.ok(Ink.waterAlpha(1) < Ink.waterAlpha(0.2), "water alpha rises at grazing");
assert.ok(Ink.bedStones().length >= 5, "creek bed has submerged stones");
Ink.bedStones().forEach((s) => {
  assert.ok(!Ink.insideBoulder({ x: s.x, y: s.y, z: s.z }, 0.88), "bed stones sit outside the boulder");
  assert.ok(s.y < Ink.waterY(), "bed stones sit under the water");
});

const px = Ink.strokePixels(128, 64, Ink.RED_RGB);
const st = Ink.strokeStats(px, 128, 64, Ink.RED_RGB);
assert.ok(st.ink > 0.12, "stroke texture holds enough red pen");
assert.ok(st.paperish > 0.05, "paper shows through the strokes");

const lookRight = Ink.applyOrbit(0, 0.1, 24, 0);
assert.ok(lookRight.az > 0, "drag right orbits right");
const lookUp = Ink.applyOrbit(0, 0.1, 0, -20);
assert.ok(lookUp.el > 0.1, "drag up raises elevation");
const ceiling = Ink.applyOrbit(0, Ink.EL.max, 0, -400);
assert.ok(ceiling.el <= Ink.EL.max, "elevation clamps");

const front = Ink.cameraPos(0, 0, 8, { x: 0, y: 0.5, z: 0.8 });
assert.ok(Math.abs(front.z - 8.8) < 1e-6, "az 0 sits on +Z looking at the creek");
assert.ok(Ink.dollyDist(8, 80, 0) > 8, "scroll down dollies out");
assert.ok(Ink.dollyDist(8, -80, 0) < 8, "scroll up dollies in");
assert.ok(Ink.pinchDist(8, 1.25) < 8, "pinch in moves closer");

const spawn = Ink.cameraPos(Ink.SPAWN.az, Ink.SPAWN.el, Ink.SPAWN.dist);
assert.ok(spawn.y > 0.8 && spawn.y < 4.2, "spawn is low enough to read the split");
assert.ok(spawn.z > 2, "spawn sits downstream of the boulder");

assert.ok(Ink.reeds().length >= 3, "bank reeds exist");
assert.ok(Ink.hills().length >= 2, "distant hills stay as ink ridges");

const html = fs.readFileSync(path.join(__dirname, "../creek/water-study/index.html"), "utf8");
assert.ok(html.indexOf("../vendor/three.min.js") !== -1, "shares creek’s vendored THREE");
assert.ok(html.indexOf("cdnjs") === -1, "no cdnjs stub");
assert.ok(html.indexOf("0.160.1") === -1, "not the r160 path-only file");
assert.ok(html.indexOf("hair-and-river.jpg") !== -1, "source drawing is the same piece");

const study = fs.readFileSync(path.join(__dirname, "../creek/water-study/study.js"), "utf8");
assert.ok(study.indexOf("ShaderMaterial") !== -1, "ink is a stroke shader, not a glass material");
assert.ok(study.indexOf("uTime") !== -1, "strands travel — hair is not a still blob");
assert.ok(study.indexOf("buildHair") !== -1, "previous flowing tubes are built as hair");
assert.ok(study.indexOf('"hair"') !== -1, "hair is a named scene object");
assert.ok(study.indexOf("fresnel") !== -1, "clear water uses angle-dependent fresnel");
assert.ok(study.indexOf("cameraPosition") !== -1, "water shader reads the view angle");
assert.ok(/transparent:\s*true/.test(study), "water surface is transparent");
assert.ok(study.indexOf("depthWrite: false") !== -1, "water does not hide the bed");
assert.ok(study.indexOf("buildCreekBed") !== -1, "creek bed sits under the water");
assert.ok(study.indexOf("PIXEL_RATIO = 1.25") !== -1, "pixel ratio stays capped");
assert.ok(!Ink.isGlassWord(study), "no glass / PBR words");
assert.ok(!/MeshStandardMaterial|MeshPhongMaterial|MeshPhysicalMaterial|MeshNormalMaterial/.test(study), "no lit-marble materials");
assert.ok(study.indexOf("cdnjs") === -1, "study does not load cdnjs");
assert.ok(study.indexOf("0.159.0") !== -1, "CDN fallback is three@0.159.0");
assert.ok(study.indexOf("new THREE.PointLight") === -1, "no point lights");
assert.ok(study.indexOf("IcosahedronGeometry") !== -1, "boulder is a rumpled volume");
assert.ok(study.indexOf("Ink.PAPER") !== -1, "boulder fill is paper");

const treeStudy = fs.readFileSync(path.join(__dirname, "../creek/tree-study/study.js"), "utf8");
assert.ok(treeStudy.indexOf("function horn") !== -1, "tree-study bark KEEP — this file was not rewritten");

const vendor = fs.readFileSync(path.join(__dirname, "../creek/vendor/three.min.js"), "utf8");
assert.ok(vendor.length > 100000, "vendored THREE is not a stub");
assert.ok(/REVISION["']?\s*[:=]\s*["']?159/.test(vendor) || vendor.indexOf('const e="159"') !== -1, "vendor is three r159");

console.log("water study ink ok");
