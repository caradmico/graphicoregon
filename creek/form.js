/* Hair and river — 3D layout taken from the pen drawing. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CreekForm = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const INK = 0x1a2744;
  const RED = 0xa3262b;
  const PAPER = 0xf4efe6;
  const HATCH = 0x24324c;

  const SPAWN = { x: 0.7, y: 1.7, z: 5.6, yaw: 0.1, pitch: 0.16 };
  const BOULDER = { x: 0.15, y: 1.12, z: -7.4 };
  const HEAD = { x: 0.63, y: 2.28, z: -6.72 };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mix(a, b, t) {
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
  }

  function offset(i, n, span) {
    return (i / Math.max(1, n - 1) - 0.5) * span;
  }

  function hairFallOnly(i, n) {
    const s = offset(i, n, 0.72);
    const t = offset(i, n, 0.34);
    return [
      { x: HEAD.x + s * 0.12, y: HEAD.y + 0.08, z: HEAD.z + t * 0.08 },
      { x: HEAD.x - 0.12 + s * 0.18, y: HEAD.y - 0.12, z: HEAD.z + 0.28 + t * 0.1 },
      { x: 0.58 + s * 0.22, y: 1.85, z: -6.15 + t * 0.12 },
      { x: 0.38 + s * 0.28, y: 1.28, z: -5.85 + t * 0.14 },
      { x: 0.2 + s * 0.3, y: 0.72, z: -5.55 + t * 0.16 },
      { x: 0.02 + s * 0.34, y: 0.16, z: -5.2 + t * 0.18 }
    ];
  }

  function creekStrand(i, n) {
    const s = offset(i, n, 0.95);
    return [
      { x: 0.02 + s * 0.32, y: 0.13, z: -5.2 },
      { x: -0.85 + s * 0.5, y: 0.07, z: -3.35 },
      { x: -1.7 + s * 0.7, y: 0.05, z: -1.35 },
      { x: -2.15 + s * 0.75, y: 0.04, z: 0.85 },
      { x: -2.35 + s * 0.65, y: 0.03, z: 2.55 }
    ];
  }

  function hairStrand(i, n) {
    return hairFallOnly(i, n).concat(creekStrand(i, n).slice(1));
  }

  function treeSpec() {
    return {
      thick: { x: -3.15, z: -1.6, h: 6.4, r: 0.46 },
      slim: [
        { x: -2.15, z: -3.8, h: 5.8, r: 0.12 },
        { x: -1.55, z: -5.1, h: 5.2, r: 0.1 }
      ],
      red: { x: 1.55, z: -11.2, h: 3.8, r: 0.09 }
    };
  }

  function hillSpecs() {
    return [
      { x: 3.6, z: -22, w: 7.2, h: 4.6, d: 1.4 },
      { x: 6.4, z: -24.5, w: 5.4, h: 3.4, d: 1.1 },
      { x: -1.2, z: -23.5, w: 6.0, h: 3.0, d: 1.2 },
      { x: 1.8, z: -26, w: 8.5, h: 5.2, d: 1.6 }
    ];
  }

  function strandDrops(pts) {
    let drop = 0;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].y < pts[i - 1].y) drop += pts[i - 1].y - pts[i].y;
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    return {
      drop: drop,
      flattens: last.y < 0.2 && first.y > 1.5,
      towardViewer: last.z > first.z,
      leftward: last.x < first.x
    };
  }

  return {
    INK: INK,
    RED: RED,
    PAPER: PAPER,
    HATCH: HATCH,
    SPAWN: SPAWN,
    BOULDER: BOULDER,
    HEAD: HEAD,
    lerp: lerp,
    mix: mix,
    hairStrand: hairStrand,
    hairFallOnly: hairFallOnly,
    creekStrand: creekStrand,
    treeSpec: treeSpec,
    hillSpecs: hillSpecs,
    strandDrops: strandDrops
  };
});
