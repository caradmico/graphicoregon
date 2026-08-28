/* Graphic Oregon — look, dolly, and travel math (browser + Node) */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FieldNav = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const PITCH_LIMIT = 1.35;
  const LOOK_SENS = 0.0024;
  const DOLLY = 1.6;
  const GROUND_CLEARANCE = 0.55;

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lookVector(yaw, pitch, out) {
    const cp = Math.cos(pitch);
    const x = Math.sin(yaw) * cp;
    const y = Math.sin(pitch);
    const z = -Math.cos(yaw) * cp;
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return { x: x, y: y, z: z };
  }

  function rightVector(yaw, out) {
    const x = Math.cos(yaw);
    const y = 0;
    const z = Math.sin(yaw);
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return { x: x, y: y, z: z };
  }

  function applyLook(yaw, pitch, dx, dy, sens) {
    const s = sens == null ? LOOK_SENS : sens;
    return {
      yaw: yaw + dx * s,
      pitch: clamp(pitch - dy * s, -PITCH_LIMIT, PITCH_LIMIT)
    };
  }

  function wheelUnit(delta, deltaMode) {
    let d = delta;
    if (deltaMode === 1) d *= 16;
    if (deltaMode === 2) d *= 800;
    return clamp(d / 80, -1, 1);
  }

  function dollyStep(deltaY, deltaMode, scale) {
    return -wheelUnit(deltaY, deltaMode) * (scale == null ? DOLLY : scale);
  }

  function travelDolly(yaw, deltaY, deltaMode, scale) {
    const step = dollyStep(deltaY, deltaMode, scale);
    const flat = flatForward(yaw);
    return { x: flat.x * step, y: 0, z: flat.z * step, step: step };
  }

  function heightAt(x, z) {
    const r = Math.hypot(x, z);
    const flatten = Math.min(1, Math.max(0, (r - 7) / 22));
    const hills = Math.sin(x * 0.042 + 0.4) * Math.cos(z * 0.036) * 2.35
      + Math.sin(x * 0.11 + z * 0.08) * 0.7;
    const west = x < -16
      ? ((-16 - x) / 46) * 3.6 * Math.max(0, 1 - Math.abs(z) / 56)
      : 0;
    return hills * flatten + west;
  }

  function clearGround(y, groundY, clearance) {
    const g = groundY == null ? 0 : groundY;
    const pad = clearance == null ? GROUND_CLEARANCE : clearance;
    const floor = g + pad;
    return y < floor ? floor : y;
  }

  function stepOverTerrain(pos, delta, clearance) {
    const pad = clearance == null ? GROUND_CLEARANCE : clearance;
    const samples = 8;
    let x = pos.x;
    let y = pos.y;
    let z = pos.z;
    const dx = delta.x / samples;
    const dy = delta.y / samples;
    const dz = delta.z / samples;
    for (let i = 0; i < samples; i++) {
      x += dx;
      y += dy;
      z += dz;
      const floor = heightAt(x, z) + pad;
      if (y < floor) y = floor;
    }
    return { x: x, y: y, z: z };
  }

  function applyTravelDolly(pos, yaw, deltaY, deltaMode, scale) {
    return stepOverTerrain(pos, travelDolly(yaw, deltaY, deltaMode, scale));
  }

  function flatForward(yaw, out) {
    const x = Math.sin(yaw);
    const y = 0;
    const z = -Math.cos(yaw);
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return { x: x, y: y, z: z };
  }

  function emptyHeld() {
    return {
      forward: false,
      back: false,
      left: false,
      right: false,
      up: false,
      down: false,
      turnLeft: false,
      turnRight: false,
      fast: false
    };
  }

  function keyFlags(code, key) {
    const c = code || "";
    const k = key == null ? "" : String(key).toLowerCase();
    return {
      forward: c === "KeyW" || c === "ArrowUp" || k === "w" || k === "arrowup",
      back: c === "KeyS" || c === "ArrowDown" || k === "s" || k === "arrowdown",
      left: c === "KeyA" || k === "a",
      right: c === "KeyD" || k === "d",
      up: c === "KeyE" || c === "Space" || k === "e" || k === " ",
      down: c === "KeyQ" || k === "q",
      turnLeft: c === "ArrowLeft" || k === "arrowleft",
      turnRight: c === "ArrowRight" || k === "arrowright",
      fast: c === "ShiftLeft" || c === "ShiftRight" || k === "shift",
      home: c === "KeyH" || k === "h",
      lock: c === "KeyL" || k === "l",
      escape: c === "Escape" || k === "escape"
    };
  }

  function setHeld(held, code, key, down) {
    const f = keyFlags(code, key);
    if (f.forward) held.forward = down;
    if (f.back) held.back = down;
    if (f.left) held.left = down;
    if (f.right) held.right = down;
    if (f.up) held.up = down;
    if (f.down) held.down = down;
    if (f.turnLeft) held.turnLeft = down;
    if (f.turnRight) held.turnRight = down;
    if (f.fast) held.fast = down;
    return f;
  }

  function isMoveKey(code, key) {
    const f = keyFlags(code, key);
    return !!(f.forward || f.back || f.left || f.right || f.up || f.down || f.turnLeft || f.turnRight);
  }

  function moveOffset(yaw, pitch, keys, dt, speed) {
    const look = flatForward(yaw);
    const right = rightVector(yaw);
    let x = 0;
    let y = 0;
    let z = 0;
    if (keys.forward) {
      x += look.x;
      z += look.z;
    }
    if (keys.back) {
      x -= look.x;
      z -= look.z;
    }
    if (keys.left) {
      x -= right.x;
      z -= right.z;
    }
    if (keys.right) {
      x += right.x;
      z += right.z;
    }
    if (keys.up) y += 1;
    if (keys.down) y -= 1;
    const len = Math.hypot(x, y, z);
    if (len < 1e-8) return { x: 0, y: 0, z: 0 };
    const k = (speed * dt) / len;
    return { x: x * k, y: y * k, z: z * k };
  }

  return {
    PITCH_LIMIT: PITCH_LIMIT,
    LOOK_SENS: LOOK_SENS,
    DOLLY: DOLLY,
    GROUND_CLEARANCE: GROUND_CLEARANCE,
    clamp: clamp,
    lookVector: lookVector,
    rightVector: rightVector,
    flatForward: flatForward,
    applyLook: applyLook,
    wheelUnit: wheelUnit,
    dollyStep: dollyStep,
    travelDolly: travelDolly,
    heightAt: heightAt,
    clearGround: clearGround,
    stepOverTerrain: stepOverTerrain,
    applyTravelDolly: applyTravelDolly,
    emptyHeld: emptyHeld,
    keyFlags: keyFlags,
    setHeld: setHeld,
    isMoveKey: isMoveKey,
    moveOffset: moveOffset
  };
});
