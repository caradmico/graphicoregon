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
assert.ok(!Ink.isLawn(Ink.FIGURE_RGB), "figure fill is paper-warm, not lawn");

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
assert.ok(wrap.over >= 12, "the fall is the hair curtain on the boulder face");
assert.ok(wrap.left >= 2, "a few edge strands peel left");
assert.ok(wrap.right >= 2, "a few edge strands peel right");
assert.ok(wrap.over > wrap.left + wrap.right, "face cascade outweighs the side peel");
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

const w = Ink.woman();
assert.ok(w.head.y > b.y + b.ry * 0.35, "head sits above the boulder mass");
assert.ok(w.head.y < 2.55, "head stays on the rock, not in the sky");
assert.ok(w.hip.y > b.y, "hips perch on the boulder");
assert.ok(w.headR > 0.13 && w.headR < 0.22, "head has oval mass, not a pin or a snowman orb");
assert.ok(w.handDip.y < Ink.waterY(), "dipping hand enters the creek");
assert.ok(!Ink.insideBoulder(w.handDip, 0.88), "hand is in the water, not inside the rock");
assert.ok(w.handDip.z > w.head.z, "the reaching arm goes toward the creek");
assert.ok(w.chest.x > w.hip.x, "torso leans toward the creek");
assert.ok(w.chest.y > w.hip.y, "chest sits above the seated hips");
assert.ok(w.tear && w.tear.y < w.head.y, "a tear sits on the cheek");
assert.ok(Ink.hairAttached(mid, w.head), "hair starts at her head");
strands.forEach((pts) => {
  assert.ok(Ink.hairAttached(pts, w.head, 0.5), "every fall strand is rooted on the scalp");
});
const mass = Ink.womanMass();
assert.ok(mass.torsoMaxR > 0.18, "torso lathe has chest mass");
assert.ok(mass.hipMaxR > 0.20, "hips have seated mass");
assert.ok(mass.headMaxR > 0.11, "head lathe is an oval, not a stick tip");
assert.ok(mass.thighR > 0.08, "thighs have thickness");
assert.ok(mass.upperArmR > 0.06, "arms have thickness");
assert.ok(mass.depth > 0.8 && mass.depth < 0.95, "body is volumetric, not a paper-thin card");
assert.ok(Ink.FIGURE_DEPTH === mass.depth, "study flatten comes from the same mass spec");
assert.ok(Ink.capsuleProfile(0.03, 0.2)[2][0] <= 0.03, "capsule honors the given radius");
assert.ok(Ink.capsuleProfile()[2][0] > 0.04, "default limb capsule has mass");
const outline = Ink.womanOutline();
assert.ok(outline.reach[outline.reach.length - 1].y < Ink.waterY(), "outline reach enters the creek");
assert.ok(outline.spine.length >= 3, "spine stroke leans over the rock");

const fall = Ink.waterfall();
assert.ok(Math.abs(fall.x - b.x) < 0.8, "the fall lives on the boulder, not as a side sheet");
assert.ok(fall.z > 0.6, "the fall hangs on the facing rock");
assert.ok(fall.topY > 1.2, "fall has height");
assert.ok(fall.botY <= Ink.waterY() + 0.01, "fall meets the creek");
assert.strictEqual(Ink.waterfallSheets().length, 0, "no competing grey sheet waterfall");
assert.strictEqual(Ink.waterfallFilaments().length, 0, "filaments are the hair cascade, not a second fall");
const plunge = Ink.waterfallPlunge();
assert.ok(Math.abs(plunge.y - Ink.waterY()) < 0.03, "plunge sits on the film");
assert.ok(Ink.waterMarks().length >= 8, "creek is sparse calligraphy marks");
assert.ok(Ink.rockCracks().length >= 4, "boulder has crystalline crack marks");
const rh = Ink.rockHatchPixels(128, 128);
const rs = Ink.rockHatchStats(rh, 128, 128);
assert.ok(rs.ink > 0.03, "rock hatch holds navy pen");
assert.ok(rs.paperish > 0.4, "paper does half the rock");

const tr = Ink.tree();
assert.ok(tr.x < -2.2, "tree stands on the left bank");
assert.ok(tr.rBase > tr.rTop, "trunk tapers");
assert.ok(tr.height > 2.8 && tr.height < 4.2, "tree is tall enough to read, short enough for the spawn view");
assert.ok(tr.roots.length >= 2, "roots stay in the bark language");
assert.ok(tr.branches.length >= 2, "branches hold a crown");
const crown = Ink.treeCrown();
assert.ok(crown.length >= 8 && crown.length <= 16, "crown is sparse star leaves, as in the drawing");
assert.ok(crown.filter((leaf) => leaf.y > tr.height * 0.7).length >= 6, "canopy clusters at the top");
assert.ok(crown.some((leaf) => leaf.ink === "red"), "crown keeps the drawing’s red");
const hx = Ink.hatchPixels(128, 128);
const hs = Ink.hatchStats(hx, 128, 128);
assert.ok(hs.redInk > 0.12, "bark hatch holds enough red pen");
assert.ok(hs.paperish > 0.08, "paper shows through the bark");

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
assert.ok(study.indexOf("buildWoman") !== -1, "woman is sculpted into the scene");
assert.ok(study.indexOf('"woman"') !== -1, "woman is a named scene object");
assert.ok(study.indexOf("hand-dip") !== -1, "one hand is named as the dip");
assert.ok(study.indexOf("capsuleGeo") !== -1, "limbs are capsules");
assert.ok(study.indexOf("limbBetween") !== -1, "limbs are built as volumes between joints");
assert.ok(study.indexOf("womanTorso") !== -1, "torso is a lathe volume");
assert.ok(study.indexOf("womanHips") !== -1, "hips are a seated lathe volume");
assert.ok(study.indexOf("womanNeck") !== -1, "neck is a lathe volume");
assert.ok(study.indexOf("womanLimbR") !== -1, "limb radii come from the mass spec");
assert.ok(study.indexOf("Ink.FIGURE") !== -1, "figure fill is warm paper, not marble");
assert.ok(study.indexOf("Ink.FIGURE_DEPTH") !== -1, "limbs keep drawing flatten, not stick squash");
assert.ok(study.indexOf("figureVolume") !== -1, "figure uses filled volumes, not an edge cage");
assert.ok(study.indexOf("figureMat") !== -1, "figure fill is a hatch-and-rim ink shader");
assert.ok(!/geo\.scale\(\s*0\.72\s*,\s*1\s*,\s*0\.42\s*\)/.test(study), "limbs are not flattened into sticks");
assert.ok(study.indexOf("womanOutline") !== -1, "pen strokes still sit on the volumes");
assert.ok(study.indexOf("buildWaterfall") === -1, "no separate sheet waterfall is built");
assert.ok(study.indexOf("waterfallSheets") === -1, "study does not draw a second fall");
assert.ok(study.indexOf("buildTree") !== -1, "tree is built");
assert.ok(study.indexOf('"tree"') !== -1, "tree is a named scene object");
assert.ok(study.indexOf('"crown"') !== -1, "tree has a named crown");
assert.ok(study.indexOf("CircleGeometry") !== -1, "crown still has a faint star disk");
assert.ok(study.indexOf("LatheGeometry") !== -1, "figure and trunk are lathed, not snowman orbs");
assert.ok(study.indexOf("SphereGeometry") === -1, "no ellipsoid snowman volumes");
assert.ok(study.indexOf("rockHatch") !== -1, "boulder carries crystalline hatch");
assert.ok(study.indexOf("waterMarks") !== -1, "creek uses sparse line marks");
assert.ok(study.indexOf("artImg") === -1, "drawing is not mapped onto the woman");
assert.ok(study.indexOf("sampleTex") === -1, "no sampled photo planes");
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
