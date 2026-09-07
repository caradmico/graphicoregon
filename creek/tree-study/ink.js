/* Hair and river — the left foreground tree, as pen math. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TreeInk = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const NAVY = 0x1a2744;
  const RED = 0xa3262b;
  const PAPER = 0xf4efe6;
  const NAVY_RGB = [26, 39, 68];
  const RED_RGB = [163, 38, 43];
  const PAPER_RGB = [244, 239, 230];

  const SPAWN = { az: 0.46, el: 0.11, dist: 8.6, targetY: 2.45 };
  const DIST = { min: 3.4, max: 15.5 };
  const EL = { min: -0.12, max: 1.12 };

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function tree() {
    return {
      height: 6.35,
      rTop: 0.20,
      rMid: 0.335,
      rBase: 0.42,
      rFlare: 0.58,
      lean: 0.04,
      profile: [
        [0.04, 0.00],
        [0.46, 0.00],
        [0.58, 0.05],
        [0.50, 0.14],
        [0.43, 0.26],
        [0.40, 0.52],
        [0.375, 1.05],
        [0.355, 1.70],
        [0.345, 2.35],
        [0.335, 3.05],
        [0.318, 3.75],
        [0.298, 4.40],
        [0.275, 5.05],
        [0.248, 5.60],
        [0.228, 6.05],
        [0.20, 6.22],
        [0.12, 6.32],
        [0.04, 6.35]
      ],
      roots: [
        {
          name: "root-left",
          r0: 0.22,
          r1: 0.055,
          reach: -1.55,
          pts: [
            { x: -0.18, y: 0.32, z: 0.06 },
            { x: -0.58, y: 0.16, z: 0.14 },
            { x: -1.05, y: 0.05, z: 0.04 },
            { x: -1.55, y: 0.02, z: -0.22 }
          ]
        },
        {
          name: "root-right",
          r0: 0.125,
          r1: 0.032,
          reach: 0.82,
          pts: [
            { x: 0.16, y: 0.24, z: 0.04 },
            { x: 0.44, y: 0.09, z: -0.06 },
            { x: 0.82, y: 0.02, z: -0.12 }
          ]
        },
        {
          name: "root-back",
          r0: 0.1,
          r1: 0.03,
          reach: 0.16,
          pts: [
            { x: 0.04, y: 0.2, z: -0.14 },
            { x: 0.12, y: 0.07, z: -0.42 },
            { x: 0.16, y: 0.015, z: -0.72 }
          ]
        }
      ],
      branches: [
        {
          name: "branch-low-right",
          r: 0.032,
          pts: [
            { x: 0.32, y: 2.02, z: 0.06 },
            { x: 0.78, y: 2.18, z: 0.16 },
            { x: 1.28, y: 2.06, z: 0.04 }
          ]
        },
        {
          name: "branch-mid-left",
          r: 0.026,
          pts: [
            { x: -0.34, y: 3.48, z: 0.04 },
            { x: -0.82, y: 3.88, z: 0.14 },
            { x: -1.28, y: 4.22, z: 0.02 }
          ]
        },
        {
          name: "branch-high-left",
          r: 0.018,
          pts: [
            { x: -0.24, y: 5.08, z: -0.02 },
            { x: -0.62, y: 5.48, z: 0.1 },
            { x: -0.98, y: 5.82, z: 0.0 }
          ]
        }
      ]
    };
  }

  function hatchPixels(w, h) {
    const data = new Uint8ClampedArray(w * h * 4);
    let i;
    for (i = 0; i < w * h; i++) {
      const n = hash(i * 0.17);
      const k = (n - 0.5) * 7;
      const p = i * 4;
      data[p] = PAPER_RGB[0] + k;
      data[p + 1] = PAPER_RGB[1] + k * 0.8;
      data[p + 2] = PAPER_RGB[2] + k * 0.5;
      data[p + 3] = 255;
    }
    const rows = Math.floor(h / 3.2);
    let r;
    for (r = 0; r < rows; r++) {
      if (hash(r * 1.13) < 0.07) continue;
      const y0 = (r + 0.28 + hash(r * 3.1) * 0.45) * (h / rows);
      const thick = 0.65 + hash(r * 8.2) * 1.35;
      const amp = 1.1 + hash(r * 2.4) * 2.4;
      const freq = 1.4 + hash(r * 5.5) * 2.6;
      const phase = hash(r * 9.9) * Math.PI * 2;
      const cells = 12;
      let x;
      for (x = 0; x < w; x++) {
        const cell = Math.floor((x / w) * cells);
        if (hash(r * 17 + cell * 3.2) < 0.13) continue;
        const y = y0 + Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp;
        const y1 = Math.max(0, Math.floor(y - thick));
        const y2 = Math.min(h - 1, Math.ceil(y + thick));
        let yy;
        for (yy = y1; yy <= y2; yy++) {
          const d = Math.abs(yy - y);
          if (d > thick) continue;
          const a = 1 - d / thick;
          const edge = Math.min(x, w - 1 - x) / (w * 0.035);
          const press = Math.min(1, 0.52 + a * 0.58) * Math.min(1, Math.max(0, edge));
          const q = (yy * w + x) * 4;
          const jitter = hash(r * 4.4 + x * 0.08) * 10 - 5;
          data[q] = data[q] * (1 - press) + (RED_RGB[0] + jitter) * press;
          data[q + 1] = data[q + 1] * (1 - press) + RED_RGB[1] * press;
          data[q + 2] = data[q + 2] * (1 - press) + RED_RGB[2] * press;
        }
      }
    }
    return data;
  }

  function sampleHatch(data, w, h, x, y) {
    const xi = clamp(Math.floor(x), 0, w - 1);
    const yi = clamp(Math.floor(y), 0, h - 1);
    const p = (yi * w + xi) * 4;
    return [data[p], data[p + 1], data[p + 2]];
  }

  function hatchStats(data, w, h) {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    let redInk = 0;
    let paperish = 0;
    let i;
    for (i = 0; i < w * h; i += 3) {
      const p = i * 4;
      r += data[p];
      g += data[p + 1];
      b += data[p + 2];
      n += 1;
      if (data[p] > data[p + 1] + 40 && data[p] > data[p + 2] + 30) redInk += 1;
      if (data[p] > 220 && data[p + 1] > 210 && data[p + 2] > 200) paperish += 1;
    }
    return {
      r: r / n,
      g: g / n,
      b: b / n,
      redInk: redInk / n,
      paperish: paperish / n
    };
  }

  function applyOrbit(az, el, dx, dy, sens) {
    const s = sens == null ? 0.0052 : sens;
    return {
      az: az + dx * s,
      el: clamp(el - dy * s, EL.min, EL.max)
    };
  }

  function dollyDist(dist, deltaY, deltaMode, scale) {
    let d = deltaY;
    if (deltaMode === 1) d *= 16;
    if (deltaMode === 2) d *= 800;
    const unit = clamp(d / 80, -1, 1);
    const step = -unit * (scale == null ? 0.85 : scale);
    return clamp(dist - step, DIST.min, DIST.max);
  }

  function pinchDist(dist, scale) {
    return clamp(dist / Math.max(0.35, Math.min(2.6, scale)), DIST.min, DIST.max);
  }

  function cameraPos(az, el, dist, target) {
    const t = target || { x: 0, y: SPAWN.targetY, z: 0 };
    const ce = Math.cos(el);
    return {
      x: t.x + Math.sin(az) * ce * dist,
      y: t.y + Math.sin(el) * dist,
      z: t.z + Math.cos(az) * ce * dist
    };
  }

  function isLawn(rgb) {
    return rgb[1] > rgb[0] + 12 && rgb[1] > rgb[2] + 8;
  }

  return {
    NAVY: NAVY,
    RED: RED,
    PAPER: PAPER,
    NAVY_RGB: NAVY_RGB,
    RED_RGB: RED_RGB,
    PAPER_RGB: PAPER_RGB,
    SPAWN: SPAWN,
    DIST: DIST,
    EL: EL,
    clamp: clamp,
    hash: hash,
    tree: tree,
    hatchPixels: hatchPixels,
    sampleHatch: sampleHatch,
    hatchStats: hatchStats,
    applyOrbit: applyOrbit,
    dollyDist: dollyDist,
    pinchDist: pinchDist,
    cameraPos: cameraPos,
    isLawn: isLawn
  };
});
