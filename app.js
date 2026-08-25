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

const PLACES = [
  { id: "art", title: "Art", pos: [-22, 0, 0], href: "https://graphicoregon.com/sample-page/", body: "Oil, acrylic, charcoal, and prints." },
  { id: "research", title: "Research", pos: [22, 0, 0], href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/", body: "Mapping and habitat studies." },
  { id: "writing", title: "Writing", pos: [0, 0, 22], href: "https://graphicoregon.com/", body: "Journalism and media." },
  { id: "websites", title: "Websites", pos: [0, 0, -22], href: "https://graphicoregon.com/", body: "Website design." },
  { id: "credentials", title: "Credentials", pos: [0, 16, 0], href: "https://graphicoregon.com/", body: "Education and practice." },
  { id: "ground", title: "Ground", pos: [0, -12, 0], href: "https://graphicoregon.com/", body: "The field continues below." }
];

let scene, camera, renderer;
let yaw = 0;
let pitch = -0.2;
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
const stone = new THREE.MeshLambertMaterial({ color: 0x2a322e });
const stoneDeep = new THREE.MeshLambertMaterial({ color: 0x1a2220 });
const brass = new THREE.MeshLambertMaterial({ color: 0x8a7040 });

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

function canvasTex(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function fieldTexture() {
  const tex = canvasTex((ctx, w, h) => {
    ctx.fillStyle = "#141c1a";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 14000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const v = 18 + Math.random() * 36;
      ctx.fillStyle = "rgba(" + (v * 0.7) + "," + (v * 1.05) + "," + (v * 0.85) + "," + (0.04 + Math.random() * 0.12) + ")";
      ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 2);
    }
  }, 1024, 1024);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  return tex;
}

function plazaTexture() {
  return canvasTex((ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.48);
    g.addColorStop(0, "#3a423c");
    g.addColorStop(0.55, "#2c3430");
    g.addColorStop(1, "#222824");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.49, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4200; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * w * 0.48;
      ctx.fillStyle = "rgba(210, 190, 140," + (0.015 + Math.random() * 0.04) + ")";
      ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, 2);
    }
    ctx.strokeStyle = "rgba(212, 176, 90, 0.42)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(42, 168, 160, 0.22)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(232, 210, 154, 0.78)";
    ctx.font = "600 42px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GRAPHIC OREGON", cx, cy);
    ctx.fillStyle = "rgba(155, 176, 176, 0.72)";
    ctx.font = "22px Georgia, serif";
    const rim = [
      { t: "WRITING", x: cx, y: cy + w * 0.36 },
      { t: "WEBSITES", x: cx, y: cy - w * 0.36 },
      { t: "ART", x: cx - w * 0.36, y: cy },
      { t: "RESEARCH", x: cx + w * 0.36, y: cy }
    ];
    rim.forEach((item) => ctx.fillText(item.t, item.x, item.y));
  }, 1024, 1024);
}

function skyTexture() {
  return canvasTex((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0b1014");
    g.addColorStop(0.42, "#121a1e");
    g.addColorStop(0.68, "#243038");
    g.addColorStop(0.84, "#5a3e28");
    g.addColorStop(1, "#1c1814");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, 4, 512);
}

function tabletTexture() {
  return canvasTex((ctx, w, h) => {
    ctx.fillStyle = "#2a322e";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(212, 176, 90, 0.55)";
    ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.fillStyle = "#e8d29a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 54px Georgia, serif";
    ctx.fillText("GRAPHIC OREGON", w / 2, h * 0.42);
    ctx.fillStyle = "#2aa8a0";
    ctx.font = "22px Georgia, serif";
    ctx.fillText("RESEARCH  ·  MAPPING  ·  DESIGN  ·  WRITING  ·  FINE ART", w / 2, h * 0.62);
  }, 1024, 512);
}

function makeLabel(text, scale) {
  const w = 512;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(16, 22, 20, 0.7)";
  roundRect(ctx, 18, 22, w - 36, h - 44, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 176, 90, 0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#e8d29a";
  ctx.font = "600 40px Georgia, serif";
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

function placeData(place) {
  return {
    title: place.title,
    body: place.body,
    href: place.href,
    linkLabel: "Open graphicoregon.com"
  };
}

function addStele(place) {
  const group = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.35, 0.18), stone);
  slab.position.y = 1.18;
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.18, 0.55), stoneDeep);
  plinth.position.y = 0.09;
  const lip = new THREE.Mesh(new THREE.BoxGeometry(1.07, 0.04, 0.2), brass);
  lip.position.y = 2.36;
  group.add(slab, plinth, lip);
  group.position.set(place.pos[0], 0, place.pos[2]);
  group.lookAt(0, 0, 0);
  slab.userData = placeData(place);
  scene.add(group);
  clickables.push(slab);
  const label = makeLabel(place.title, 4.6);
  label.position.set(place.pos[0], 2.85, place.pos[2]);
  scene.add(label);
}

function addCredentials(place) {
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.2, 0.08),
    new THREE.MeshLambertMaterial({ color: 0x2a322e, emissive: 0x1a1810, emissiveIntensity: 0.12 })
  );
  plaque.position.set(0, place.pos[1], 0);
  plaque.userData = placeData(place);
  scene.add(plaque);
  clickables.push(plaque);
  const label = makeLabel(place.title, 4.8);
  label.position.set(0, place.pos[1] + 1.15, 0);
  scene.add(label);
}

function addGroundWell(place) {
  const well = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 0.55, 32), stoneDeep);
  well.position.set(0, place.pos[1], 0);
  well.userData = placeData(place);
  scene.add(well);
  clickables.push(well);
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 32),
    new THREE.MeshLambertMaterial({ color: 0x152024, emissive: 0x0a1818, emissiveIntensity: 0.2 })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, place.pos[1] + 0.29, 0);
  scene.add(pool);
  const label = makeLabel(place.title, 4.2);
  label.position.set(0, place.pos[1] + 1.4, 0);
  scene.add(label);
}

function addHills() {
  const mat = new THREE.MeshLambertMaterial({ color: 0x101614 });
  const ridges = [
    [-70, -4, -95, 38, 10, 22],
    [80, -5, -88, 44, 12, 20],
    [-110, -6, 20, 50, 14, 26],
    [105, -6, 40, 42, 11, 24],
    [18, -7, 118, 56, 13, 28],
    [-40, -5, 100, 36, 9, 18]
  ];
  ridges.forEach((r) => {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mat);
    hill.position.set(r[0], r[1], r[2]);
    hill.scale.set(r[3], r[4], r[5]);
    scene.add(hill);
  });
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
  pitch = -0.2;
  hidePanel();
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
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 20),
    new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog: false, depthWrite: false })
  );
  scene.add(sky);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(190, 72),
    new THREE.MeshLambertMaterial({ map: fieldTexture(), color: 0xc8d0cc })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.04;
  scene.add(ground);

  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(8.4, 72),
    new THREE.MeshLambertMaterial({ map: plazaTexture() })
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.01;
  scene.add(plaza);

  const tablet = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.3),
    new THREE.MeshLambertMaterial({ map: tabletTexture(), side: THREE.DoubleSide })
  );
  tablet.position.set(0, 1.55, -3.35);
  tablet.lookAt(0, 1.55, 0);
  tablet.userData = {
    title: "Graphic Oregon",
    body: "Research, mapping, design, writing, and fine art.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  };
  const back = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2.4, 0.14), stone);
  back.position.copy(tablet.position);
  back.lookAt(0, 1.55, 0);
  back.translateZ(-0.08);
  scene.add(back, tablet);
  clickables.push(tablet);

  const pathMat = new THREE.MeshLambertMaterial({ color: 0x161e1c });
  [
    [0, -15.2],
    [0, 15.2],
    [-15.2, 0],
    [15.2, 0]
  ].forEach((end) => {
    const path = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 13.4), pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(end[0] * 0.5, 0.015, end[1] * 0.5);
    if (end[0] !== 0) path.rotation.z = Math.PI / 2;
    scene.add(path);
  });

  addHills();

  PLACES.forEach((place) => {
    if (place.id === "credentials") addCredentials(place);
    else if (place.id === "ground") addGroundWell(place);
    else addStele(place);
  });
}

async function populatePieces() {
  const [guideTex, artTex, copperTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/art/neahkahnie.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg")
  ]);

  if (guideTex) {
    const guide = imagePlane(guideTex, 3.4);
    guide.position.set(-5.4, 2.15, -7.2);
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
    label.position.set(-5.4, 4.3, -7.2);
    scene.add(label);
  }

  if (artTex) {
    const art = imagePlane(artTex, 3.2);
    art.position.set(5.6, 2.15, -8.4);
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
    label.position.set(5.6, 4.2, -8.4);
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
    stand.position.set(6.8, 0, -4.6);
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
    label.position.set(6.8, 3.7, -4.6);
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
  renderer.render(scene, camera);
}

function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x12181c);
  scene.fog = new THREE.FogExp2(0x141c1e, 0.011);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 800);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.add(new THREE.AmbientLight(0x7a8c84, 0.42));
  scene.add(new THREE.HemisphereLight(0xc4b08a, 0x141c18, 0.58));
  const key = new THREE.DirectionalLight(0xf0d4a0, 0.72);
  key.position.set(-28, 20, 10);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x6a8890, 0.22);
  fill.position.set(24, 12, -8);
  scene.add(fill);

  buildField();
  bindInput();
  applyCamera();
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
