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

  function moveOffset(yaw, pitch, keys, dt, speed) {
    const look = lookVector(yaw, pitch);
    const right = rightVector(yaw);
    let x = 0;
    let y = 0;
    let z = 0;
    if (keys.forward) {
      x += look.x;
      y += look.y;
      z += look.z;
    }
    if (keys.back) {
      x -= look.x;
      y -= look.y;
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
    clamp: clamp,
    lookVector: lookVector,
    rightVector: rightVector,
    applyLook: applyLook,
    wheelUnit: wheelUnit,
    dollyStep: dollyStep,
    moveOffset: moveOffset
  };
});
