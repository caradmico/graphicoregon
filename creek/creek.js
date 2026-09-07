/* Graphic Oregon — Hair and river as 3D forms, not a cut-out photo. */
(function () {
  const Form = window.CreekForm;
  const Nav = window.FieldNav;
  const PIXEL_RATIO = 1.25;
  const EYE = Form.SPAWN.y;
  const MOVE = 4.4;
  const MOVE_FAST = 7.2;
  const TURN = 1.3;
  const BOUNDS = { x: 7.2, zMin: -14, zMax: 12 };
  const ART = [
    "assets/hair-and-river.jpg",
    "../assets/art/20201206_134759.jpg",
    "https://caradmico.github.io/graphicoregon/assets/art/20201206_134759.jpg",
    "https://caradmico.github.io/company-soup/businesses/fine-art/img/20201206-134759.jpg"
  ];

  let THREE, scene, camera, renderer;
  let yaw = Form.SPAWN.yaw;
  let pitch = Form.SPAWN.pitch;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let clock;
  const held = Nav.emptyHeld();
  const pos = { x: Form.SPAWN.x, y: EYE, z: Form.SPAWN.z };
  let wheelBudget = 2.4;
  let wheelReset = 0;
  const names = [];
  let artImg = null;

  function hasThree(root) {
    const T = root || window.THREE;
    return !!(T && typeof T.Scene === "function" && typeof T.WebGLRenderer === "function" && T.TubeGeometry);
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
      "vendor/three.min.js",
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

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("art: " + src));
      img.src = src;
    });
  }

  async function loadArt() {
    for (let i = 0; i < ART.length; i++) {
      try {
        return await loadImage(ART[i]);
      } catch (err) {
        /* try next */
      }
    }
    return null;
  }

  function hatchCanvas(w, h, color, angle, gap) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.15;
    ctx.lineCap = "round";
    const rad = angle * Math.PI / 180;
    const span = w + h;
    for (let i = -span; i < span; i += gap) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + Math.cos(rad) * span, Math.sin(rad) * span);
      ctx.stroke();
    }
    return c;
  }

  function hatchTex(color, angle, gap) {
    const tex = new THREE.CanvasTexture(hatchCanvas(256, 256, color, angle, gap || 7));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.4, 2.4);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function sampleTex(img, u0, v0, u1, v1, repeatX, repeatY) {
    if (!img) return null;
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    const sx = u0 * img.width;
    const sy = v0 * img.height;
    const sw = Math.max(2, (u1 - u0) * img.width);
    const sh = Math.max(2, (v1 - v0) * img.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX || 1, repeatY || 1);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }

  function basic(opts) {
    const m = new THREE.MeshBasicMaterial(opts);
    m.fog = false;
    return m;
  }

  function inkVolume(geo, fill, hatch) {
    const g = new THREE.Group();
    const fillColor = fill == null ? 0xe8e0d2 : fill;
    const inner = new THREE.Mesh(
      geo,
      hatch ? basic({ map: hatch }) : basic({ color: fillColor })
    );
    const hull = new THREE.Mesh(
      geo.clone(),
      basic({ color: Form.INK, side: THREE.BackSide })
    );
    hull.scale.setScalar(1.045);
    g.add(hull, inner);
    g.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 18),
      new THREE.LineBasicMaterial({ color: Form.INK, transparent: true, opacity: 0.88 })
    ));
    return g;
  }

  function rumple(geo, amt) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = (Math.sin(x * 3.4 + z * 2.1 + y) * 0.5 + 0.5) * amt;
      const len = Math.hypot(x, y, z) || 1;
      pos.setXYZ(i, x + (x / len) * n, y + (y / len) * n * 0.6, z + (z / len) * n);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function lathe(pts, segs) {
    const profile = pts.map((p) => new THREE.Vector2(p[0], p[1]));
    const geo = new THREE.LatheGeometry(profile, segs || 22);
    geo.computeVertexNormals();
    return geo;
  }

  function addNamed(obj, name) {
    obj.name = name;
    names.push(name);
    scene.add(obj);
    return obj;
  }

  function paperFloor() {
    const tex = hatchTex("rgba(36,50,76,0.07)", 8, 18);
    tex.repeat.set(14, 14);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      basic({ map: tex, color: Form.PAPER })
    );
    floor.rotation.x = -Math.PI / 2;
    addNamed(floor, "ground");
  }

  function buildBoulder() {
    const geo = rumple(new THREE.IcosahedronGeometry(1.48, 2), 0.16);
    geo.scale(1.22, 0.78, 1.08);
    const rock = inkVolume(geo, 0xe7e0d2);
    rock.position.set(Form.BOULDER.x, Form.BOULDER.y, Form.BOULDER.z);
    addNamed(rock, "boulder");
  }

  function buildRockStack() {
    const g = new THREE.Group();
    const blocks = [
      [0, 0.42, 0, 1.05, 0.85, 0.8],
      [0.22, 1.05, -0.08, 0.78, 0.62, 0.7],
      [-0.18, 1.55, 0.1, 0.7, 0.5, 0.58],
      [0.16, 2.0, 0.02, 0.52, 0.42, 0.48],
      [-0.04, 2.38, -0.06, 0.4, 0.34, 0.38]
    ];
    blocks.forEach((b, i) => {
      const geo = rumple(new THREE.BoxGeometry(b[3], b[4], b[5], 2, 2, 2), 0.05);
      geo.rotateY(0.22 * (i % 2 ? 1 : -1));
      const mesh = inkVolume(geo, 0xe7e0d2);
      mesh.position.set(b[0], b[1], b[2]);
      g.add(mesh);
    });
    g.position.set(2.05, 0, -7.7);
    addNamed(g, "rock-stack");
  }

  function buildWoman() {
    const g = new THREE.Group();
    const flesh = 0xddd4c4;
    const head = inkVolume(lathe([
      [0.002, 0.18], [0.06, 0.17], [0.1, 0.14], [0.118, 0.07],
      [0.116, 0], [0.1, -0.07], [0.07, -0.12], [0.002, -0.14]
    ], 28), flesh);
    head.position.set(0.78, 0.08, 0.18);
    head.rotation.x = 1.15;
    head.rotation.z = -0.38;

    const faceTex = sampleTex(artImg, 0.50, 0.18, 0.74, 0.40);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.22),
      faceTex ? basic({ map: faceTex, transparent: true }) : basic({ color: flesh })
    );
    face.position.set(0.03, -0.02, 0.12);
    head.add(face);

    const tear = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 10, 8),
      basic({ color: Form.INK })
    );
    tear.scale.set(0.62, 1.7, 0.62);
    tear.position.set(0.04, -0.18, 0.09);
    head.add(tear);

    const cap = inkVolume(lathe([
      [0.04, 0.2], [0.12, 0.18], [0.15, 0.1], [0.14, 0.02], [0.08, -0.04]
    ], 20), Form.RED, sampleTex(artImg, 0.48, 0.28, 0.64, 0.48) || hatchTex("#a3262b", 95, 5));
    cap.position.set(0.76, 0.16, 0.12);
    cap.rotation.x = 0.9;
    cap.rotation.z = -0.3;

    const neck = inkVolume(lathe([
      [0.034, 0.06], [0.04, 0], [0.048, -0.08]
    ], 14), flesh);
    neck.position.set(0.55, 0.16, 0.06);
    neck.rotation.z = -0.75;

    const torso = inkVolume(lathe([
      [0.06, 0.34], [0.13, 0.3], [0.155, 0.18], [0.14, 0.02],
      [0.125, -0.14], [0.09, -0.24], [0.04, -0.28]
    ], 26), flesh);
    torso.position.set(0.02, 0.28, 0.02);
    torso.rotation.z = -1.18;
    torso.rotation.x = 0.28;

    function limb(len, r0, r1) {
      const pts = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        pts.push([r0 + (r1 - r0) * t, -t * len]);
      }
      return lathe(pts, 12);
    }
    const armL = inkVolume(limb(0.7, 0.036, 0.022), flesh);
    armL.position.set(-0.06, 0.42, 0.1);
    armL.rotation.z = 1.2;
    armL.rotation.x = 0.4;
    const armR = inkVolume(limb(0.64, 0.036, 0.022), flesh);
    armR.position.set(0.28, 0.34, 0.2);
    armR.rotation.z = 0.9;
    armR.rotation.x = 0.62;

    g.add(torso, neck, cap, head, armL, armR);
    g.position.set(-0.15, 2.12, -6.95);
    addNamed(g, "woman");
  }

  function strokeMat(kind) {
    if (kind === "red") {
      const tex = sampleTex(artImg, 0.46, 0.36, 0.62, 0.62, 1, 2.4);
      return tex ? basic({ map: tex }) : basic({ color: Form.RED });
    }
    const tex = sampleTex(artImg, 0.34, 0.48, 0.52, 0.78, 1, 2.2);
    return tex ? basic({ map: tex }) : basic({ color: Form.INK });
  }

  function tubeFrom(pts, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x, p.y, p.z)));
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 40, radius, 5, false), mat);
  }

  function buildHairCreek() {
    const g = new THREE.Group();
    const fallN = 14;
    for (let i = 0; i < fallN; i++) {
      const pts = Form.hairFallOnly(i, fallN);
      const rad = 0.034 + (i % 4) * 0.012;
      g.add(tubeFrom(pts, rad, strokeMat(i % 2 ? "red" : "ink")));
    }
    const creekN = 8;
    for (let i = 0; i < creekN; i++) {
      g.add(tubeFrom(Form.creekStrand(i, creekN), 0.03 + (i % 3) * 0.008, strokeMat(i % 2 ? "ink" : "red")));
    }
    addNamed(g, "hair-creek");
  }

  function trunk(x, z, h, r, mat) {
    const geo = new THREE.CylinderGeometry(r * 0.62, r * 1.12, h, 14, 3);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h * 0.5, z);
    return mesh;
  }

  function buildTrees() {
    const spec = Form.treeSpec();
    const barkTex = sampleTex(artImg, 0.04, 0.08, 0.22, 0.7, 1, 2.6) || hatchTex("#a3262b", 8, 6);
    const bark = basic({ map: barkTex });
    const inkBark = basic({ map: hatchTex("#1a2744", 92, 8) });
    const redBark = basic({ map: hatchTex("#a3262b", 16, 5), color: Form.RED });

    const thick = new THREE.Group();
    thick.add(trunk(0, 0, spec.thick.h, spec.thick.r, bark));
    [[-0.42, 0.12, 0.55], [0.28, -0.22, 0.4], [-0.1, 0.38, 0.35]].forEach((r) => {
      const root = tubeFrom([
        { x: 0, y: 0.18, z: 0 },
        { x: r[0] * 0.4, y: 0.08, z: r[1] * 0.4 },
        { x: r[0], y: 0.02, z: r[1] }
      ], 0.055, bark);
      thick.add(root);
    });
    thick.position.set(spec.thick.x, 0, spec.thick.z);
    addNamed(thick, "tree-thick");

    spec.slim.forEach((t, i) => {
      addNamed(trunk(t.x, t.z, t.h, t.r, inkBark), "tree-slim-" + i);
    });

    const red = new THREE.Group();
    red.add(trunk(0, 0, spec.red.h, spec.red.r, redBark));
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(
        new THREE.CircleGeometry(0.11, 5),
        basic({ color: Form.RED, side: THREE.DoubleSide })
      );
      leaf.position.set((i - 2) * 0.22, spec.red.h * 0.72 + (i % 2) * 0.18, 0.05);
      leaf.rotation.y = 0.4;
      red.add(leaf);
    }
    red.position.set(spec.red.x, 0, spec.red.z);
    addNamed(red, "tree-red");
  }

  function buildHills() {
    const hatch = hatchTex("#24324c", 38, 9);
    Form.hillSpecs().forEach((h, i) => {
      const shape = new THREE.Shape();
      shape.moveTo(-h.w / 2, 0);
      shape.lineTo(-h.w * 0.38, h.h * 0.38);
      shape.lineTo(-h.w * 0.18, h.h * 0.82);
      shape.lineTo(-h.w * 0.04, h.h * 0.58);
      shape.lineTo(h.w * 0.08, h.h);
      shape.lineTo(h.w * 0.22, h.h * 0.7);
      shape.lineTo(h.w * 0.4, h.h * 0.42);
      shape.lineTo(h.w / 2, 0);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: h.d, bevelEnabled: false });
      const hill = inkVolume(geo, Form.PAPER, hatch);
      hill.position.set(h.x, 0, h.z);
      addNamed(hill, "hill-" + i);
    });
  }

  function buildBranch() {
    const mat = basic({ map: hatchTex("#a3262b", 12, 6) });
    const log = tubeFrom([
      { x: 1.8, y: 0.06, z: 1.6 },
      { x: 2.35, y: 0.05, z: 1.85 },
      { x: 2.9, y: 0.04, z: 1.55 }
    ], 0.045, mat);
    addNamed(log, "branch");
  }

  function buildReed() {
    const mat = basic({ color: Form.INK });
    for (let i = 0; i < 4; i++) {
      const reed = tubeFrom([
        { x: -3.05 + i * 0.12, y: 0, z: -1.7 + i * 0.08 },
        { x: -3.02 + i * 0.12, y: 0.22, z: -1.68 },
        { x: -3.08 + i * 0.1, y: 0.38, z: -1.66 }
      ], 0.012, mat);
      addNamed(reed, "reed-" + i);
    }
  }

  function applyCamera() {
    const look = Nav.lookVector(yaw, pitch);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(pos.x + look.x, pos.y + look.y, pos.z + look.z);
  }

  function clampPos() {
    pos.x = Nav.clamp(pos.x, -BOUNDS.x, BOUNDS.x);
    pos.z = Nav.clamp(pos.z, BOUNDS.zMin, BOUNDS.zMax);
    pos.y = EYE;
  }

  function travel(dt) {
    if (held.turnLeft) yaw -= TURN * dt;
    if (held.turnRight) yaw += TURN * dt;
    if (held.lookUp) pitch = Nav.clamp(pitch + TURN * dt, -Nav.PITCH_LIMIT, Nav.PITCH_LIMIT);
    if (held.lookDown) pitch = Nav.clamp(pitch - TURN * dt, -Nav.PITCH_LIMIT, Nav.PITCH_LIMIT);
    const speed = held.fast ? MOVE_FAST : MOVE;
    const offset = Nav.moveOffset(yaw, pitch, held, dt, speed);
    pos.x += offset.x;
    pos.z += offset.z;
    clampPos();
  }

  function holdWalk(dir, down) {
    if (dir === "forward") held.forward = down;
    if (dir === "back") held.back = down;
  }

  function bindWalkButtons() {
    function step(dir) {
      const flat = Nav.flatForward(yaw);
      const k = dir === "forward" ? 1.15 : -1.15;
      pos.x += flat.x * k;
      pos.z += flat.z * k;
      clampPos();
    }
    function bind(id, dir) {
      const el = document.getElementById(id);
      if (!el) return;
      const on = (e) => {
        e.preventDefault();
        holdWalk(dir, true);
        el.classList.add("held");
      };
      const off = (e) => {
        e.preventDefault();
        holdWalk(dir, false);
        el.classList.remove("held");
      };
      el.addEventListener("pointerdown", on);
      el.addEventListener("pointerup", off);
      el.addEventListener("pointerleave", off);
      el.addEventListener("pointercancel", off);
      el.addEventListener("click", (e) => {
        e.preventDefault();
        step(dir);
      });
    }
    bind("walk-fwd", "forward");
    bind("walk-back", "back");
  }

  function bindInput() {
    const el = renderer.domElement;
    el.tabIndex = 0;
    try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }

    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelReset > 90) {
        wheelBudget = 2.4;
        wheelReset = now;
      }
      const step = Nav.wheelCap(Nav.dollyStep(e.deltaY, e.deltaMode, 1.15), wheelBudget);
      wheelBudget = Math.max(0, wheelBudget - Math.abs(step));
      const flat = Nav.flatForward(yaw);
      pos.x += flat.x * step;
      pos.z += flat.z * step;
      clampPos();
    }, { passive: false });

    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest && e.target.closest("#walk")) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.classList.add("drag");
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* older webkit */ }
    });
    function onLook(e) {
      if (!dragging) return;
      const next = Nav.applyLook(yaw, pitch, e.clientX - lastX, e.clientY - lastY);
      yaw = next.yaw;
      pitch = next.pitch;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    el.addEventListener("pointermove", onLook);
    window.addEventListener("pointermove", onLook);
    const endLook = () => {
      dragging = false;
      el.classList.remove("drag");
    };
    el.addEventListener("pointerup", endLook);
    el.addEventListener("pointercancel", endLook);

    let touchY = 0;
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (e.touches.length === 2) touchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }, { passive: false });
    el.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const step = Nav.clamp((touchY - y) * 0.03, -0.55, 0.55);
        const flat = Nav.flatForward(yaw);
        pos.x += flat.x * step;
        pos.z += flat.z * step;
        clampPos();
        touchY = y;
      }
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      Nav.setHeld(held, e.code, e.key, true);
      if (Nav.isMoveKey(e.code, e.key)) e.preventDefault();
      if (e.code === "KeyH") {
        pos.x = Form.SPAWN.x;
        pos.y = Form.SPAWN.y;
        pos.z = Form.SPAWN.z;
        yaw = Form.SPAWN.yaw;
        pitch = Form.SPAWN.pitch;
      }
    }, true);
    window.addEventListener("keyup", (e) => {
      Nav.setHeld(held, e.code, e.key, false);
    }, true);
    window.addEventListener("blur", () => {
      const clear = Nav.emptyHeld();
      Object.keys(clear).forEach((k) => { held[k] = false; });
    });
    bindWalkButtons();
  }

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    travel(dt);
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
    buildBoulder();
    buildRockStack();
    buildWoman();
    buildHairCreek();
    buildTrees();
    buildHills();
    buildBranch();
    buildReed();
  }

  async function main() {
    if (!Nav) throw new Error("Look/walk math did not load.");
    if (!Form) throw new Error("Creek form did not load.");
    THREE = await ensureThree();
    if (!hasThree(THREE)) throw new Error("Three.js loaded without Scene. Cannot open the creek.");

    artImg = await loadArt();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(Form.PAPER);
    camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 140);
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
    clampPos();
    applyCamera();
    bindInput();
    window.addEventListener("resize", fit);
    renderer.render(scene, camera);
    hideLoader();
    showStage();
    tick();
  }

  window.__creek = {
    getPose: () => ({ x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch }),
    spawn: Object.assign({}, Form.SPAWN),
    pixelRatio: () => renderer ? renderer.getPixelRatio() : 0,
    names: () => names.slice(),
    hasWoman: () => names.indexOf("woman") !== -1,
    hasHairCreek: () => names.indexOf("hair-creek") !== -1,
    hasBoulder: () => names.indexOf("boulder") !== -1,
    pointLights: () => scene ? scene.children.filter((o) => o.isPointLight).length : 0,
    threeOk: () => hasThree(window.THREE),
    layersCut: () => false
  };

  main().catch((err) => {
    console.error(err);
    fail(err && err.message ? err.message : "The creek could not open.");
  });
})();
