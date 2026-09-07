const assert = require("assert");
const Cut = require("../creek/layers.js");
const Nav = require("../field-nav.js");

const paper = Cut.liftColor(134, 141, 142);
assert.ok(paper[0] > 230 && paper[1] > 230 && paper[2] > 230, "paper lifts toward white");

const red = Cut.preparePixel(130, 36, 36, 0.52, 0.45);
assert.ok(red[0] > red[1] + 40, "red ink stays red after lift");
assert.ok(Cut.inkAlpha(red[0], red[1], red[2]) > 0.7, "red ink is opaque");

const liftedPaper = Cut.preparePixel(134, 141, 142, 0.5, 0.35);
assert.ok(Cut.inkAlpha(liftedPaper[0], liftedPaper[1], liftedPaper[2]) < 0.2, "paper knocks out");

const left = Cut.exclusive(Cut.weights(0.08, 0.4));
assert.ok(left.trees > left.woman && left.trees > left.mountains, "left column is the trees");

const cascade = Cut.exclusive(Cut.weights(0.52, 0.48));
assert.ok(cascade.hair >= cascade.trees, "hair waterfall stays on the hair plane");

const peak = Cut.exclusive(Cut.weights(0.78, 0.12));
assert.ok(peak.mountains > peak.trees, "upper right is mountains");

const creek = Cut.exclusive(Cut.weights(0.35, 0.88));
assert.ok(creek.river > creek.mountains, "bottom flow is the river plane");

assert.deepStrictEqual(Cut.ORDER, ["mountains", "hills", "woman", "hair", "trees", "river"]);
assert.ok(Math.abs(Cut.ASPECT - 1650 / 2200) < 1e-9, "drawing aspect is the shipped scan");

const fwd = Nav.moveOffset(0, 0, { forward: true }, 1, 10);
assert.ok(Math.abs(fwd.z + 10) < 1e-6, "W at yaw 0 travels −Z into the drawing");
assert.ok(Math.abs(fwd.y) < 1e-9, "walk stays on the plane");
assert.ok(Nav.dollyStep(-80, 0) > 0, "scroll up walks forward");

const lookRight = Nav.applyLook(0, 0, 12, 0);
assert.ok(lookRight.yaw > 0, "drag right looks right");

console.log("creek layers ok");
