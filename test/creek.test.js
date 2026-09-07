const assert = require("assert");
const Form = require("../creek/form.js");
const Nav = require("../field-nav.js");

assert.strictEqual(Form.INK, 0x1a2744, "ink is the drawing’s dark blue");
assert.strictEqual(Form.RED, 0xa3262b, "red is the drawing’s pen red");
assert.strictEqual(Form.PAPER, 0xf4efe6, "ground stays paper, not lawn");

const strand = Form.hairStrand(3, 12);
const drop = Form.strandDrops(strand);
assert.ok(strand.length >= 6, "hair has a path through space");
assert.ok(drop.flattens, "hair falls then becomes the creek");
assert.ok(drop.towardViewer, "creek comes toward the walker");
assert.ok(drop.leftward, "creek turns left as in the drawing");
assert.ok(drop.drop > 1.5, "cascade has real vertical drop");

const trees = Form.treeSpec();
assert.ok(trees.thick.r > trees.slim[0].r, "foreground tree is the thick trunk");
assert.ok(trees.red.z < trees.thick.z, "red tree stands behind the woman");
assert.ok(Form.hillSpecs().length >= 3, "distant hills exist as volumes");
assert.ok(Form.HEAD.y > Form.BOULDER.y, "head sits over the boulder");

const fwd = Nav.moveOffset(0, 0, { forward: true }, 1, 10);
assert.ok(Math.abs(fwd.z + 10) < 1e-6, "W at yaw 0 walks −Z into the creek");
assert.ok(Math.abs(fwd.y) < 1e-9, "walk stays on the paper plane");
assert.ok(Nav.dollyStep(-80, 0) > 0, "scroll up walks forward");
const lookRight = Nav.applyLook(0, 0, 12, 0);
assert.ok(lookRight.yaw > 0, "drag right looks right");

console.log("creek 3d form ok");
