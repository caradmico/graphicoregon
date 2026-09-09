/* Graphic Oregon — hair over the boulder, and the clear creek it enters. */
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
        "  float press = 0.88 + 0.12 * sin(vUv.x * 34.0 - uTime * 2.4);",
        "  float skip = step(0.06, hash(vec2(floor(vUv.x * 48.0), 3.4)));",
        "  vec3 c = mix(uPaper, uInk, skip * press);",
        "  c = mix(c, stroke, 0.28);",
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

  function buildBoulder() {
    const spec = Ink.boulder();
    const geo = rumple(new THREE.IcosahedronGeometry(1, 1), 0.18);
    geo.scale(spec.rx, spec.ry, spec.rz);
    const rock = new THREE.Group();
    rock.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: Ink.PAPER })));
    rock.add(new THREE.Mesh(
      inflate(geo, 0.018),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    ));
    rock.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 32),
      new THREE.LineBasicMaterial({ color: Ink.NAVY, transparent: true, opacity: 0.42 })
    ));
    const cracks = [
      [
        { x: 0.82, y: 0.55, z: 0.42 },
        { x: 0.98, y: 0.72, z: 0.18 },
        { x: 1.05, y: 1.02, z: -0.08 }
      ],
      [
        { x: -0.55, y: 1.18, z: 0.62 },
        { x: -0.22, y: 1.32, z: 0.48 },
        { x: 0.18, y: 1.38, z: 0.22 }
      ],
      [
        { x: -1.05, y: 0.42, z: 0.28 },
        { x: -0.72, y: 0.68, z: 0.62 },
        { x: -0.28, y: 0.82, z: 0.88 }
      ],
      [
        { x: 0.42, y: 1.42, z: -0.35 },
        { x: 0.68, y: 1.18, z: -0.55 },
        { x: 0.92, y: 0.88, z: -0.62 }
      ]
    ];
    const crackMat = new THREE.LineBasicMaterial({ color: Ink.NAVY });
    cracks.forEach((pts) => {
      const draped = pts.map((p) => Ink.outsideBoulder({
        x: spec.x + p.x,
        y: spec.y + p.y - spec.y,
        z: spec.z + p.z
      }, 0.012));
      const geoLine = new THREE.BufferGeometry().setFromPoints(
        draped.map((p) => new THREE.Vector3(p.x - spec.x, p.y - spec.y, p.z - spec.z))
      );
      rock.add(new THREE.Line(geoLine, crackMat));
    });
    rock.position.set(spec.x, spec.y, spec.z);
    addNamed(rock, "boulder");
  }

  /* Previous "water" tubes — these are hair. Keep the drape; the body comes later. */
  function buildHair() {
    const g = new THREE.Group();
    const red = inkStrandMat("red");
    const navy = inkStrandMat("navy");
    Ink.allStrands().forEach((pts, i) => {
      const kind = Ink.strandColor(i);
      const rad = 0.022 + (i % 5) * 0.005;
      g.add(tubeFrom(pts, rad, kind === "red" ? red : navy));
    });
    Ink.allRipples().forEach((pts, i) => {
      const kind = Ink.rippleColor(i);
      g.add(tubeFrom(pts, 0.01 + (i % 3) * 0.002, kind === "red" ? red : navy));
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
      new THREE.MeshBasicMaterial({ color: 0xe8e2d4 })
    );
    bed.rotation.x = -Math.PI / 2;
    bed.position.set(patch.x, 0.006, patch.z);
    g.add(bed);
    Ink.bedStones().forEach((s) => g.add(stoneMesh(s)));
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
        "  float hx = sin(pos.x * 1.65 + uTime * 0.52) * 0.0055;",
        "  float hz = sin(pos.z * 2.35 - uTime * 0.38) * 0.0038;",
        "  pos.y += hx + hz;",
        "  float dHdx = cos(pos.x * 1.65 + uTime * 0.52) * 1.65 * 0.0055;",
        "  float dHdz = cos(pos.z * 2.35 - uTime * 0.38) * 2.35 * 0.0038;",
        "  vec3 n = normalize(vec3(-dHdx, 1.0, -dHdz));",
        "  vNormal = normalize(mat3(modelMatrix) * n);",
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
        "  float fresnel = pow(1.0 - ndotv, 2.8);",
        "  vec3 sheen = mix(uPaper, uNavy, 0.34);",
        "  vec3 col = mix(mix(uPaper, uNavy, 0.035), sheen, fresnel);",
        "  float w1 = sin(vWorld.z * 3.55 - uTime * 0.42 + sin(vWorld.x * 1.7) * 1.05);",
        "  float w2 = sin(vWorld.z * 5.1 + vWorld.x * 0.55 - uTime * 0.28);",
        "  float line = smoothstep(0.968, 0.996, abs(w1)) + smoothstep(0.982, 0.998, abs(w2)) * 0.55;",
        "  float skip = step(0.38, hash(floor(vWorld.xz * 1.15)));",
        "  float mark = line * skip * (0.22 + fresnel * 0.18);",
        "  col = mix(col, uNavy, mark);",
        "  float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);",
        "  edge *= smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.84, vUv.y);",
        "  float alpha = mix(0.08, 0.54, fresnel) + mark * 0.2;",
        "  alpha *= edge * rock;",
        "  if (alpha < 0.012) discard;",
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

  function buildHills() {
    const mat = new THREE.MeshBasicMaterial({
      color: Ink.PAPER,
      side: THREE.DoubleSide
    });
    const line = new THREE.LineBasicMaterial({ color: Ink.NAVY });
    Ink.hills().forEach((h, i) => {
      const shape = new THREE.Shape();
      shape.moveTo(-h.w / 2, 0);
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = -h.w / 2 + t * h.w;
        const y = Math.sin(t * Math.PI) * h.h * (0.72 + Math.sin(t * 7.2 + i) * 0.12);
        shape.lineTo(x, y);
      }
      shape.lineTo(h.w / 2, 0);
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat);
      mesh.position.set(h.x, 0, h.z);
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = -h.w / 2 + t * h.w;
        const y = Math.sin(t * Math.PI) * h.h * (0.72 + Math.sin(t * 7.2 + i) * 0.12);
        pts.push(new THREE.Vector3(x, y, 0));
      }
      const ridge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), line);
      mesh.add(ridge);
      addNamed(mesh, "hill-" + i);
    });
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
    buildCreekBed();
    buildBoulder();
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
