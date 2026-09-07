/* Hair and river — cut the pen drawing into depth planes. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CreekLayers = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const ASPECT = 1650 / 2200;
  const BLACK = 8;
  const WHITE = 142;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function smooth(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function gate(x, a0, a1, b0, b1) {
    return smooth(a0, a1, x) * (1 - smooth(b0, b1, x));
  }

  function liftChannel(v) {
    return clamp(((v - BLACK) / (WHITE - BLACK)) * 255, 0, 255);
  }

  function liftColor(r, g, b) {
    return [liftChannel(r), liftChannel(g), liftChannel(b)];
  }

  function lum(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function chroma(r, g, b) {
    return Math.max(r, g, b) - Math.min(r, g, b);
  }

  function inkAlpha(r, g, b) {
    const L = lum(r, g, b);
    const C = chroma(r, g, b);
    const dark = clamp((190 - L) / 70, 0, 1);
    const dye = clamp((C - 14) / 22, 0, 1);
    let a = dark > dye ? dark : dye;
    a *= 1 - clamp((L - 228) / 18, 0, 1);
    return clamp(a, 0, 1);
  }

  function vignetteLift(u, v, r, g, b) {
    const nx = (u - 0.5) * 2;
    const ny = (v - 0.5) * 2;
    const rad = Math.sqrt(nx * nx + ny * ny);
    const vig = clamp((rad - 0.55) / 0.7, 0, 1);
    const paper = clamp((22 - chroma(r, g, b)) / 14, 0, 1);
    const add = vig * paper * 70;
    return [
      clamp(r + add, 0, 255),
      clamp(g + add, 0, 255),
      clamp(b + add, 0, 255)
    ];
  }

  function preparePixel(r, g, b, u, v) {
    const lifted = liftColor(r, g, b);
    return vignetteLift(u, v, lifted[0], lifted[1], lifted[2]);
  }

  function weights(u, v) {
    const trees = Math.pow(1 - smooth(0.15, 0.29, u), 1.2);
    const river = smooth(0.72, 0.84, v) * (1 - trees * 0.35);
    const branch = smooth(0.82, 0.92, v) * smooth(0.58, 0.76, u);
    const hair = gate(u, 0.30, 0.42, 0.64, 0.76) * gate(v, 0.16, 0.28, 0.80, 0.92);
    const woman = gate(u, 0.40, 0.52, 0.88, 0.98) * gate(v, 0.06, 0.16, 0.50, 0.62);
    const hills = gate(u, 0.20, 0.34, 0.92, 1.02) * (1 - smooth(0.34, 0.48, v)) * smooth(0.0, 0.10, v);
    const mountains = (1 - smooth(0.24, 0.40, v)) * smooth(0.30, 0.48, u);
    return {
      mountains: mountains,
      hills: hills,
      woman: woman,
      hair: hair,
      trees: trees,
      river: river > branch ? river : branch
    };
  }

  const ORDER = ["mountains", "hills", "woman", "hair", "trees", "river"];

  function exclusive(w) {
    let max = 0;
    let i;
    for (i = 0; i < ORDER.length; i++) {
      if (w[ORDER[i]] > max) max = w[ORDER[i]];
    }
    const out = {};
    for (i = 0; i < ORDER.length; i++) {
      const k = ORDER[i];
      const v = w[k];
      out[k] = max < 0.04 ? 0 : clamp(v / max, 0, 1) * (v > 0.035 ? 1 : 0);
    }
    return out;
  }

  function cutCanvases(img) {
    const w = img.width;
    const h = img.height;
    const src = document.createElement("canvas");
    src.width = w;
    src.height = h;
    const sctx = src.getContext("2d");
    sctx.drawImage(img, 0, 0);
    const pix = sctx.getImageData(0, 0, w, h).data;
    const out = {};
    const ctxs = {};
    let i;
    for (i = 0; i < ORDER.length; i++) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      out[ORDER[i]] = c;
      ctxs[ORDER[i]] = c.getContext("2d");
    }
    const buffers = {};
    for (i = 0; i < ORDER.length; i++) {
      buffers[ORDER[i]] = ctxs[ORDER[i]].createImageData(w, h);
    }
    const n = w * h;
    for (i = 0; i < n; i++) {
      const p = i * 4;
      const x = i % w;
      const y = (i / w) | 0;
      const u = w < 2 ? 0 : x / (w - 1);
      const v = h < 2 ? 0 : y / (h - 1);
      const prep = preparePixel(pix[p], pix[p + 1], pix[p + 2], u, v);
      const a = inkAlpha(prep[0], prep[1], prep[2]);
      if (a < 0.04) continue;
      const ex = exclusive(weights(u, v));
      let k;
      for (k = 0; k < ORDER.length; k++) {
        const name = ORDER[k];
        const wa = a * ex[name];
        if (wa < 0.04) continue;
        const d = buffers[name].data;
        d[p] = prep[0];
        d[p + 1] = prep[1];
        d[p + 2] = prep[2];
        d[p + 3] = Math.round(wa * 255);
      }
    }
    for (i = 0; i < ORDER.length; i++) {
      ctxs[ORDER[i]].putImageData(buffers[ORDER[i]], 0, 0);
    }
    return out;
  }

  return {
    ASPECT: ASPECT,
    ORDER: ORDER,
    clamp: clamp,
    smooth: smooth,
    gate: gate,
    liftColor: liftColor,
    inkAlpha: inkAlpha,
    preparePixel: preparePixel,
    weights: weights,
    exclusive: exclusive,
    cutCanvases: cutCanvases
  };
});
