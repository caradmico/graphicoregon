/* Graphic Oregon — walk into Hair and river. One drawing. */
(function () {
  const Nav = window.FieldNav;
  const Cut = window.CreekLayers;
  const PIXEL_RATIO = 1.25;
  const PAPER = 0xf4efe6;
  const EYE = 1.7;
  const MOVE = 4.6;
  const MOVE_FAST = 7.8;
  const TURN = 1.35;
  const PLANE_H = 9.2;
  const PLANE_W = PLANE_H * Cut.ASPECT;
  const REF_Z = -13;
  const SPAWN = { x: 0.35, y: EYE, z: 11.4, yaw: 0.04, pitch: 0.18 };
  const PIVOT = { x: (0.58 - 0.5) * PLANE_W, y: (1 - 0.36) * PLANE_H };
  const DEPTH = {
    mountains: -28,
    hills: -21,
    woman: -14,
    hair: -11.4,
    trees: -6.2,
    river: -3.4
  };
  const BOUNDS = { x: 5.4, zMin: -9.2, zMax: 15.5 };
  const SOURCES = [
    "assets/hair-and-river.jpg",
    "../assets/art/20201206_134759.jpg",
    "https://caradmico.github.io/graphicoregon/assets/art/20201206_134759.jpg"
  ];

  let scene, camera, renderer;
  let yaw = SPAWN.yaw;
  let pitch = SPAWN.pitch;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  const held = Nav.emptyHeld();
  const pos = { x: SPAWN.x, y: SPAWN.y, z: SPAWN.z };
  const clock = new THREE.Clock();
  let wheelBudget = 2.4;
  let wheelReset = 0;
  const layerMeshes = [];

  function hideLoader() {
    const el = document.getElementById("loader");
    if (el) el.hidden = true;
  }

  function showStage() {
    const el = document.getElementById("stage");
    if (el) el.classList.add("ready");
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("art missing: " + src));
      img.src = src;
    });
  }

  async function loadDrawing() {
    let last;
    for (let i = 0; i < SOURCES.length; i++) {
      try {
        return await loadImage(SOURCES[i]);
      } catch (err) {
        last = err;
      }
    }
    throw last || new Error("Hair and river did not load");
  }

  function paperFloor() {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(256, 256);
    const d = img.data;
    for (let i = 0, p = 0; i < 256 * 256; i++, p += 4) {
      const n = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
      const k = (n - 0.5) * 7;
      d[p] = 244 + k;
      d[p + 1] = 239 + k * 0.8;
      d[p + 2] = 230 + k * 0.5;
      d[p + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(18, 18);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function scaleFor(z) {
    return (SPAWN.z - z) / (SPAWN.z - REF_Z);
  }

  function placeLayer(mesh, z) {
    const s = scaleFor(z);
    mesh.scale.set(s, s, 1);
    mesh.position.set(
      PIVOT.x + (0 - PIVOT.x) * s,
      PIVOT.y + (PLANE_H * 0.5 - PIVOT.y) * s,
      z
    );
    mesh.renderOrder = z;
  }

  function texFromCanvas(canvas) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }

  function buildLayers(cuts) {
    Cut.ORDER.forEach((name) => {
      const canvas = cuts[name];
      const mat = new THREE.MeshBasicMaterial({
        map: texFromCanvas(canvas),
        transparent: true,
        depthWrite: true,
        alphaTest: 0.08,
        side: THREE.DoubleSide,
        fog: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_W, PLANE_H), mat);
      mesh.name = name;
      placeLayer(mesh, DEPTH[name]);
      scene.add(mesh);
      layerMeshes.push(mesh);
    });
  }

  function buildGround() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 48),
      new THREE.MeshBasicMaterial({ map: paperFloor() })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
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
      if (Math.abs(e.deltaX) > 0.5) {
        const side = Nav.wheelUnit(e.deltaX, e.deltaMode) * 1.15;
        const right = Nav.rightVector(yaw);
        pos.x += right.x * side;
        pos.z += right.z * side;
      }
      clampPos();
    }, { passive: false });

    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.classList.add("drag");
      el.setPointerCapture(e.pointerId);
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
    el.addEventListener("pointerup", () => {
      dragging = false;
      el.classList.remove("drag");
    });

    window.addEventListener("keydown", (e) => {
      Nav.setHeld(held, e.code, e.key, true);
      if (Nav.isMoveKey(e.code, e.key)) e.preventDefault();
      if (e.code === "KeyH") {
        pos.x = SPAWN.x;
        pos.y = SPAWN.y;
        pos.z = SPAWN.z;
        yaw = SPAWN.yaw;
        pitch = SPAWN.pitch;
      }
    }, true);
    window.addEventListener("keyup", (e) => {
      Nav.setHeld(held, e.code, e.key, false);
    }, true);
    window.addEventListener("blur", () => {
      const clear = Nav.emptyHeld();
      Object.keys(clear).forEach((k) => { held[k] = false; });
    });
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

  async function main() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);
    camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 120);
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("stage"),
      antialias: true,
      alpha: false
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    fit();

    buildGround();
    const drawing = await loadDrawing();
    buildLayers(Cut.cutCanvases(drawing));
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
    spawn: Object.assign({}, SPAWN),
    pixelRatio: () => renderer ? renderer.getPixelRatio() : 0,
    layerNames: () => layerMeshes.map((m) => m.name),
    layerZ: () => layerMeshes.map((m) => ({ name: m.name, z: m.position.z })),
    pointLights: () => scene ? scene.children.filter((o) => o.isPointLight).length : 0
  };

  main().catch((err) => {
    console.error(err);
    const loader = document.getElementById("loader");
    if (loader) {
      const p = loader.querySelector("p");
      if (p) p.textContent = "The drawing did not load.";
    }
  });
})();
