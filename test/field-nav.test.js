const assert = require("assert");
const nav = require("../field-nav.js");

const look0 = nav.lookVector(0, 0);
assert.ok(Math.abs(look0.x) < 1e-9, "yaw 0 faces world −Z");
assert.ok(Math.abs(look0.y) < 1e-9, "level pitch has no Y");
assert.ok(Math.abs(look0.z + 1) < 1e-9, "yaw 0 look.z is −1");

const afterRight = nav.applyLook(0, 0, 12, 0);
assert.ok(afterRight.yaw > 0, "hand-right (positive dx) increases yaw");
const lookRight = nav.lookVector(afterRight.yaw, 0);
assert.ok(lookRight.x > 0, "increased yaw looks toward +X (turn right)");

const afterLeft = nav.applyLook(0, 0, -12, 0);
assert.ok(afterLeft.yaw < 0, "hand-left decreases yaw");
const lookLeft = nav.lookVector(afterLeft.yaw, 0);
assert.ok(lookLeft.x < 0, "decreased yaw looks toward −X (turn left)");

const afterUp = nav.applyLook(0, 0, 0, -12);
assert.ok(afterUp.pitch > 0, "hand-up (negative dy) looks up");
const lookUp = nav.lookVector(0, afterUp.pitch);
assert.ok(lookUp.y > 0, "positive pitch has +Y");

const afterDown = nav.applyLook(0, 0, 0, 12);
assert.ok(afterDown.pitch < 0, "hand-down looks down");

const ceiling = nav.applyLook(0, nav.PITCH_LIMIT, 0, -400);
assert.ok(ceiling.pitch <= nav.PITCH_LIMIT, "pitch clamps at the top");

assert.ok(nav.dollyStep(-80, 0) > 0, "wheel up dollies forward along look");
assert.ok(nav.dollyStep(80, 0) < 0, "wheel down dollies backward");

const fwd = nav.moveOffset(0, 0, { forward: true }, 1, 10);
assert.ok(Math.abs(fwd.z + 10) < 1e-6, "W at yaw 0 travels −Z");
assert.ok(Math.abs(fwd.y) < 1e-9, "level forward stays off the floor plane only when pitched");

const climb = nav.moveOffset(0, 0.6, { forward: true }, 1, 10);
assert.ok(Math.abs(climb.y) < 1e-9, "WASD stays on the field even when looking up");
assert.ok(Math.abs(climb.z + 10) < 1e-6, "pitched look still walks −Z at yaw 0");

const w = nav.keyFlags("KeyW", "w");
assert.ok(w.forward, "KeyW is walk forward");
const eKey = nav.keyFlags("KeyE", "e");
assert.ok(eKey.up, "KeyE leaves the plane");
const qKey = nav.keyFlags("KeyQ", "q");
assert.ok(qKey.down, "KeyQ drops");
const held = nav.emptyHeld();
nav.setHeld(held, "KeyW", "w", true);
assert.ok(held.forward, "held W stays down until keyup");
nav.setHeld(held, "KeyW", "w", false);
assert.ok(!held.forward, "keyup clears W");

const rise = nav.moveOffset(0, 0, { up: true }, 1, 10);
assert.ok(Math.abs(rise.y - 10) < 1e-6, "E/space climbs world +Y");
assert.ok(Math.abs(rise.x) < 1e-9 && Math.abs(rise.z) < 1e-9, "climb is vertical");

const right = nav.rightVector(0);
assert.ok(Math.abs(right.x - 1) < 1e-9, "strafe-right at yaw 0 is +X");

console.log("field-nav: all assertions passed");
