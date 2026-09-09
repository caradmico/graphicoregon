/* Graphic Oregon — Hair and river as pen marks: hair is the fall. */
(function () {
  const Ink = window.WaterInk;
  const PIXEL_RATIO = 1.25;
  const ART = [
    "../assets/hair-and-river.jpg",
    "../../assets/art/20201206_134759.jpg",
    "https://caradmico.github.io/graphicoregon/assets/art/20201206_134759.jpg"
  ];

  let THREE, scene, camera, renderer, clock;
  let az = Ink.SPAWN.az;
  let el = Ink.SPAWN.el;
  let dist = Ink.SPAWN.dist;
  const target = { x: Ink.SPAWN.targetX, y: Ink.SPAWN.targetY, z: Ink.SPAWN.targetZ };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pinch0 = 0;
  let dist0 = dist;
  const names = [];
  const flowMats = [];
  const waterMats = [];

  function hasThree(root) {
    const T = root || window.THREE;
    return !!(T && typeof T.Scene === "function" && typeof T.WebGLRenderer === "function" && T.TubeGeometry && T.ShaderMaterial);
  }

  function fail(msg) {
    const loader = document.getElementById("loader");
    const p = document.getElementById("loader-msg");
    if (loader) loader.classList.add("error");
    if (p) p.textContent = msg;
    if (loader) loader.hidden = false;
  }

  function hideLoader() {
    const node = document.getElementById("loader");
    if (node) node.hidden = true;
  }

  function showStage() {
    const node = document.getElementById("stage");
    if (node) node.classList.add("ready");
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(src);
      s.onerror = () => reject(new Error("script: " + src));
      document.head.appendChild(s);
    });
  }

  async function ensureThree() {
    if (hasThree()) return window.THREE;
    const srcs = [
      "../vendor/three.min.js",
      "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js",
      "https://unpkg.com/three@0.159.0/build/three.min.js"
    ];
    let last;
    for (let i = 0; i < srcs.length; i++) {
      try {
        await loadScript(srcs[i]);
        if (hasThree()) return window.THREE;
      } catch (err) {
        last = err;
      }
    }
    throw last || new Error("Three.js did not load on this phone.");
  }

  function strokeTexture(rgb) {
    const w = 256;
    const h = 64;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(w, h);
    img.data.set(Ink.strokePixels(w, h, rgb));
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.4, 1);
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function inkStrandMat(kind) {
    const rgb = kind === "red" ? Ink.RED_RGB : Ink.NAVY_RGB;
    const tex = strokeTexture(rgb);
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uStroke: { value: tex },
        uInk: { value: new THREE.Color(kind === "red" ? Ink.RED : Ink.NAVY) },
        uPaper: { value: new THREE.Color(Ink.PAPER) },
        uTime: { value: 0 }
      },
      vertexShader: [
        "varying vec2 vUv;",
        "varying vec3 vWorld;",
        "uniform float uTime;",
        "void main() {",
        "  vUv = uv;",
        "  vec3 pos = position;",
          "  float tail = smoothstep(0.42, 0.58, uv.x);",
          "  pos.y += sin(position.z * 3.1 + uTime * 1.55 + uv.x * 7.0) * 0.016 * tail;",
        "  vec4 wp = modelMatrix * vec4(pos, 1.0);",
        "  vWorld = wp.xyz;",
        "  gl_Position = projectionMatrix * viewMatrix * wp;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec2 vUv;",
        "uniform sampler2D uStroke;",
        "uniform vec3 uInk;",
        "uniform vec3 uPaper;",
        "uniform float uTime;",
        "float hash(vec2 p) {",
        "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);",
        "}",
        "void main() {",
        "  vec2 suv = vec2(vUv.x * 3.6 - uTime * 0.16, vUv.y);",
        "  vec3 stroke = texture2D(uStroke, suv).rgb;",
        "  float press = 0.72 + 0.22 * sin(vUv.x * 34.0 - uTime * 2.4);",
        "  float skip = step(0.16, hash(vec2(floor(vUv.x * 56.0), floor(vUv.y * 5.0))));",
        "  float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);",
        "  float mark = skip * press * edge;",
        "  if (mark < 0.12) discard;",
        "  vec3 c = mix(uPaper, uInk, mark);",
        "  c = mix(c, stroke, 0.22);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
    flowMats.push(mat);
    return mat;
  }

  function inflate(geo, amt) {
    const g = geo.clone();
    if (!g.attributes.normal) g.computeVertexNormals();
    const pos = g.attributes.position;
    const nrm = g.attributes.normal;
    const k = amt == null ? 0.022 : amt;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(
        i,
        pos.getX(i) + nrm.getX(i) * k,
        pos.getY(i) + nrm.getY(i) * k,
        pos.getZ(i) + nrm.getZ(i) * k
      );
    }
    pos.needsUpdate = true;
    return g;
  }

  function rumple(geo, amt) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = (Math.sin(x * 2.8 + z * 2.2 + y * 1.4) * 0.5 + 0.5) * amt;
      const len = Math.hypot(x, y, z) || 1;
      pos.setXYZ(i, x + (x / len) * n, y + (y / len) * n * 0.55, z + (z / len) * n);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function rumpleXZ(geo, amt) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const wobble = Math.sin(y * 2.35 + a * 3.1) * amt + Math.sin(y * 5.2 - a * 2.2) * amt * 0.5;
      const r = Math.hypot(x, z);
      if (r < 1e-5) continue;
      const nr = r + wobble;
      pos.setXYZ(i, x * (nr / r), y, z * (nr / r));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function addNamed(obj, name) {
    obj.name = name;
    names.push(name);
    scene.add(obj);
    return obj;
  }

  function tubeFrom(pts, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 5, false), mat);
  }

  function paperFloor() {
    const w = 256;
    const h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(26,39,68,0.06)";
    ctx.lineWidth = 1;
    for (let i = -32; i < 320; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 36, h);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(14, 14);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 48),
      new THREE.MeshBasicMaterial({ map: tex, color: Ink.PAPER })
    );
    floor.rotation.x = -Math.PI / 2;
    addNamed(floor, "ground");
  }

  function rockHatchTexture() {
    const w = 256;
    const h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(w, h);
    img.data.set(Ink.rockHatchPixels(w, h));
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.6, 1.4);
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function rockMat() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uHatch: { value: rockHatchTexture() },
        uPaper: { value: new THREE.Color(Ink.PAPER) },
        uNavy: { value: new THREE.Color(Ink.NAVY) }
      },
      vertexShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "varying vec2 vUv;",
        "void main() {",
        "  vUv = uv;",
        "  vNormal = normalize(mat3(modelMatrix) * normal);",
        "  vec4 wp = modelMatrix * vec4(position, 1.0);",
        "  vWorld = wp.xyz;",
        "  gl_Position = projectionMatrix * viewMatrix * wp;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "varying vec2 vUv;",
        "uniform sampler2D uHatch;",
        "uniform vec3 uPaper;",
        "uniform vec3 uNavy;",
        "void main() {",
        "  vec3 N = normalize(vNormal);",
          "  float face = smoothstep(0.22, 0.58, N.z);",
        "  vec3 hatch = texture2D(uHatch, vUv * vec2(1.8, 1.5)).rgb;",
        "  vec3 c = mix(uPaper, hatch, face * 0.38);",
        "  float rim = pow(1.0 - max(dot(N, normalize(cameraPosition - vWorld)), 0.0), 3.6);",
        "  c = mix(c, uNavy, rim * 0.12);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
  }

  function buildBoulder() {
    const spec = Ink.boulder();
    const geo = rumple(new THREE.IcosahedronGeometry(1, 1), 0.18);
    geo.scale(spec.rx, spec.ry, spec.rz);
    const rock = new THREE.Group();
    rock.add(new THREE.Mesh(geo, rockMat()));
    rock.add(new THREE.Mesh(
      inflate(geo, 0.016),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    rock.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 26),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.55 })
    ));
    const crackMat = new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.78 });
    Ink.rockCracks().forEach((pts) => {
      const draped = pts.map((p) => Ink.outsideBoulder({
        x: spec.x + p.x,
        y: p.y,
        z: spec.z + p.z
      }, 0.014));
      const geoLine = new THREE.BufferGeometry().setFromPoints(
        draped.map((p) => new THREE.Vector3(p.x - spec.x, p.y - spec.y, p.z - spec.z))
      );
      rock.add(new THREE.Line(geoLine, crackMat));
    });
    rock.position.set(spec.x, spec.y, spec.z);
    addNamed(rock, "boulder");
  }

  /* Previous "water" tubes — these are hair, now grown from her head. */
  function buildHair() {
    const g = new THREE.Group();
    const red = inkStrandMat("red");
    const navy = inkStrandMat("navy");
    Ink.allStrands().forEach((pts, i) => {
      const kind = Ink.strandColor(i);
      const rad = 0.007 + (i % 5) * 0.0024;
      g.add(tubeFrom(pts, rad, kind === "red" ? red : navy));
    });
    Ink.allRipples().forEach((pts, i) => {
      const kind = Ink.rippleColor(i);
      g.add(tubeFrom(pts, 0.004 + (i % 3) * 0.0012, kind === "red" ? red : navy));
    });
    addNamed(g, "hair");
  }

  function stoneMesh(spec) {
    const geo = rumple(new THREE.IcosahedronGeometry(1, 0), 0.14);
    geo.scale(spec.rx, spec.ry, spec.rz);
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: Ink.PAPER })));
    g.add(new THREE.Mesh(
      inflate(geo, 0.012),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    g.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 28),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.5 })
    ));
    g.position.set(spec.x, spec.y, spec.z);
    return g;
  }

  function buildCreekBed() {
    const patch = Ink.creekPatch();
    const g = new THREE.Group();
    const bed = new THREE.Mesh(
      new THREE.PlaneGeometry(patch.w * 0.9, patch.d * 0.86),
      new THREE.MeshBasicMaterial({ color: Ink.PAPER })
    );
    bed.rotation.x = -Math.PI / 2;
    bed.position.set(patch.x, 0.006, patch.z);
    g.add(bed);
    Ink.bedStones().forEach((s) => g.add(stoneMesh(s)));
    const b = Ink.boulder();
    const ringPts = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const p = Ink.outsideBoulder({
        x: b.x + Math.cos(a) * b.rx,
        y: Ink.waterY(),
        z: b.z + Math.sin(a) * b.rz
      }, 0.02);
      ringPts.push(new THREE.Vector3(p.x, Ink.waterY() - 0.004, p.z));
    }
    g.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ringPts),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.38 })
    ));
    addNamed(g, "creek-bed");
  }

  function waterMat() {
    const b = Ink.boulder();
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPaper: { value: new THREE.Color(Ink.PAPER) },
        uNavy: { value: new THREE.Color(Ink.NAVY) },
        uBoulder: { value: new THREE.Vector3(b.x, b.y, b.z) },
        uBoulderR: { value: new THREE.Vector3(b.rx, b.ry, b.rz) }
      },
      vertexShader: [
        "varying vec3 vWorld;",
        "varying vec3 vNormal;",
        "varying vec2 vUv;",
        "uniform float uTime;",
        "void main() {",
        "  vUv = uv;",
        "  vec3 pos = position;",
        "  pos.y += sin(pos.x * 1.4 + pos.z * 1.1 + uTime * 0.35) * 0.0012;",
        "  vNormal = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0));",
        "  vec4 wp = modelMatrix * vec4(pos, 1.0);",
        "  vWorld = wp.xyz;",
        "  gl_Position = projectionMatrix * viewMatrix * wp;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vWorld;",
        "varying vec3 vNormal;",
        "varying vec2 vUv;",
        "uniform vec3 uPaper;",
        "uniform vec3 uNavy;",
        "uniform vec3 uBoulder;",
        "uniform vec3 uBoulderR;",
        "uniform float uTime;",
        "float hash(vec2 p) {",
        "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);",
        "}",
        "void main() {",
        "  vec3 q = (vWorld - uBoulder) / uBoulderR;",
        "  float rock = smoothstep(1.02, 1.16, dot(q, q));",
        "  if (rock < 0.01) discard;",
        "  vec3 N = normalize(vNormal);",
        "  vec3 V = normalize(cameraPosition - vWorld);",
        "  float ndotv = clamp(dot(N, V), 0.0, 1.0);",
        "  float fresnel = pow(1.0 - ndotv, 2.4);",
        "  float wavy = vWorld.z * 3.4 + sin(vWorld.x * 1.15 + uTime * 0.16) * 0.7;",
        "  float w1 = sin(wavy - uTime * 0.12);",
        "  float w2 = sin(vWorld.z * 5.1 + sin(vWorld.x * 1.8) * 0.45 - uTime * 0.08);",
        "  float line = smoothstep(0.965, 0.995, abs(w1)) + smoothstep(0.982, 0.998, abs(w2)) * 0.45;",
        "  float skip = step(0.38, hash(vec2(floor(vWorld.z * 1.35), floor(vWorld.x * 0.28))));",
        "  float mark = line * skip;",
        "  vec3 col = mix(uPaper, uNavy, 0.78);",
        "  float edge = smoothstep(0.0, 0.07, vUv.x) * smoothstep(1.0, 0.93, vUv.x);",
        "  edge *= smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.88, vUv.y);",
        "  float alpha = mark * 0.62 + fresnel * 0.03;",
        "  alpha *= edge * rock;",
        "  if (alpha < 0.03) discard;",
        "  gl_FragColor = vec4(col, alpha);",
        "}"
      ].join("\n")
    });
    waterMats.push(mat);
    return mat;
  }

  function buildWater() {
    const patch = Ink.creekPatch();
    const geo = new THREE.PlaneGeometry(patch.w, patch.d, 48, 36);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, waterMat());
    mesh.position.set(patch.x, Ink.waterY(), patch.z);
    addNamed(mesh, "water");
    Ink.waterMarks().forEach((mark) => {
      const color = mark.ink === "red" ? Ink.RED : Ink.NAVY;
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          mark.pts.map((p) => new THREE.Vector3(p.x, p.y, p.z))
        ),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.42 })
      ));
    });
  }

  function buildReeds() {
    const mat = new THREE.MeshBasicMaterial({ color: Ink.NAVY });
    Ink.reeds().forEach((r, i) => {
      const geo = tubeFrom([
        { x: r.x, y: 0, z: r.z },
        { x: r.x + 0.02, y: r.h * 0.48, z: r.z + 0.01 },
        { x: r.x - 0.03, y: r.h, z: r.z }
      ], 0.008, mat);
      addNamed(geo, "reed-" + i);
    });
  }

  function hillRidge(h, i) {
    const peaks = i === 0
      ? [[0, 0], [0.18, 0.42], [0.34, 1.0], [0.48, 0.52], [0.68, 0.82], [0.86, 0.28], [1, 0]]
      : [[0, 0], [0.22, 0.55], [0.40, 0.92], [0.58, 0.38], [0.78, 0.70], [1, 0]];
    return peaks.map((p) => new THREE.Vector3(-h.w / 2 + p[0] * h.w, p[1] * h.h, 0));
  }

  function buildHills() {
    const line = new THREE.LineBasicMaterial({ color: Ink.NAVY });
    const hatch = new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.35 });
    Ink.hills().forEach((h, i) => {
      const g = new THREE.Group();
      const pts = hillRidge(h, i);
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), line));
      if (i === 0) {
        const shade = [];
        for (let s = 0; s < 7; s++) {
          const t = 0.28 + s * 0.04;
          shade.push(new THREE.Vector3(
            -h.w / 2 + t * h.w,
            (0.72 - s * 0.07) * h.h,
            0.01
          ));
        }
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(shade), hatch));
      }
      g.position.set(h.x, 0, h.z);
      addNamed(g, "hill-" + i);
    });
  }

  function inkVolume(geo, fill, outlineAmt) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: fill == null ? Ink.PAPER : fill })));
    g.add(new THREE.Mesh(
      inflate(geo, outlineAmt == null ? 0.012 : outlineAmt),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    g.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 18),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.78 })
    ));
    return g;
  }

  /* Paper-warm fill + sparse hatch + navy rim. No edge cage — that read as sticks. */
  let figureShared;
  function figureMat() {
    if (figureShared) return figureShared;
    figureShared = new THREE.ShaderMaterial({
      uniforms: {
        uFigure: { value: new THREE.Color(Ink.FIGURE) },
        uNavy: { value: new THREE.Color(Ink.NAVY) }
      },
      vertexShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "void main() {",
        "  vNormal = normalize(mat3(modelMatrix) * normal);",
        "  vec4 wp = modelMatrix * vec4(position, 1.0);",
        "  vWorld = wp.xyz;",
        "  gl_Position = projectionMatrix * viewMatrix * wp;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "uniform vec3 uFigure;",
        "uniform vec3 uNavy;",
        "void main() {",
        "  vec3 N = normalize(vNormal);",
        "  vec3 V = normalize(cameraPosition - vWorld);",
        "  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);",
        "  float hatch = abs(sin(vWorld.y * 16.0 + vWorld.x * 3.4 + vWorld.z * 2.2));",
        "  float mark = smoothstep(0.86, 0.98, hatch) * 0.28;",
        "  vec3 c = mix(uFigure, uNavy, mark + rim * 0.42);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
    return figureShared;
  }

  function figureVolume(geo, outlineAmt) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, figureMat()));
    g.add(new THREE.Mesh(
      inflate(geo, outlineAmt == null ? 0.008 : outlineAmt),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    return g;
  }

  function latheFrom(profile, segs) {
    return new THREE.LatheGeometry(
      profile.map((p) => new THREE.Vector2(p[0], p[1])),
      segs || 9
    );
  }

  function capsuleGeo(r, len) {
    return latheFrom(Ink.capsuleProfile(r, len), 14);
  }

  function aimBone(group, from, to) {
    const dir = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z);
    if (dir.lengthSq() < 1e-8) return;
    dir.normalize();
    group.position.set(from.x, from.y, from.z);
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }

  function limbBetween(from, to, rx) {
    const len = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
    const geo = capsuleGeo(rx, Math.max(0.10, len));
    geo.scale(1, 1, Ink.FIGURE_DEPTH);
    const g = figureVolume(geo, 0.007);
    aimBone(g, from, to);
    return g;
  }

  function strokeLine(pts, radius) {
    return tubeFrom(pts, radius == null ? 0.005 : radius, new THREE.MeshBasicMaterial({ color: Ink.NAVY }));
  }

  function buildWoman() {
    const w = Ink.woman();
    const ink = Ink.womanOutline();
    const r = Ink.womanLimbR();
    const g = new THREE.Group();

    const hipGeo = latheFrom(Ink.womanHips(), 16);
    hipGeo.scale(1.12, 0.96, Ink.FIGURE_DEPTH);
    const hips = figureVolume(hipGeo, 0.010);
    hips.position.set(w.hip.x + 0.02, w.hip.y - 0.05, w.hip.z);
    hips.rotation.z = -0.78;
    hips.rotation.x = 0.28;
    hips.rotation.y = 0.22;

    const torsoGeo = latheFrom(Ink.womanTorso(), 16);
    torsoGeo.scale(1.08, 1.0, Ink.FIGURE_DEPTH);
    const torso = figureVolume(torsoGeo, 0.010);
    aimBone(torso, w.hip, w.chest);
    torso.rotation.z -= 0.38;
    torso.rotation.x += 0.10;

    const hatch = [];
    for (let i = 0; i < 5; i++) {
      hatch.push(new THREE.Vector3(-0.06, 0.12 + i * 0.08, 0.10));
      hatch.push(new THREE.Vector3(0.07, 0.16 + i * 0.08, 0.07));
    }
    torso.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(hatch),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.32 })
    ));

    const neckGeo = latheFrom(Ink.womanNeck(), 12);
    neckGeo.scale(1, 1, Ink.FIGURE_DEPTH);
    const neck = figureVolume(neckGeo, 0.006);
    aimBone(neck, w.chest, w.head);

    const headGeo = latheFrom(Ink.womanHead(), 16);
    headGeo.scale(1.04, 1.06, 0.90);
    const head = figureVolume(headGeo, 0.008);
    head.position.set(w.head.x - 0.02, w.head.y - 0.06, w.head.z);
    head.rotation.x = 0.82;
    head.rotation.z = -0.48;
    head.rotation.y = 0.42;

    const tearGeo = latheFrom(Ink.capsuleProfile(0.007, 0.022), 6);
    const tear = new THREE.Mesh(tearGeo, new THREE.MeshBasicMaterial({ color: Ink.NAVY }));
    tear.position.set(w.tear.x, w.tear.y, w.tear.z);
    g.add(tear);

    const shL = limbBetween(w.chest, w.shoulderL, r.upperArm * 0.9);
    const shR = limbBetween(w.chest, w.shoulderR, r.upperArm * 0.85);
    const dipUpper = limbBetween(w.shoulderL, w.elbowDip, r.upperArm);
    const dipFore = limbBetween(w.elbowDip, w.handDip, r.forearm);
    const restUpper = limbBetween(w.shoulderR, w.elbowRest, r.upperArm * 0.94);
    const restFore = limbBetween(w.elbowRest, w.handRest, r.forearm * 0.92);
    const thighL = limbBetween(w.hip, w.kneeL, r.thigh);
    const thighR = limbBetween(w.hip, w.kneeR, r.thigh * 0.94);
    const shinL = limbBetween(w.kneeL, w.footL, r.shin);
    const shinR = limbBetween(w.kneeR, w.footR, r.shin);

    const hand = figureVolume(capsuleGeo(r.hand, 0.09), 0.006);
    hand.position.set(w.handDip.x, w.handDip.y, w.handDip.z);
    hand.rotation.x = 0.55;
    hand.name = "hand-dip";

    g.add(strokeLine(ink.head, 0.006));
    g.add(strokeLine(ink.spine, 0.005));

    const splash = [];
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * Math.PI * 1.1 - 0.25;
      splash.push(new THREE.Vector3(
        w.handDip.x + Math.cos(a) * 0.12,
        Ink.waterY() + 0.002,
        w.handDip.z + Math.sin(a) * 0.08
      ));
    }
    g.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(splash),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.38 })
    ));

    g.add(hips, torso, neck, head, shL, shR, dipUpper, dipFore, restUpper, restFore, thighL, thighR, shinL, shinR, hand);
    addNamed(g, "woman");
  }

  /* Hair cascade is the fall. No second grey sheet beside the rock. */

  function hatchTexture() {
    const w = 256;
    const h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(w, h);
    img.data.set(Ink.hatchPixels(w, h));
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 2.2);
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function barkMat() {
    const tex = hatchTexture();
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uHatch: { value: tex },
        uNavy: { value: new THREE.Color(Ink.NAVY) }
      },
      vertexShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "varying vec2 vUv;",
        "void main() {",
        "  vUv = uv;",
        "  vNormal = normalize(normalMatrix * normal);",
        "  vec4 wp = modelMatrix * vec4(position, 1.0);",
        "  vWorld = wp.xyz;",
        "  gl_Position = projectionMatrix * viewMatrix * wp;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vNormal;",
        "varying vec3 vWorld;",
        "varying vec2 vUv;",
        "uniform sampler2D uHatch;",
        "uniform vec3 uNavy;",
        "float hash(vec2 p) {",
        "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);",
        "}",
        "void main() {",
        "  vec3 N = normalize(vNormal);",
        "  vec3 V = normalize(cameraPosition - vWorld);",
        "  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.2);",
        "  vec3 hatch = texture2D(uHatch, vUv * vec2(1.0, 2.4)).rgb;",
        "  float col = vUv.x * 42.0;",
        "  float skip = step(0.16, hash(vec2(floor(col), 3.7)));",
        "  float navyLine = (1.0 - smoothstep(0.0, 0.2, abs(fract(col) - 0.5))) * skip;",
        "  vec3 c = hatch;",
        "  c = mix(c, uNavy, navyLine * 0.55);",
        "  c = mix(c, uNavy, rim * 0.68);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
  }

  function horn(r0, r1, len) {
    return new THREE.LatheGeometry([
      new THREE.Vector2(r0, 0),
      new THREE.Vector2(r0 * 0.92, len * 0.22),
      new THREE.Vector2((r0 + r1) * 0.48, len * 0.55),
      new THREE.Vector2(r1 * 1.15, len * 0.84),
      new THREE.Vector2(r1, len)
    ], 14);
  }

  function starLeaf(spec) {
    const color = spec.ink === "navy" ? Ink.NAVY : Ink.RED;
    const g = new THREE.Group();
    const star = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? spec.r : spec.r * 0.38;
      star.push(new THREE.Vector3(Math.cos(a) * rad, Math.sin(a) * rad, 0));
    }
    g.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(star),
      new THREE.LineBasicMaterial({ color: color })
    ));
    const faint = new THREE.CircleGeometry(spec.r * 0.42, 5);
    g.add(new THREE.Mesh(faint, new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    })));
    g.position.set(spec.x, spec.y, spec.z);
    g.rotation.y = spec.spin;
    g.rotation.x = spec.tilt || 0.15;
    return g;
  }

  function buildTree() {
    const spec = Ink.tree();
    const bark = barkMat();
    const profile = spec.profile.map((p) => new THREE.Vector2(p[0], p[1]));
    const trunkGeo = rumpleXZ(new THREE.LatheGeometry(profile, 22), 0.036);
    const g = new THREE.Group();
    const trunk = new THREE.Group();
    trunk.add(new THREE.Mesh(trunkGeo, bark));
    trunk.add(new THREE.Mesh(
      inflate(trunkGeo, 0.018),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    trunk.rotation.z = spec.lean;
    g.add(trunk);

    spec.roots.forEach((root) => {
      const last = root.pts.length - 1;
      for (let i = 0; i < last; i++) {
        const a = root.pts[i];
        const b = root.pts[i + 1];
        const t0 = i / last;
        const t1 = (i + 1) / last;
        const rA = root.r0 + (root.r1 - root.r0) * t0;
        const rB = root.r0 + (root.r1 - root.r0) * t1;
        const len = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
        const piece = inkVolume(horn(rA, rB, len), Ink.RED, 0.012);
        piece.children[0].material = bark;
        const dir = new THREE.Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
        if (dir.lengthSq() > 1e-8) {
          piece.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        }
        piece.position.set(a.x, a.y, a.z);
        g.add(piece);
      }
    });

    const twig = new THREE.MeshBasicMaterial({ color: Ink.NAVY });
    spec.branches.forEach((br) => {
      g.add(tubeFrom(br.pts, br.r, twig));
    });

    const crown = new THREE.Group();
    Ink.treeCrown().forEach((leaf) => crown.add(starLeaf(leaf)));
    crown.name = "crown";
    names.push("crown");
    g.add(crown);

    g.position.set(spec.x, 0, spec.z);
    addNamed(g, "tree");
  }

  function applyCamera() {
    const p = Ink.cameraPos(az, el, dist, target);
    camera.position.set(p.x, p.y, p.z);
    camera.lookAt(target.x, target.y, target.z);
  }

  function resetView() {
    az = Ink.SPAWN.az;
    el = Ink.SPAWN.el;
    dist = Ink.SPAWN.dist;
  }

  function bindInput() {
    const elCanvas = renderer.domElement;
    elCanvas.tabIndex = 0;
    try { elCanvas.focus({ preventScroll: true }); } catch (err) { elCanvas.focus(); }

    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      dist = Ink.dollyDist(dist, e.deltaY, e.deltaMode, 0.55);
    }, { passive: false });

    elCanvas.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      elCanvas.classList.add("drag");
      try { elCanvas.setPointerCapture(e.pointerId); } catch (err) { /* older webkit */ }
    });
    function onLook(e) {
      if (!dragging) return;
      const next = Ink.applyOrbit(az, el, e.clientX - lastX, e.clientY - lastY);
      az = next.az;
      el = next.el;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    elCanvas.addEventListener("pointermove", onLook);
    window.addEventListener("pointermove", onLook);
    const endLook = () => {
      dragging = false;
      elCanvas.classList.remove("drag");
    };
    elCanvas.addEventListener("pointerup", endLook);
    elCanvas.addEventListener("pointercancel", endLook);

    elCanvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        dragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinch0 = Math.hypot(dx, dy);
        dist0 = dist;
      }
    }, { passive: false });
    elCanvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinch0 > 1) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        dist = Ink.pinchDist(dist0, Math.hypot(dx, dy) / pinch0);
      }
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyH") resetView();
      if (e.code === "KeyW" || e.code === "ArrowUp") dist = Ink.clamp(dist - 0.28, Ink.DIST.min, Ink.DIST.max);
      if (e.code === "KeyS" || e.code === "ArrowDown") dist = Ink.clamp(dist + 0.28, Ink.DIST.min, Ink.DIST.max);
      if (e.code === "ArrowLeft") az -= 0.08;
      if (e.code === "ArrowRight") az += 0.08;
    }, true);
  }

  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    for (let i = 0; i < flowMats.length; i++) flowMats[i].uniforms.uTime.value = t;
    for (let i = 0; i < waterMats.length; i++) waterMats[i].uniforms.uTime.value = t;
    applyCamera();
    renderer.render(scene, camera);
  }

  function fit() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
    renderer.setSize(innerWidth, innerHeight);
  }

  function buildWorld() {
    paperFloor();
    buildHills();
    buildTree();
    buildCreekBed();
    buildBoulder();
    buildWoman();
    buildWater();
    buildHair();
    buildReeds();
  }

  async function main() {
    if (!Ink) throw new Error("Water ink math did not load.");
    THREE = await ensureThree();
    if (!hasThree(THREE)) throw new Error("Three.js loaded without Scene. Cannot open the creek.");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(Ink.PAPER);
    camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.08, 80);
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("stage"),
      antialias: true,
      alpha: false
    });
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    fit();
    clock = new THREE.Clock();
    buildWorld();
    applyCamera();
    bindInput();
    window.addEventListener("resize", fit);
    renderer.render(scene, camera);
    hideLoader();
    showStage();
    tick();
  }

  window.__waterStudy = {
    getOrbit: () => ({ az: az, el: el, dist: dist, targetY: target.y }),
    spawn: Object.assign({}, Ink.SPAWN),
    pixelRatio: () => renderer ? renderer.getPixelRatio() : 0,
    names: () => names.slice(),
    hasBoulder: () => names.indexOf("boulder") !== -1,
    hasHair: () => names.indexOf("hair") !== -1,
    hasWater: () => names.indexOf("water") !== -1,
    hasBed: () => names.indexOf("creek-bed") !== -1,
    hasWoman: () => names.indexOf("woman") !== -1,
    hasWaterfall: () => names.indexOf("hair") !== -1,
    hasTree: () => names.indexOf("tree") !== -1,
    hasCrown: () => names.indexOf("crown") !== -1,
    waterClear: () => {
      const w = scene && scene.getObjectByName("water");
      return !!(w && w.material && w.material.transparent && w.material.depthWrite === false);
    },
    setLook: (a, e, d) => {
      if (a != null) az = a;
      if (e != null) el = Ink.clamp(e, Ink.EL.min, Ink.EL.max);
      if (d != null) dist = Ink.clamp(d, Ink.DIST.min, Ink.DIST.max);
    },
    pointLights: () => scene ? scene.children.filter((o) => o.isPointLight).length : 0,
    threeOk: () => hasThree(window.THREE),
    usesCdnjs: () => false,
    art: ART.slice()
  };

  main().catch((err) => {
    console.error(err);
    fail(err && err.message ? err.message : "The creek could not open.");
  });
})();
