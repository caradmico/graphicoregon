/* Graphic Oregon — origin-centered walkable field */

const ink = 0x0a1014;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const paper = 0xe8efe8;
const Nav = window.FieldNav;

const BOUNDS = 160;
const EYE = 1.7;
const MOVE = 9;
const MOVE_FAST = 16;
const TURN = 1.7;
const COPPER_HREF = "https://sassmeharder.com/product/30931683?utm_source=pinterest&utm_medium=organic&utm_campaign=copper-horizon&utm_content=2026-08-21";

const MARKERS = [
  { id: "art", title: "Art", pos: [-22, 1.4, 0], color: gold, href: "https://graphicoregon.com/sample-page/", body: "Oil, acrylic, charcoal, and prints." },
  { id: "research", title: "Research", pos: [22, 1.4, 0], color: teal, href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/", body: "Mapping and habitat studies." },
  { id: "writing", title: "Writing", pos: [0, 1.4, 22], color: teal, href: "https://graphicoregon.com/", body: "Journalism and media." },
  { id: "websites", title: "Websites", pos: [0, 1.4, -22], color: gold, href: "https://graphicoregon.com/", body: "Website design." },
  { id: "credentials", title: "Credentials", pos: [0, 16, 0], color: teal, href: "https://graphicoregon.com/", body: "Education and practice." },
  { id: "ground", title: "Ground", pos: [0, -12, 0], color: 0x4a5a58, href: "https://graphicoregon.com/", body: "Below origin." }
];

let scene, camera, renderer;
let yaw = 0;
let pitch = -0.06;
let dragging = false;
let lookLocked = false;
let lastX = 0;
let lastY = 0;
let downX = 0;
let downY = 0;
const keys = {};
const pos = { x: 0, y: EYE, z: 0 };
const look = { x: 0, y: 0, z: -1 };
const clickables = [];
const billboards = [];
const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();

function loadTexture(url) {
  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      () => resolve(null)
    );
  });
}

function makeLabel(text, scale) {
  const w = 512;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(10, 16, 20, 0.72)";
  roundRect(ctx, 18, 22, w - 36, h - 44, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 176, 90, 0.55)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#e8d29a";
  ctx.font = "600 42px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(scale || 4.2, (scale || 4.2) * 0.25),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  );
  mesh.userData.billboard = true;
  billboards.push(mesh);
  return mesh;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function addAxis(from, to, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(from[0], from[1], from[2]),
    new THREE.Vector3(to[0], to[1], to[2])
  ]);
  scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: color })));
}

function addVolume(marker) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.2, 3.2),
    new THREE.MeshLambertMaterial({ color: marker.color })
  );
  mesh.position.set(marker.pos[0], marker.pos[1], marker.pos[2]);
  mesh.userData = {
    title: marker.title,
    body: marker.body,
    href: marker.href,
    linkLabel: "Open graphicoregon.com"
  };
  scene.add(mesh);
  clickables.push(mesh);
  const label = makeLabel(marker.title, 5.2);
  label.position.set(marker.pos[0], marker.pos[1] + 2.6, marker.pos[2]);
  scene.add(label);
}

function imagePlane(tex, height) {
  const img = tex.image;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(height * aspect, height),
    new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide })
  );
  return mesh;
}

function faceOrigin(mesh) {
  mesh.lookAt(0, mesh.position.y, 0);
}

function showPanel(data) {
  const panel = document.getElementById("panel");
  document.getElementById("panel-meta").textContent = data.meta || "Graphic Oregon";
  document.getElementById("panel-title").textContent = data.title || "";
  document.getElementById("panel-body").textContent = data.body || "";
  const links = document.getElementById("panel-links");
  links.innerHTML = "";
  if (data.href) {
    const a = document.createElement("a");
    a.href = data.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = data.linkLabel || "Open";
    links.appendChild(a);
  }
  panel.hidden = false;
}

function hidePanel() {
  document.getElementById("panel").hidden = true;
}

function applyCamera() {
  Nav.lookVector(yaw, pitch, look);
  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(pos.x + look.x, pos.y + look.y, pos.z + look.z);
}

function clampPos() {
  pos.x = Nav.clamp(pos.x, -BOUNDS, BOUNDS);
  pos.y = Nav.clamp(pos.y, -BOUNDS * 0.6, BOUNDS * 0.6);
  pos.z = Nav.clamp(pos.z, -BOUNDS, BOUNDS);
}

function goHome() {
  pos.x = 0;
  pos.y = EYE;
  pos.z = 0;
  yaw = 0;
  pitch = -0.06;
  hidePanel();
}

function updatePoseHud() {
  const el = document.getElementById("pose-xyz");
  if (el) {
    el.textContent = pos.x.toFixed(1) + "  " + pos.y.toFixed(1) + "  " + pos.z.toFixed(1);
  }
  const near = Math.hypot(pos.x, pos.z) < 3 && Math.abs(pos.y - EYE) < 2;
  const chip = document.getElementById("origin-chip");
  if (chip) chip.hidden = !near;
}

function pickAt(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  const ray = new THREE.Raycaster();
  ray.setFromCamera({ x: x, y: y }, camera);
  const hits = ray.intersectObjects(clickables, true);
  return hits.length ? hits[0].object : null;
}

function onClick(e) {
  const obj = pickAt(e);
  if (!obj) {
    hidePanel();
    return;
  }
  showPanel(obj.userData);
  if (obj.userData.openUrl) {
    window.open(obj.userData.openUrl, "_blank", "noopener");
  }
}

function bindInput() {
  const el = renderer.domElement;
  const hud = (t) => t && t.closest && t.closest("#hud a, #hud button, #panel");

  function onWheel(e) {
    if (hud(e.target)) return;
    e.preventDefault();
    const step = Nav.dollyStep(e.deltaY, e.deltaMode);
    Nav.lookVector(yaw, pitch, look);
    pos.x += look.x * step;
    pos.y += look.y * step;
    pos.z += look.z * step;
    if (Math.abs(e.deltaX) > 0.5) {
      const side = Nav.wheelUnit(e.deltaX, e.deltaMode) * Nav.DOLLY;
      const right = Nav.rightVector(yaw);
      pos.x += right.x * side;
      pos.z += right.z * side;
    }
    clampPos();
  }
  window.addEventListener("wheel", onWheel, { passive: false });

  el.addEventListener("pointerdown", (e) => {
    if (lookLocked) return;
    dragging = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (lookLocked) return;
    if (!dragging) return;
    const next = Nav.applyLook(yaw, pitch, e.clientX - lastX, e.clientY - lastY);
    yaw = next.yaw;
    pitch = next.pitch;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  el.addEventListener("pointerup", (e) => {
    if (lookLocked) return;
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    dragging = false;
    if (Math.hypot(dx, dy) < 7) onClick(e);
  });

  document.addEventListener("pointerlockchange", () => {
    lookLocked = document.pointerLockElement === el;
    const btn = document.getElementById("look-lock");
    if (btn) btn.textContent = lookLocked ? "Looking" : "Look";
    btn && btn.classList.toggle("on", lookLocked);
  });
  document.addEventListener("mousemove", (e) => {
    if (!lookLocked) return;
    const next = Nav.applyLook(yaw, pitch, e.movementX, e.movementY);
    yaw = next.yaw;
    pitch = next.pitch;
  });

  document.getElementById("look-lock").addEventListener("click", () => {
    if (lookLocked) document.exitPointerLock();
    else el.requestPointerLock();
  });
  document.getElementById("home").addEventListener("click", goHome);

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "q", "e"].includes(k)) {
      e.preventDefault();
    }
    if (k === "escape") {
      if (lookLocked) document.exitPointerLock();
      hidePanel();
    }
    if (k === "l") {
      if (lookLocked) document.exitPointerLock();
      else el.requestPointerLock();
    }
    if (k === "h") goHome();
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

function travel(dt) {
  if (keys.arrowleft) yaw -= TURN * dt;
  if (keys.arrowright) yaw += TURN * dt;
  const speed = keys.shift ? MOVE_FAST : MOVE;
  const offset = Nav.moveOffset(yaw, pitch, {
    forward: keys.w || keys.arrowup,
    back: keys.s || keys.arrowdown,
    left: keys.a,
    right: keys.d,
    up: keys.e || keys[" "],
    down: keys.q
  }, dt, speed);
  pos.x += offset.x;
  pos.y += offset.y;
  pos.z += offset.z;
  clampPos();
}

function buildField() {
  addAxis([-40, 0, 0], [40, 0, 0], 0xb4544a);
  addAxis([0, -40, 0], [0, 40, 0], teal);
  addAxis([0, 0, -40], [0, 0, 40], gold);

  const origin = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 20, 16),
    new THREE.MeshLambertMaterial({ color: gold })
  );
  origin.userData = {
    title: "Origin",
    body: "Start here. Travel out along X, Y, and Z.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  };
  scene.add(origin);
  clickables.push(origin);
  const originLabel = makeLabel("Graphic Oregon", 6.4);
  originLabel.position.set(0, 3.1, 0);
  scene.add(originLabel);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(6.4, 0.045, 8, 64),
    new THREE.MeshBasicMaterial({ color: teal })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  MARKERS.forEach(addVolume);
}

async function populatePieces() {
  const [guideTex, artTex, copperTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/art/neahkahnie.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg")
  ]);

  if (guideTex) {
    const guide = imagePlane(guideTex, 3.4);
    guide.position.set(-7.2, 2.2, 6.4);
    faceOrigin(guide);
    guide.userData = {
      title: "Giving Guide 2022–23",
      body: "Cover of the 2022–23 Giving Guide print.",
      href: "https://graphicoregon.com/",
      linkLabel: "Open graphicoregon.com"
    };
    scene.add(guide);
    clickables.push(guide);
    const label = makeLabel("Giving Guide", 4.4);
    label.position.set(-7.2, 4.4, 6.4);
    scene.add(label);
  }

  if (artTex) {
    const art = imagePlane(artTex, 3.2);
    art.position.set(-8.4, 2.15, -5.2);
    faceOrigin(art);
    art.userData = {
      title: "Neahkahnie",
      body: "Coast work from the studio.",
      href: "https://graphicoregon.com/sample-page/",
      linkLabel: "Open the studio page"
    };
    scene.add(art);
    clickables.push(art);
    const label = makeLabel("Neahkahnie", 4.2);
    label.position.set(-8.4, 4.2, -5.2);
    scene.add(label);
  }

  if (copperTex) {
    const stand = new THREE.Group();
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.15, 0.7),
      new THREE.MeshLambertMaterial({ color: 0x2a2420 })
    );
    post.position.y = 0.58;
    const tee = imagePlane(copperTex, 2.5);
    tee.position.set(0, 2.05, 0);
    stand.add(post, tee);
    stand.position.set(7.6, 0, 5.4);
    stand.lookAt(0, stand.position.y, 0);
    tee.userData = {
      title: "Copper Horizon ocean graphic tee",
      body: "A single stand on the field.",
      href: COPPER_HREF,
      linkLabel: "Open Copper Horizon",
      openUrl: COPPER_HREF
    };
    scene.add(stand);
    clickables.push(tee);
    const label = makeLabel("Copper Horizon", 4.6);
    label.position.set(7.6, 3.7, 5.4);
    scene.add(label);
  }
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  travel(dt);
  applyCamera();
  billboards.forEach((obj) => {
    obj.lookAt(camera.position);
  });
  updatePoseHud();
  renderer.render(scene, camera);
}

function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(ink);
  scene.fog = new THREE.FogExp2(0x0a1216, 0.012);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 800);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.add(new THREE.AmbientLight(0x8aa8a4, 0.55));
  scene.add(new THREE.HemisphereLight(0x9ec4be, 0x12181c, 0.62));
  const key = new THREE.DirectionalLight(0xf0e6c8, 0.55);
  key.position.set(12, 22, 8);
  scene.add(key);

  buildField();
  bindInput();
  applyCamera();
  showPanel({
    meta: "Graphic Oregon",
    title: "Origin",
    body: "Drag to turn. Scroll to travel. Move out along X, Y, and Z.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  });
  document.getElementById("loader").classList.add("hide");
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
  });
  tick();
  populatePieces().catch((err) => console.warn(err));
}

window.__field = {
  getPose: () => ({ x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch }),
  lookVector: () => Nav.lookVector(yaw, pitch),
  goHome: goHome
};

main();
