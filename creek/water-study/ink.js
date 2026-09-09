/* Hair and river — hair over the boulder, and the creek it enters, as pen math. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.WaterInk = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const NAVY = 0x1a2744;
  const RED = 0xa3262b;
  const PAPER = 0xf4efe6;
  const FIGURE = 0xe2d4c0;
  const NAVY_RGB = [26, 39, 68];
  const RED_RGB = [163, 38, 43];
  const PAPER_RGB = [244, 239, 230];
  const FIGURE_RGB = [226, 212, 192];

  const SPAWN = { az: 0.16, el: 0.15, dist: 5.7, targetX: -0.42, targetY: 1.05, targetZ: 0.55 };
  const DIST = { min: 3.5, max: 13.2 };
  const EL = { min: -0.06, max: 1.06 };

  const FALL_N = 36;
  const RIPPLE_N = 12;
  const WATER_Y = 0.052;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function boulder() {
    return {
      x: 0,
      y: 0.82,
      z: 0,
      rx: 1.38,
      ry: 0.82,
      rz: 1.15
    };
  }

  function insideBoulder(p, scale) {
    const b = boulder();
    const s = scale == null ? 1 : scale;
    const nx = (p.x - b.x) / (b.rx * s);
    const ny = (p.y - b.y) / (b.ry * s);
    const nz = (p.z - b.z) / (b.rz * s);
    return nx * nx + ny * ny + nz * nz < 1;
  }

  function outsideBoulder(p, lift) {
    const b = boulder();
    const pad = lift == null ? 0.045 : lift;
    const nx = (p.x - b.x) / b.rx;
    const ny = (p.y - b.y) / b.ry;
    const nz = (p.z - b.z) / b.rz;
    const d = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (d >= 1 + pad) return { x: p.x, y: p.y, z: p.z };
    const k = (1 + pad) / Math.max(d, 1e-5);
    return {
      x: b.x + nx * b.rx * k,
      y: b.y + ny * b.ry * k,
      z: b.z + nz * b.rz * k
    };
  }

  function strandColor(i) {
    return i % 3 === 0 ? "navy" : "red";
  }

  function rippleColor(i) {
    return i % 4 === 0 ? "red" : "navy";
  }

  function laneOf(i, n) {
    const u = n <= 1 ? 0.5 : i / (n - 1);
    const wobble = (hash(i * 9.1) - 0.5) * 0.08;
    return clamp((u - 0.5) * 2 + wobble, -1, 1);
  }

  /* Woman perched on the boulder — seated mass, lean, one hand in the creek. */
  function woman() {
    return {
      hip: { x: -0.92, y: 1.40, z: 0.32 },
      chest: { x: -0.52, y: 1.86, z: 0.42 },
      neck: { x: -0.32, y: 2.10, z: 0.40 },
      head: { x: -0.16, y: 2.30, z: 0.36 },
      headR: 0.15,
      shoulderL: { x: -0.62, y: 1.84, z: 0.58 },
      shoulderR: { x: -0.38, y: 1.78, z: 0.18 },
      elbowDip: outsideBoulder({ x: -0.08, y: 1.00, z: 0.82 }, 0.055),
      handDip: { x: 0.22, y: 0.024, z: 1.12 },
      elbowRest: { x: -0.48, y: 1.48, z: 0.28 },
      handRest: { x: -0.28, y: 1.34, z: 0.46 },
      kneeL: { x: -1.08, y: 1.28, z: 0.38 },
      kneeR: { x: -0.72, y: 1.26, z: 0.18 },
      footL: { x: -0.88, y: 1.22, z: 0.62 },
      footR: { x: -0.58, y: 1.20, z: 0.42 },
      tear: { x: -0.08, y: 2.24, z: 0.44 }
    };
  }

  /* Navy pen strokes sit ON the volumes — they are not the body. */
  function womanOutline() {
    const w = woman();
    const r = w.headR;
    const head = [];
    let i;
    for (i = 0; i <= 14; i++) {
      const a = (i / 14) * Math.PI * 1.7 + 0.6;
      head.push({
        x: w.head.x + Math.cos(a) * r * 0.78,
        y: w.head.y + Math.sin(a) * r,
        z: w.head.z + Math.sin(a * 0.5) * r * 0.18
      });
    }
    return {
      head: head,
      spine: [head[0], w.neck, w.chest, w.hip],
      reach: [w.neck, w.shoulderL, w.elbowDip, w.handDip],
      rest: [w.chest, w.shoulderR, w.elbowRest, w.handRest],
      legL: [w.hip, w.kneeL, w.footL],
      legR: [w.hip, w.kneeR, w.footR]
    };
  }

  function profileMaxR(pts) {
    let m = 0;
    let i;
    for (i = 0; i < pts.length; i++) {
      if (pts[i][0] > m) m = pts[i][0];
    }
    return m;
  }

  /* Lathed body of mass — warm paper fill, navy outline.
     Not snowman ellipsoids, not ink-stroke sticks. */
  function womanTorso() {
    return [
      [0.055, 0.00],
      [0.118, 0.04],
      [0.128, 0.12],
      [0.122, 0.20],
      [0.136, 0.30],
      [0.108, 0.40],
      [0.058, 0.50]
    ];
  }

  function womanHips() {
    return [
      [0.040, 0.00],
      [0.132, 0.04],
      [0.168, 0.10],
      [0.152, 0.16],
      [0.088, 0.22],
      [0.032, 0.26]
    ];
  }

  function womanNeck() {
    return [
      [0.028, 0.00],
      [0.040, 0.03],
      [0.038, 0.08],
      [0.030, 0.12]
    ];
  }

  function womanHead() {
    return [
      [0.012, 0.00],
      [0.062, 0.028],
      [0.092, 0.072],
      [0.098, 0.128],
      [0.078, 0.188],
      [0.032, 0.228]
    ];
  }

  function womanLimbR() {
    return {
      upperArm: 0.048,
      forearm: 0.038,
      thigh: 0.062,
      shin: 0.042,
      hand: 0.028
    };
  }

  /* Slight drawing flatten — volume, not a paper-thin card. */
  const FIGURE_DEPTH = 0.82;

  function womanMass() {
    const r = womanLimbR();
    return {
      torsoMaxR: profileMaxR(womanTorso()),
      hipMaxR: profileMaxR(womanHips()),
      headMaxR: profileMaxR(womanHead()),
      neckMaxR: profileMaxR(womanNeck()),
      thighR: r.thigh,
      upperArmR: r.upperArm,
      forearmR: r.forearm,
      shinR: r.shin,
      handR: r.hand,
      depth: FIGURE_DEPTH
    };
  }

  function capsuleProfile(r, len) {
    const rad = r == null ? 0.055 : r;
    const l = len == null ? 0.22 : len;
    return [
      [0.003, 0.00],
      [rad * 0.72, rad * 0.28],
      [rad, l * 0.42],
      [rad * 0.78, l * 0.78],
      [0.003, l]
    ];
  }

  function hairRoot(i, n) {
    const head = woman().head;
    const count = n == null ? FALL_N : n;
    const lane = laneOf(i, count);
    return {
      x: head.x + lane * 0.05 + 0.04,
      y: head.y + 0.06 + hash(i * 2.2) * 0.03,
      z: head.z - 0.04 + Math.abs(lane) * 0.02
    };
  }

  function hairAttached(pts, head, max) {
    const p = pts[0];
    const h = head || woman().head;
    const d = Math.hypot(p.x - h.x, p.y - h.y, p.z - h.z);
    return d < (max == null ? 0.42 : max);
  }

  /* Hair IS the waterfall: dense parallel strands cascade the boulder face,
     then flatten into sparse creek ripples. No second sheet fall beside the rock. */
  function hairStrand(i, n) {
    const count = n == null ? FALL_N : n;
    const lane = laneOf(i, count);
    const peel = Math.abs(lane) > 0.82 ? Math.sign(lane) : 0;
    const root = hairRoot(i, count);
    const faceX = lane * 0.78 + peel * 0.55;
    const faceZ = 1.02 + Math.abs(lane) * 0.06 - Math.abs(peel) * 0.22;

    const pts = [
      root,
      { x: root.x + lane * 0.04, y: root.y - 0.10, z: root.z + 0.10 },
      { x: faceX * 0.35, y: 1.58, z: 0.42 + Math.abs(peel) * 0.08 },
      { x: faceX * 0.72, y: 1.18, z: faceZ * 0.78 },
      { x: faceX * 0.92, y: 0.72, z: faceZ },
      { x: faceX * 1.02, y: 0.28, z: faceZ * 1.04 },
      { x: faceX * 1.04 + peel * 0.12, y: 0.072, z: faceZ + 0.22 },
      { x: faceX * 0.72 - 0.22 - lane * 0.10, y: 0.050, z: 1.92 + Math.abs(lane) * 0.12 },
      { x: faceX * 0.28 - 0.85 - Math.max(0, -lane) * 0.22, y: 0.042, z: 2.85 },
      { x: faceX * 0.08 - 1.42 - lane * 0.16, y: 0.036, z: 3.58 }
    ];

    return pts.map((p, idx) => {
      if (idx === 0) return p;
      if (idx >= 6) return wavePoint(p, i, idx);
      return outsideBoulder(p, 0.042 + hash(i * 2.7 + idx) * 0.02);
    });
  }

  function wavePoint(p, seed, idx) {
    const w = Math.sin(p.z * 2.15 + seed * 0.7) * 0.055;
    const v = Math.sin(p.z * 3.4 + seed * 1.3) * 0.012;
    return { x: p.x + w, y: p.y + v, z: p.z };
  }

  function waterStrand(i, n) {
    return hairStrand(i, n);
  }

  /* Extra hair tails on the creek — the previous surface strands, kept visible. */
  function rippleStrand(i, n) {
    const count = n == null ? RIPPLE_N : n;
    const u = count <= 1 ? 0.5 : i / (count - 1);
    const side = (u - 0.5) * 2.4;
    const b = boulder();
    const r0 = b.rx + 0.22 + hash(i * 4.4) * 0.18;
    const pts = [];
    let k;
    for (k = 0; k < 9; k++) {
      const t = k / 8;
      const a = -0.15 + t * 2.35 + side * 0.22;
      const r = r0 + t * 1.85 + Math.abs(side) * 0.12;
      const x = Math.sin(a) * r * 0.72 - t * 1.15 - side * 0.08;
      const z = Math.cos(a) * r * 0.18 + t * 3.05 + 0.55;
      pts.push(wavePoint({ x: x, y: 0.042 + hash(i + k) * 0.01, z: z }, i + 30, k));
    }
    return pts;
  }

  function allStrands() {
    const fall = [];
    let i;
    for (i = 0; i < FALL_N; i++) fall.push(hairStrand(i, FALL_N));
    return fall;
  }

  function allRipples() {
    const rip = [];
    let i;
    for (i = 0; i < RIPPLE_N; i++) rip.push(rippleStrand(i, RIPPLE_N));
    return rip;
  }

  function strandTravel(pts) {
    const first = pts[0];
    const bend = pts[5] || pts[Math.floor(pts.length / 2)];
    const last = pts[pts.length - 1];
    let drop = 0;
    let i;
    for (i = 1; i < pts.length; i++) {
      if (pts[i].y < pts[i - 1].y) drop += pts[i - 1].y - pts[i].y;
    }
    return {
      drop: drop,
      falls: first.y - bend.y > 1.2,
      flattens: last.y < 0.16 && first.y > 1.6,
      towardViewer: last.z > first.z,
      leftward: last.x < bend.x
    };
  }

  function wrapStats(strands) {
    const b = boulder();
    let left = 0;
    let right = 0;
    let over = 0;
    let coreHits = 0;
    let points = 0;
    strands.forEach((pts) => {
      const bend = pts[5] || pts[Math.floor(pts.length / 2)];
      if (bend.x < b.x - 0.55) left += 1;
      else if (bend.x > b.x + 0.55) right += 1;
      else if (bend.z > 0.55) over += 1;
      pts.forEach((p) => {
        points += 1;
        if (insideBoulder(p, 0.88)) coreHits += 1;
      });
    });
    return {
      left: left,
      right: right,
      over: over,
      splits: left > 0 && right > 0,
      coreHits: coreHits,
      points: points
    };
  }

  function waterY() {
    return WATER_Y;
  }

  function creekPatch() {
    return { x: -0.45, z: 1.48, w: 9.4, d: 7.8 };
  }

  /* Looking straight down (ndotv ~ 1) is see-through; grazing is reflective. */
  function fresnelWeight(ndotv, power) {
    const n = clamp(ndotv, 0, 1);
    const p = power == null ? 2.4 : power;
    return Math.pow(1 - n, p);
  }

  function waterAlpha(ndotv) {
    return lerp(0.04, 0.22, fresnelWeight(ndotv, 2.4));
  }

  function bedStones() {
    return [
      { x: 1.68, y: 0.03, z: 1.48, rx: 0.24, ry: 0.1, rz: 0.18 },
      { x: 2.02, y: 0.024, z: 2.22, rx: 0.15, ry: 0.072, rz: 0.13 },
      { x: 1.22, y: 0.022, z: 2.62, rx: 0.12, ry: 0.06, rz: 0.1 },
      { x: -2.12, y: 0.02, z: 2.38, rx: 0.14, ry: 0.064, rz: 0.12 },
      { x: -1.48, y: 0.018, z: 3.22, rx: 0.11, ry: 0.052, rz: 0.09 },
      { x: 0.82, y: 0.02, z: 3.12, rx: 0.13, ry: 0.058, rz: 0.11 },
      { x: 2.18, y: 0.016, z: 3.42, rx: 0.1, ry: 0.046, rz: 0.085 }
    ];
  }

  function reeds() {
    return [
      { x: -2.15, z: 1.72, h: 0.34 },
      { x: -1.68, z: 2.28, h: 0.28 },
      { x: 1.42, z: 1.48, h: 0.26 },
      { x: -2.48, z: 3.05, h: 0.3 },
      { x: 1.18, z: 2.15, h: 0.22 }
    ];
  }

  function hills() {
    return [
      { x: 2.6, z: -8.8, w: 6.4, h: 2.35 },
      { x: -1.8, z: -9.6, w: 5.2, h: 1.85 }
    ];
  }

  /* The fall is the hair curtain on the boulder face — not a second grey sheet. */
  function waterfall() {
    return {
      x: 0.08,
      z: 1.04,
      topY: 1.72,
      botY: WATER_Y,
      width: 1.42
    };
  }

  function waterfallSheets() {
    return [];
  }

  function waterfallFilaments() {
    return [];
  }

  function waterfallPlunge() {
    const w = waterfall();
    return { x: w.x, y: WATER_Y + 0.003, z: w.z + 0.28 };
  }

  /* Sparse calligraphy ripples on the creek — paper stays mostly open. */
  function waterMarks() {
    const marks = [];
    const n = 11;
    let i;
    for (i = 0; i < n; i++) {
      const z0 = 1.18 + i * 0.28 + (hash(i * 2.2) - 0.5) * 0.08;
      const x0 = -2.15 + (hash(i * 3.7) - 0.5) * 0.55;
      const span = 2.4 + hash(i * 5.1) * 1.8;
      const pts = [];
      let k;
      for (k = 0; k < 7; k++) {
        const t = k / 6;
        pts.push({
          x: x0 + t * span + Math.sin(t * 3.4 + i) * 0.12,
          y: WATER_Y + 0.004,
          z: z0 + Math.sin(t * Math.PI * 1.6 + i * 0.7) * 0.07
        });
      }
      marks.push({ pts: pts, ink: i % 5 === 0 ? "red" : "navy" });
    }
    return marks;
  }

  /* Crystalline crack polylines on one boulder face. */
  function rockCracks() {
    return [
      [
        { x: -0.42, y: 0.92, z: 0.88 },
        { x: -0.08, y: 1.12, z: 1.02 },
        { x: 0.28, y: 0.98, z: 1.08 },
        { x: 0.55, y: 0.72, z: 1.00 }
      ],
      [
        { x: -0.22, y: 0.55, z: 1.00 },
        { x: 0.12, y: 0.68, z: 1.10 },
        { x: 0.38, y: 0.48, z: 1.06 }
      ],
      [
        { x: 0.18, y: 1.22, z: 0.72 },
        { x: 0.42, y: 1.08, z: 0.92 },
        { x: 0.62, y: 0.82, z: 0.98 }
      ],
      [
        { x: -0.62, y: 0.72, z: 0.78 },
        { x: -0.38, y: 0.58, z: 0.96 },
        { x: -0.12, y: 0.42, z: 1.02 }
      ],
      [
        { x: 0.05, y: 1.38, z: 0.48 },
        { x: 0.22, y: 1.28, z: 0.68 },
        { x: 0.08, y: 1.08, z: 0.88 }
      ]
    ];
  }

  /* Left-bank tree: hatched trunk (tree-study bark language) plus a readable crown. */
  function tree() {
    return {
      x: -2.72,
      z: 0.42,
      height: 3.28,
      rBase: 0.34,
      rMid: 0.24,
      rTop: 0.11,
      lean: 0.03,
      profile: [
        [0.04, 0.00],
        [0.38, 0.02],
        [0.32, 0.24],
        [0.28, 0.72],
        [0.25, 1.35],
        [0.22, 1.95],
        [0.18, 2.48],
        [0.14, 2.88],
        [0.11, 3.12],
        [0.05, 3.22],
        [0.03, 3.28]
      ],
      roots: [
        {
          name: "root-left",
          r0: 0.20,
          r1: 0.042,
          pts: [
            { x: -0.22, y: 0.40, z: 0.10 },
            { x: -0.82, y: 0.14, z: 0.18 },
            { x: -1.38, y: 0.03, z: -0.10 }
          ]
        },
        {
          name: "root-right",
          r0: 0.12,
          r1: 0.032,
          pts: [
            { x: 0.20, y: 0.32, z: 0.08 },
            { x: 0.58, y: 0.12, z: -0.02 },
            { x: 0.92, y: 0.03, z: -0.10 }
          ]
        },
        {
          name: "root-front",
          r0: 0.10,
          r1: 0.028,
          pts: [
            { x: -0.04, y: 0.28, z: 0.16 },
            { x: -0.12, y: 0.10, z: 0.48 },
            { x: -0.22, y: 0.03, z: 0.78 }
          ]
        }
      ],
      branches: [
        {
          name: "branch-low-right",
          r: 0.024,
          pts: [
            { x: 0.20, y: 1.72, z: 0.06 },
            { x: 0.52, y: 1.92, z: 0.14 },
            { x: 0.82, y: 1.84, z: 0.06 }
          ]
        },
        {
          name: "branch-mid-left",
          r: 0.02,
          pts: [
            { x: -0.18, y: 2.28, z: 0.04 },
            { x: -0.52, y: 2.55, z: 0.12 },
            { x: -0.82, y: 2.72, z: 0.04 }
          ]
        },
        {
          name: "branch-high",
          r: 0.016,
          pts: [
            { x: -0.08, y: 2.92, z: 0.02 },
            { x: -0.28, y: 3.12, z: 0.10 },
            { x: -0.42, y: 3.22, z: 0.04 }
          ]
        }
      ]
    };
  }

  function treeCrown() {
    const leaves = [];
    const n = 9;
    let i;
    for (i = 0; i < n; i++) {
      const a = i * 2.15 + hash(i * 3.1) * 0.55;
      const h = 2.55 + hash(i * 2.4) * 0.62;
      const rad = 0.28 + hash(i * 5.1) * 0.42;
      leaves.push({
        x: Math.cos(a) * rad,
        y: h,
        z: Math.sin(a) * rad * 0.62,
        r: 0.10 + hash(i * 7.2) * 0.05,
        spin: hash(i * 4.4) * 6.2,
        tilt: (hash(i * 1.9) - 0.5) * 0.7,
        ink: i % 4 === 0 ? "navy" : "red"
      });
    }
    const tips = tree().branches;
    tips.forEach((br, bi) => {
      const tip = br.pts[br.pts.length - 1];
      leaves.push({
        x: tip.x + 0.04,
        y: tip.y + 0.08,
        z: tip.z,
        r: 0.11,
        spin: 0.4 + bi * 0.7,
        tilt: 0.22,
        ink: "red"
      });
    });
    return leaves;
  }

  function rockHatchPixels(w, h) {
    const data = new Uint8ClampedArray(w * h * 4);
    let i;
    for (i = 0; i < w * h; i++) {
      const n = hash(i * 0.21);
      const k = (n - 0.5) * 5;
      const p = i * 4;
      data[p] = PAPER_RGB[0] + k;
      data[p + 1] = PAPER_RGB[1] + k * 0.8;
      data[p + 2] = PAPER_RGB[2] + k * 0.5;
      data[p + 3] = 255;
    }
    const strokes = Math.floor(w * h / 90);
    let s;
    for (s = 0; s < strokes; s++) {
      if (hash(s * 1.9) < 0.42) continue;
      const x0 = hash(s * 3.3) * w;
      const y0 = hash(s * 7.1) * h;
      const ang = (hash(s * 2.6) - 0.5) * 1.4 + (s % 3 === 0 ? 0.9 : -0.15);
      const len = 8 + hash(s * 4.8) * 22;
      const thick = 0.45 + hash(s * 6.2) * 0.85;
      let t;
      for (t = 0; t < len; t++) {
        const x = Math.floor(x0 + Math.cos(ang) * t);
        const y = Math.floor(y0 + Math.sin(ang) * t);
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        if (hash(s * 11 + t) < 0.12) continue;
        let yy;
        for (yy = -1; yy <= 1; yy++) {
          const y2 = y + yy;
          if (y2 < 0 || y2 >= h) continue;
          const d = Math.abs(yy);
          if (d > thick) continue;
          const press = 0.42 + (1 - d / Math.max(thick, 0.2)) * 0.5;
          const q = (y2 * w + x) * 4;
          data[q] = data[q] * (1 - press) + NAVY_RGB[0] * press;
          data[q + 1] = data[q + 1] * (1 - press) + NAVY_RGB[1] * press;
          data[q + 2] = data[q + 2] * (1 - press) + NAVY_RGB[2] * press;
        }
      }
    }
    return data;
  }

  function rockHatchStats(data, w, h) {
    let ink = 0;
    let paperish = 0;
    let n = 0;
    let i;
    for (i = 0; i < w * h; i += 4) {
      const p = i * 4;
      n += 1;
      if (data[p] < 80 && data[p + 2] < 100) ink += 1;
      if (data[p] > 220 && data[p + 1] > 210 && data[p + 2] > 200) paperish += 1;
    }
    return { ink: ink / n, paperish: paperish / n };
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
      let x;
      for (x = 0; x < w; x++) {
        if (hash(r * 17 + Math.floor((x / w) * 12) * 3.2) < 0.13) continue;
        const y = y0 + Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp;
        const y1 = Math.max(0, Math.floor(y - thick));
        const y2 = Math.min(h - 1, Math.ceil(y + thick));
        let yy;
        for (yy = y1; yy <= y2; yy++) {
          const d = Math.abs(yy - y);
          if (d > thick) continue;
          const a = 1 - d / thick;
          const press = Math.min(1, 0.52 + a * 0.58);
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

  function hatchStats(data, w, h) {
    let redInk = 0;
    let paperish = 0;
    let n = 0;
    let i;
    for (i = 0; i < w * h; i += 3) {
      const p = i * 4;
      n += 1;
      if (data[p] > data[p + 1] + 40 && data[p] > data[p + 2] + 30) redInk += 1;
      if (data[p] > 220 && data[p + 1] > 210 && data[p + 2] > 200) paperish += 1;
    }
    return { redInk: redInk / n, paperish: paperish / n };
  }

  function strokePixels(w, h, rgb) {
    const data = new Uint8ClampedArray(w * h * 4);
    let i;
    for (i = 0; i < w * h; i++) {
      const n = hash(i * 0.19);
      const k = (n - 0.5) * 6;
      const p = i * 4;
      data[p] = PAPER_RGB[0] + k;
      data[p + 1] = PAPER_RGB[1] + k * 0.8;
      data[p + 2] = PAPER_RGB[2] + k * 0.5;
      data[p + 3] = 255;
    }
    const rows = Math.floor(h / 2.6);
    let r;
    for (r = 0; r < rows; r++) {
      if (hash(r * 1.07) < 0.08) continue;
      const y0 = (r + 0.3 + hash(r * 2.8) * 0.4) * (h / rows);
      const thick = 0.7 + hash(r * 7.4) * 1.5;
      const amp = 0.8 + hash(r * 3.3) * 1.8;
      const freq = 1.2 + hash(r * 6.1) * 2.2;
      const phase = hash(r * 8.8) * Math.PI * 2;
      let x;
      for (x = 0; x < w; x++) {
        if (hash(r * 14 + Math.floor(x / 18) * 2.4) < 0.1) continue;
        const y = y0 + Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp;
        const y1 = Math.max(0, Math.floor(y - thick));
        const y2 = Math.min(h - 1, Math.ceil(y + thick));
        let yy;
        for (yy = y1; yy <= y2; yy++) {
          const d = Math.abs(yy - y);
          if (d > thick) continue;
          const a = 1 - d / thick;
          const press = Math.min(1, 0.58 + a * 0.52);
          const q = (yy * w + x) * 4;
          const jitter = hash(r * 4.1 + x * 0.07) * 8 - 4;
          data[q] = data[q] * (1 - press) + (rgb[0] + jitter) * press;
          data[q + 1] = data[q + 1] * (1 - press) + rgb[1] * press;
          data[q + 2] = data[q + 2] * (1 - press) + rgb[2] * press;
        }
      }
    }
    return data;
  }

  function strokeStats(data, w, h, rgb) {
    let ink = 0;
    let paperish = 0;
    let n = 0;
    let i;
    for (i = 0; i < w * h; i += 3) {
      const p = i * 4;
      n += 1;
      const dr = Math.abs(data[p] - rgb[0]);
      const dg = Math.abs(data[p + 1] - rgb[1]);
      const db = Math.abs(data[p + 2] - rgb[2]);
      if (dr + dg + db < 90) ink += 1;
      if (data[p] > 220 && data[p + 1] > 210 && data[p + 2] > 200) paperish += 1;
    }
    return { ink: ink / n, paperish: paperish / n };
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
    const step = -unit * (scale == null ? 0.55 : scale);
    return clamp(dist - step, DIST.min, DIST.max);
  }

  function pinchDist(dist, scale) {
    return clamp(dist / Math.max(0.35, Math.min(2.6, scale)), DIST.min, DIST.max);
  }

  function cameraPos(az, el, dist, target) {
    const t = target || { x: SPAWN.targetX, y: SPAWN.targetY, z: SPAWN.targetZ };
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

  function isGlassWord(src) {
    return /MeshPhysicalMaterial|MeshStandardMaterial|MeshPhongMaterial|transmission|ior\s*[:=]/.test(src);
  }

  return {
    NAVY: NAVY,
    RED: RED,
    PAPER: PAPER,
    FIGURE: FIGURE,
    NAVY_RGB: NAVY_RGB,
    RED_RGB: RED_RGB,
    PAPER_RGB: PAPER_RGB,
    FIGURE_RGB: FIGURE_RGB,
    SPAWN: SPAWN,
    DIST: DIST,
    EL: EL,
    FALL_N: FALL_N,
    RIPPLE_N: RIPPLE_N,
    WATER_Y: WATER_Y,
    clamp: clamp,
    hash: hash,
    lerp: lerp,
    boulder: boulder,
    insideBoulder: insideBoulder,
    outsideBoulder: outsideBoulder,
    strandColor: strandColor,
    rippleColor: rippleColor,
    hairStrand: hairStrand,
    waterStrand: waterStrand,
    waterY: waterY,
    creekPatch: creekPatch,
    fresnelWeight: fresnelWeight,
    waterAlpha: waterAlpha,
    bedStones: bedStones,
    rippleStrand: rippleStrand,
    allStrands: allStrands,
    allRipples: allRipples,
    strandTravel: strandTravel,
    wrapStats: wrapStats,
    reeds: reeds,
    hills: hills,
    woman: woman,
    womanOutline: womanOutline,
    womanTorso: womanTorso,
    womanHips: womanHips,
    womanNeck: womanNeck,
    womanHead: womanHead,
    womanLimbR: womanLimbR,
    womanMass: womanMass,
    FIGURE_DEPTH: FIGURE_DEPTH,
    capsuleProfile: capsuleProfile,
    hairRoot: hairRoot,
    hairAttached: hairAttached,
    waterfall: waterfall,
    waterfallSheets: waterfallSheets,
    waterfallFilaments: waterfallFilaments,
    waterfallPlunge: waterfallPlunge,
    waterMarks: waterMarks,
    rockCracks: rockCracks,
    rockHatchPixels: rockHatchPixels,
    rockHatchStats: rockHatchStats,
    tree: tree,
    treeCrown: treeCrown,
    hatchPixels: hatchPixels,
    hatchStats: hatchStats,
    strokePixels: strokePixels,
    strokeStats: strokeStats,
    applyOrbit: applyOrbit,
    dollyDist: dollyDist,
    pinchDist: pinchDist,
    cameraPos: cameraPos,
    isLawn: isLawn,
    isGlassWord: isGlassWord
  };
});
