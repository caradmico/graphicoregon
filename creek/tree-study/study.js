/* Graphic Oregon — one tree from Hair and river, as pen in space. */
(function () {
  const Ink = window.TreeInk;
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
  const target = { x: 0, y: Ink.SPAWN.targetY, z: 0 };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pinch0 = 0;
  let dist0 = dist;
  const names = [];
  let inkMat = null;
  let hatchMat = null;

  function hasThree(root) {
    const T = root || window.THREE;
    return !!(T && typeof T.Scene === "function" && typeof T.WebGLRenderer === "function" && T.LatheGeometry && T.ShaderMaterial);
  }

  function fail(msg) {
    const loader = document.getElementById("loader");
    const p = document.getElementById("loader-msg");
    if (loader) loader.classList.add("error");
    if (p) p.textContent = msg;
    if (loader) loader.hidden = false;
  }

  function hideLoader() {
    const el = document.getElementById("loader");
    if (el) el.hidden = true;
  }

  function showStage() {
    const el = document.getElementById("stage");
    if (el) el.classList.add("ready");
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

  function hatchTexture() {
    const w = 512;
    const h = 512;
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
    tex.repeat.set(1, 2.4);
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function inkMaterial() {
    const tex = hatchTexture();
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uHatch: { value: tex },
        uLight: { value: new THREE.Vector3(-0.72, 0.28, 0.48).normalize() },
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
        "uniform vec3 uLight;",
        "uniform vec3 uNavy;",
        "float hash(vec2 p) {",
        "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);",
        "}",
        "void main() {",
        "  vec3 N = normalize(vNormal);",
        "  vec3 V = normalize(cameraPosition - vWorld);",
        "  float ndl = dot(N, normalize(uLight));",
        "  float shadow = smoothstep(0.28, -0.22, ndl);",
        "  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.4);",
        "  vec3 hatch = texture2D(uHatch, vUv * vec2(1.0, 2.6)).rgb;",
        "  float nwave = sin(vUv.y * 34.0 + vUv.x * 5.0) * 0.014;",
        "  float col = (vUv.x + nwave) * 48.0;",
        "  float skip = step(0.16, hash(vec2(floor(col), 3.7)));",
        "  float navyLine = (1.0 - smoothstep(0.0, 0.2, abs(fract(col) - 0.5))) * skip;",
        "  float diag = fract((vUv.x * 0.62 + vUv.y) * 36.0 + hash(vec2(floor(vUv.y * 42.0), 2.2)) * 0.28);",
        "  float cross = 1.0 - smoothstep(0.0, 0.17, abs(diag - 0.5));",
        "  vec3 c = hatch;",
        "  c = mix(c, uNavy, navyLine * shadow * 0.78);",
        "  c = mix(c, uNavy, cross * shadow * 0.38);",
        "  c = mix(c, uNavy, rim * 0.72);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
  }

  function navyLine() {
    return new THREE.MeshBasicMaterial({ color: Ink.NAVY });
  }

  function inflate(geo, amt) {
    const g = geo.clone();
    if (!g.attributes.normal) g.computeVertexNormals();
    const pos = g.attributes.position;
    const nrm = g.attributes.normal;
    const k = amt == null ? 0.028 : amt;
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

  function outlineOf(geo, amt) {
    return new THREE.Mesh(
      inflate(geo, amt == null ? 0.03 : amt),
      new THREE.MeshBasicMaterial({ color: Ink.NAVY, side: THREE.BackSide })
    );
  }

  function rumple(geo, amt) {
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

  function tubeTaper(pts, r0, r1) {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
    return new THREE.TubeGeometry(curve, 28, (r0 + r1) * 0.5, 10, false);
  }

  function horn(r0, r1, len) {
    const profile = [
      new THREE.Vector2(r0, 0),
      new THREE.Vector2(r0 * 0.92, len * 0.22),
      new THREE.Vector2((r0 + r1) * 0.48, len * 0.55),
      new THREE.Vector2(r1 * 1.15, len * 0.84),
      new THREE.Vector2(r1, len)
    ];
    return new THREE.LatheGeometry(profile, 18);
  }

  function aimY(obj, from, to) {
    const dir = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z);
    if (dir.lengthSq() < 1e-8) return;
    dir.normalize();
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    obj.position.set(from.x, from.y, from.z);
  }

  function inkVolume(geo, outlineAmt, mat) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, mat || inkMat));
    g.add(outlineOf(geo, outlineAmt));
    return g;
  }

  function buildTrunk(spec) {
    const profile = spec.profile.map((p) => new THREE.Vector2(p[0], p[1]));
    const geo = rumple(new THREE.LatheGeometry(profile, 30), 0.042);
    const g = inkVolume(geo);
    g.rotation.z = spec.lean;
    addNamed(g, "tree");
    return g;
  }

  function buildRoots(spec, parent) {
    spec.roots.forEach((root) => {
      const g = new THREE.Group();
      const last = root.pts.length - 1;
      for (let i = 0; i < last; i++) {
        const a = root.pts[i];
        const b = root.pts[i + 1];
        const t0 = i / last;
        const t1 = (i + 1) / last;
        const rA = root.r0 + (root.r1 - root.r0) * t0;
        const rB = root.r0 + (root.r1 - root.r0) * t1;
        const len = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
        const piece = inkVolume(horn(rA, rB, len), 0.014, hatchMat);
        aimY(piece, a, b);
        g.add(piece);
      }
      g.name = root.name;
      names.push(root.name);
      parent.add(g);
    });
  }

  function buildBranches(spec) {
    const mat = navyLine();
    spec.branches.forEach((br) => {
      const geo = tubeTaper(br.pts, br.r, br.r * 0.45);
      const mesh = new THREE.Mesh(geo, mat);
      addNamed(mesh, br.name);
    });
    const star = new THREE.Mesh(
      new THREE.CircleGeometry(0.085, 5),
      new THREE.MeshBasicMaterial({ color: Ink.RED, side: THREE.DoubleSide })
    );
    const tip = spec.branches[2].pts[2];
    star.position.set(tip.x - 0.02, tip.y + 0.06, tip.z);
    star.rotation.y = 0.4;
    addNamed(star, "canopy-mark");
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
    ctx.strokeStyle = "rgba(26,39,68,0.07)";
    ctx.lineWidth = 1;
    for (let i = -32; i < 320; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, h);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 48),
      new THREE.MeshBasicMaterial({ map: tex, color: Ink.PAPER })
    );
    floor.rotation.x = -Math.PI / 2;
    addNamed(floor, "ground");
  }

  function groundPatch() {
    const shape = new THREE.Shape();
    const n = 18;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 1.15 + Math.sin(a * 2.2) * 0.28 + Math.cos(a * 3.7) * 0.16;
      const x = Math.cos(a) * r - 0.22;
      const y = Math.sin(a) * r * 0.78;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({
      map: hatchTexture(),
      color: 0xe8e0d2,
      side: THREE.DoubleSide
    });
    mat.map.repeat.set(1.4, 1.4);
    const patch = new THREE.Mesh(geo, mat);
    patch.rotation.x = -Math.PI / 2;
    patch.position.y = 0.008;
    addNamed(patch, "patch");
  }

  function reeds() {
    const mat = navyLine();
    const tufts = [
      [-0.95, 0.22],
      [-0.72, 0.38],
      [0.55, -0.18],
      [-0.18, 0.52]
    ];
    tufts.forEach((t, i) => {
      const geo = tubeTaper([
        { x: t[0], y: 0, z: t[1] },
        { x: t[0] + 0.02, y: 0.16, z: t[1] + 0.01 },
        { x: t[0] - 0.03, y: 0.32, z: t[1] }
      ], 0.01, 0.004);
      addNamed(new THREE.Mesh(geo, mat), "reed-" + i);
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
      dist = Ink.dollyDist(dist, e.deltaY, e.deltaMode, 0.9);
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
      if (e.code === "KeyW" || e.code === "ArrowUp") dist = Ink.clamp(dist - 0.35, Ink.DIST.min, Ink.DIST.max);
      if (e.code === "KeyS" || e.code === "ArrowDown") dist = Ink.clamp(dist + 0.35, Ink.DIST.min, Ink.DIST.max);
      if (e.code === "ArrowLeft") az -= 0.08;
      if (e.code === "ArrowRight") az += 0.08;
    }, true);
  }

  function tick() {
    requestAnimationFrame(tick);
    clock.getDelta();
    applyCamera();
    renderer.render(scene, camera);
  }

  function fit() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
    renderer.setSize(innerWidth, innerHeight);
  }

  function buildTree() {
    const spec = Ink.tree();
    paperFloor();
    groundPatch();
    const trunk = buildTrunk(spec);
    buildRoots(spec, trunk);
    buildBranches(spec);
    reeds();
  }

  async function main() {
    if (!Ink) throw new Error("Tree ink math did not load.");
    THREE = await ensureThree();
    if (!hasThree(THREE)) throw new Error("Three.js loaded without Scene. Cannot open the tree.");

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
    inkMat = inkMaterial();
    hatchMat = new THREE.MeshBasicMaterial({
      map: hatchTexture(),
      side: THREE.DoubleSide
    });
    hatchMat.map.repeat.set(1, 2.2);
    buildTree();
    applyCamera();
    bindInput();
    window.addEventListener("resize", fit);
    renderer.render(scene, camera);
    hideLoader();
    showStage();
    tick();
  }

  window.__treeStudy = {
    getOrbit: () => ({ az: az, el: el, dist: dist, targetY: target.y }),
    spawn: Object.assign({}, Ink.SPAWN),
    pixelRatio: () => renderer ? renderer.getPixelRatio() : 0,
    names: () => names.slice(),
    hasTree: () => names.indexOf("tree") !== -1,
    hasLeftRoot: () => names.indexOf("root-left") !== -1,
    pointLights: () => scene ? scene.children.filter((o) => o.isPointLight).length : 0,
    threeOk: () => hasThree(window.THREE),
    usesCdnjs: () => false,
    art: ART.slice()
  };

  main().catch((err) => {
    console.error(err);
    fail(err && err.message ? err.message : "The tree could not open.");
  });
})();
