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

const sky = nav.lookDolly(0, 0.7, -80, 0);
assert.ok(sky.y > 0, "look-up + wheel-up travels +Y (sky is legal)");
assert.ok(sky.step > 0, "wheel-up still dollies forward (not inverted)");

const level = nav.lookDolly(0, 0, -80, 0);
assert.ok(Math.abs(level.y) < 1e-9, "level look wheel has no Y");
assert.ok(level.z < 0, "level wheel-up still travels -Z");

assert.ok(
  Math.abs(nav.clearGround(1.7, 2.3) - (2.3 + nav.GROUND_CLEARANCE)) < 1e-9,
  "hill lifts the camera over dirt"
);
assert.ok(nav.clearGround(20, 2.3) === 20, "sky stay is not pulled down to the hill");
assert.ok(
  nav.clearGround(1.7, 0) === 1.7,
  "plaza grass does not pin a standing eye (no EYE floor)"
);

const fromSpawn = { x: 0, y: 1.7, z: 0 };
const skyRide = nav.applyLookDolly(fromSpawn, 0, 0.9, -80, 0);
assert.ok(skyRide.y > fromSpawn.y + 0.8, "look-up scroll still climbs after terrain resolve");
assert.ok(skyRide.y >= nav.heightAt(skyRide.x, skyRide.z) + nav.GROUND_CLEARANCE - 1e-9, "sky step stays out of dirt");

const research = { x: 34, y: 2.2, z: 2 };
const yawResearch = Math.atan2(research.x, -research.z);
let toward = { x: 0, y: 1.7, z: 0 };
let maxHill = nav.heightAt(0, 0);
let yOnCrest = 1.7;
for (let i = 0; i < 28; i++) {
  toward = nav.applyLookDolly(toward, yawResearch, -0.12, -80, 0);
  const ground = nav.heightAt(toward.x, toward.z);
  const floor = ground + nav.GROUND_CLEARANCE;
  if (ground > maxHill) {
    maxHill = ground;
    yOnCrest = toward.y;
  }
  assert.ok(toward.y + 1e-9 >= floor, "Research heading does not clip dirt at x=" + toward.x.toFixed(2));
}
assert.ok(toward.x > 20, "Research heading actually travels east");
assert.ok(maxHill > 1.7, "the Research path crosses a hill taller than spawn eye");
assert.ok(yOnCrest >= maxHill, "camera rides over the Research hill instead of through it");

console.log("field-nav: all assertions passed");
