/* Graphic Oregon — origin-centered walkable field */

const ink = 0x1a1e1a;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const paper = 0xe8efe8;
const Nav = window.FieldNav;
const PIXEL_RATIO = 1.25;
const DUSK = 0x1c211e;

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

function clampByte(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function grainTexture(hex, grain, size) {
  const n = size || 256;
  const c = document.createElement("canvas");
  c.width = n;
  c.height = n;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(n, n);
  const d = img.data;
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  for (let i = 0, p = 0; i < n * n; i++, p += 4) {
    const x = i % n;
    const y = (i / n) | 0;
    const wave = (Math.sin(x * 0.11) + Math.cos(y * 0.09) + Math.sin((x + y) * 0.05)) * grain * 0.22;
    const speckle = (Math.random() - 0.5) * grain;
    const k = wave + speckle;
    d[p] = clampByte(r + k);
    d[p + 1] = clampByte(g + k * 0.9);
    d[p + 2] = clampByte(b + k * 0.72);
    d[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function surfaceMat(hex, opts) {
  const o = opts || {};
  const map = grainTexture(hex, o.grain == null ? 20 : o.grain);
  map.repeat.set(o.repeat == null ? 3 : o.repeat, o.repeat == null ? 3 : o.repeat);
  return new THREE.MeshStandardMaterial({
    map: map,
    color: o.tint == null ? 0xffffff : o.tint,
    roughness: o.roughness == null ? 0.88 : o.roughness,
    metalness: o.metalness == null ? 0.03 : o.metalness,
    side: o.side == null ? THREE.FrontSide : o.side
  });
}

const PLASTER = surfaceMat(0xc6c2b6, { repeat: 8, grain: 18, roughness: 0.92 });
const FLOOR = surfaceMat(0x8a8170, { repeat: 10, grain: 16, roughness: 0.86, metalness: 0.04 });
const WOOD = surfaceMat(0x5a4a38, { repeat: 2, grain: 14, roughness: 0.72, metalness: 0.06 });
const FRAME = surfaceMat(0x3a342c, { repeat: 1, grain: 10, roughness: 0.55, metalness: 0.12 });
const BRASS = new THREE.MeshStandardMaterial({
  color: 0xb08a46,
  roughness: 0.42,
  metalness: 0.55
});
const INLAY = new THREE.MeshStandardMaterial({
  color: 0x3d5c58,
  roughness: 0.48,
  metalness: 0.18
});

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
  ctx.fillStyle = "rgba(28, 26, 22, 0.42)";
  roundRect(ctx, 28, 32, w - 56, h - 64, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(176, 138, 70, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#d8c8a4";
  ctx.font = "500 36px Georgia, serif";
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

function addVolume(marker) {
  const wash = new THREE.Color(0xc2beb2).lerp(new THREE.Color(marker.color), 0.22);
  const mat = surfaceMat(0xb8b4a8, {
    repeat: 2,
    grain: 16,
    roughness: 0.9,
    tint: wash.getHex()
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.35, 1.7), mat);
  mesh.position.set(marker.pos[0], marker.pos[1], marker.pos[2]);
  mesh.userData = {
    title: marker.title,
    body: marker.body,
    href: marker.href,
    linkLabel: "Open graphicoregon.com"
  };
  scene.add(mesh);
  clickables.push(mesh);
  const label = makeLabel(marker.title, 4.6);
  label.position.set(marker.pos[0], marker.pos[1] + 1.85, marker.pos[2]);
  scene.add(label);
}

function framedPiece(tex, height, withBoard) {
  const img = tex.image;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const w = height * aspect;
  const h = height;
  const group = new THREE.Group();
  if (withBoard !== false) {
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.95, h + 1.15, 0.14),
      PLASTER
    );
    board.position.z = -0.12;
    group.add(board);
  }
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.06),
    FRAME
  );
  frame.position.z = -0.03;
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshLambertMaterial({
      map: tex,
      emissive: 0xffffff,
      emissiveMap: tex,
      emissiveIntensity: 0.38,
      side: THREE.DoubleSide
    })
  );
  pic.position.z = 0.02;
  group.add(frame, pic);
  return { group: group, pic: pic };
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
  FLOOR.side = THREE.DoubleSide;
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(13.4, 72), FLOOR);
  plaza.rotation.x = -Math.PI / 2;
  scene.add(plaza);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(13.35, 0.045, 10, 72),
    INLAY
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  const origin = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 18), BRASS);
  origin.position.y = 0.12;
  origin.userData = {
    title: "Origin",
    body: "The field opens from here. Art, research, writing, and website work sit out from this floor.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  };
  scene.add(origin);
  clickables.push(origin);
  const originLabel = makeLabel("Graphic Oregon", 5.8);
  originLabel.position.set(0, 2.35, -3.2);
  scene.add(originLabel);

  MARKERS.forEach(addVolume);
}

async function populatePieces() {
  const [guideTex, artTex, copperTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/art/neahkahnie.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg")
  ]);

  if (guideTex) {
    const hung = framedPiece(guideTex, 3.4);
    hung.group.position.set(-5.4, 2.15, -7.2);
    faceOrigin(hung.group);
    hung.pic.userData = {
      title: "Giving Guide 2022–23",
      body: "Cover of the 2022–23 Giving Guide print.",
      href: "https://graphicoregon.com/",
      linkLabel: "Open graphicoregon.com"
    };
    scene.add(hung.group);
    clickables.push(hung.pic);
    const label = makeLabel("Giving Guide", 4.4);
    label.position.set(-5.4, 4.35, -7.2);
    scene.add(label);
  }

  if (artTex) {
    const hung = framedPiece(artTex, 3.2);
    hung.group.position.set(5.6, 2.15, -8.4);
    faceOrigin(hung.group);
    hung.pic.userData = {
      title: "Neahkahnie",
      body: "Coast work from the studio.",
      href: "https://graphicoregon.com/sample-page/",
      linkLabel: "Open the studio page"
    };
    scene.add(hung.group);
    clickables.push(hung.pic);
    const label = makeLabel("Neahkahnie", 4.2);
    label.position.set(5.6, 4.25, -8.4);
    scene.add(label);
  }

  if (copperTex) {
    const stand = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.2, 0.62), WOOD);
    post.position.y = 0.6;
    const hung = framedPiece(copperTex, 2.5, false);
    hung.group.position.set(0, 2.05, 0);
    stand.add(post, hung.group);
    stand.position.set(6.8, 0, -4.6);
    stand.lookAt(0, stand.position.y, 0);
    hung.pic.userData = {
      title: "Copper Horizon ocean graphic tee",
      body: "A single stand on the field.",
      href: COPPER_HREF,
      linkLabel: "Open Copper Horizon",
      openUrl: COPPER_HREF
    };
    scene.add(stand);
    clickables.push(hung.pic);
    const label = makeLabel("Copper Horizon", 4.6);
    label.position.set(6.8, 3.85, -4.6);
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
  scene.background = new THREE.Color(DUSK);
  scene.fog = new THREE.FogExp2(DUSK, 0.018);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 800);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  scene.add(new THREE.AmbientLight(0xc8c4b6, 0.48));
  scene.add(new THREE.HemisphereLight(0xf2efe4, 0x3a4038, 1.12));
  const key = new THREE.DirectionalLight(0xf3efe4, 1.35);
  key.position.set(8, 16, 10);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8e0dc, 0.42);
  fill.position.set(-14, 9, -6);
  scene.add(fill);

  buildField();
  bindInput();
  applyCamera();
  showPanel({
    meta: "Graphic Oregon",
    title: "Origin",
    body: "The field opens from here. Art, research, writing, and website work sit out from this floor.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  });
  document.getElementById("loader").classList.add("hide");
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
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
