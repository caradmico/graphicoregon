/* Graphic Oregon — look, dolly, and travel math (browser + Node) */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FieldNav = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const PITCH_LIMIT = 1.35;
  const LOOK_SENS = 0.0024;
  const DOLLY = 1.6;

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

  function lookDolly(yaw, pitch, deltaY, deltaMode, scale) {
    const step = dollyStep(deltaY, deltaMode, scale);
    const look = lookVector(yaw, pitch);
    return { x: look.x * step, y: look.y * step, z: look.z * step, step: step };
  }

  function rideGround(y, groundY, eye, pad) {
    const floor = (groundY || 0) + (eye == null ? 1.7 : eye) + (pad == null ? 0.2 : pad);
    return y < floor ? floor : y;
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
      lookUp: false,
      lookDown: false,
      turnLeft: false,
      turnRight: false,
      fast: false
    };
  }

  function keyFlags(code, key) {
    const c = code || "";
    const k = key == null ? "" : String(key).toLowerCase();
    return {
      forward: c === "KeyW" || k === "w",
      back: c === "KeyS" || k === "s",
      left: c === "KeyA" || k === "a",
      right: c === "KeyD" || k === "d",
      up: c === "KeyE" || c === "Space" || k === "e" || k === " ",
      down: c === "KeyQ" || k === "q",
      lookUp: c === "ArrowUp" || k === "arrowup",
      lookDown: c === "ArrowDown" || k === "arrowdown",
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
    if (f.lookUp) held.lookUp = down;
    if (f.lookDown) held.lookDown = down;
    if (f.turnLeft) held.turnLeft = down;
    if (f.turnRight) held.turnRight = down;
    if (f.fast) held.fast = down;
    return f;
  }

  function isMoveKey(code, key) {
    const f = keyFlags(code, key);
    return !!(f.forward || f.back || f.left || f.right || f.up || f.down || f.lookUp || f.lookDown || f.turnLeft || f.turnRight);
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

  function crossedSlab(ax, az, bx, bz, x0, x1, z0, z1) {
    const xmin = Math.min(x0, x1);
    const xmax = Math.max(x0, x1);
    const zmin = Math.min(z0, z1);
    const zmax = Math.max(z0, z1);
    const dx = bx - ax;
    const dz = bz - az;
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = ax + dx * t;
      const z = az + dz * t;
      if (x >= xmin && x <= xmax && z >= zmin && z <= zmax) return true;
    }
    return false;
  }

  function wheelCap(step, budget) {
    if (budget <= 0) return 0;
    if (Math.abs(step) <= budget) return step;
    return (step < 0 ? -1 : 1) * budget;
  }

  return {
    PITCH_LIMIT: PITCH_LIMIT,
    LOOK_SENS: LOOK_SENS,
    DOLLY: DOLLY,
    clamp: clamp,
    lookVector: lookVector,
    rightVector: rightVector,
    flatForward: flatForward,
    applyLook: applyLook,
    wheelUnit: wheelUnit,
    dollyStep: dollyStep,
    lookDolly: lookDolly,
    rideGround: rideGround,
    emptyHeld: emptyHeld,
    keyFlags: keyFlags,
    setHeld: setHeld,
    isMoveKey: isMoveKey,
    moveOffset: moveOffset,
    crossedSlab: crossedSlab,
    wheelCap: wheelCap
  };
});
