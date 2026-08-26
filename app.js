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
const STARIS_HREF = "https://staris-b01f2.firebaseapp.com";

const MARKERS = [
  { id: "art", title: "Art", pos: [-22, 1.4, 0], color: gold, href: "https://graphicoregon.com/sample-page/", body: "Oil, acrylic, charcoal, and prints." },
  { id: "research", title: "Research", pos: [22, 1.4, 0], color: teal, href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/", body: "Mapping and habitat studies." },
  { id: "writing", title: "Writing", pos: [0, 1.4, 22], color: teal, href: "https://graphicoregon.com/", body: "Journalism and media." },
  { id: "websites", title: "Websites", pos: [0, 1.4, -22], color: gold, href: "https://graphicoregon.com/", body: "Website design." },
  { id: "credentials", title: "Credentials", pos: [0, 16, 0], color: teal, href: "https://graphicoregon.com/", body: "Education and practice." },
  { id: "ground", title: "Ground", pos: [0, -12, 0], color: 0x4a5a58, href: "https://graphicoregon.com/", body: "The field continues below." }
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

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function canvasTex(paint, size) {
  const n = size || 512;
  const c = document.createElement("canvas");
  c.width = n;
  c.height = n;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(n, n);
  paint(img.data, n);
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function plasterMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const blot = (hash2(x / 42, y / 36) - 0.5) * 14;
      const fine = (hash2(x * 1.7, y * 1.3) - 0.5) * 9;
      const k = blot + fine;
      d[p] = clampByte(196 + k);
      d[p + 1] = clampByte(191 + k * 0.92);
      d[p + 2] = clampByte(178 + k * 0.7);
      d[p + 3] = 255;
    }
  });
}

function oakMap() {
  return canvasTex((d, n) => {
    const plank = 34;
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const id = (y / plank) | 0;
      const seam = y % plank < 1 ? -22 : 0;
      const stain = (hash2(id, 4.2) - 0.5) * 26;
      const grain = (hash2(x * 0.11, id * 3.1) - 0.5) * 12;
      const pore = (hash2(x * 2.3, y * 1.1) - 0.5) * 6;
      const k = stain + grain + pore + seam;
      d[p] = clampByte(122 + k);
      d[p + 1] = clampByte(108 + k * 0.88);
      d[p + 2] = clampByte(86 + k * 0.62);
      d[p + 3] = 255;
    }
  });
}

function woodBlockMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const k = (hash2(x * 0.2, y * 1.4) - 0.5) * 18 + (hash2(x, y) - 0.5) * 7;
      d[p] = clampByte(86 + k);
      d[p + 1] = clampByte(70 + k * 0.85);
      d[p + 2] = clampByte(52 + k * 0.6);
      d[p + 3] = 255;
    }
  }, 256);
}

function surfaceMat(map, opts) {
  const o = opts || {};
  const tex = map && typeof map.clone === "function" ? map.clone() : map;
  if (tex && tex.repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(o.repeat == null ? 1 : o.repeat, o.ry == null ? (o.repeat == null ? 1 : o.repeat) : o.ry);
  }
  return new THREE.MeshStandardMaterial({
    map: tex && tex.isTexture ? tex : null,
    color: o.tint == null ? 0xffffff : o.tint,
    roughness: o.roughness == null ? 0.88 : o.roughness,
    metalness: o.metalness == null ? 0.03 : o.metalness,
    side: o.side == null ? THREE.FrontSide : o.side
  });
}

const PLASTER = surfaceMat(plasterMap(), { repeat: 2, ry: 1.1, roughness: 0.93 });
const FLOOR = surfaceMat(oakMap(), { repeat: 2, ry: 2, roughness: 0.78, metalness: 0.04 });
const WOOD = surfaceMat(woodBlockMap(), { repeat: 1, roughness: 0.7, metalness: 0.05 });
const FRAME = surfaceMat(woodBlockMap(), { repeat: 1, roughness: 0.52, metalness: 0.1 });
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

function shade(mesh, cast, receive) {
  mesh.castShadow = !!cast;
  mesh.receiveShadow = receive !== false;
  return mesh;
}

function makeLabel(text, scale, pinned) {
  const w = 512;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(36, 32, 26, 0.55)";
  roundRect(ctx, 36, 38, w - 72, h - 76, 3);
  ctx.fill();
  ctx.strokeStyle = "rgba(160, 128, 72, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#d4c6a4";
  ctx.font = "500 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(scale || 4.2, (scale || 4.2) * 0.25),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  );
  if (!pinned) {
    mesh.userData.billboard = true;
    billboards.push(mesh);
  }
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
  const mat = surfaceMat(plasterMap(), {
    repeat: 2,
    ry: 1.1,
    roughness: 0.9,
    tint: wash.getHex()
  });
  const mesh = shade(new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.35, 1.7), mat), true, true);
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
    const board = shade(new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.95, h + 1.15, 0.14),
      PLASTER
    ), true, true);
    board.position.z = -0.12;
    group.add(board);
  }
  const frame = shade(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.06),
    FRAME
  ), true, true);
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

function updatePoseHud() {}

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
  });
  document.addEventListener("mousemove", (e) => {
    if (!lookLocked) return;
    const next = Nav.applyLook(yaw, pitch, e.movementX, e.movementY);
    yaw = next.yaw;
    pitch = next.pitch;
  });

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
  const plaza = shade(new THREE.Mesh(new THREE.CircleGeometry(13.4, 72), FLOOR), false, true);
  plaza.rotation.x = -Math.PI / 2;
  scene.add(plaza);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(13.35, 0.04, 10, 72),
    INLAY
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  const wall = shade(new THREE.Mesh(new THREE.BoxGeometry(22, 5.5, 0.28), PLASTER), true, true);
  wall.position.set(0, 2.75, -9.55);
  scene.add(wall);

  const ceiling = shade(new THREE.Mesh(new THREE.BoxGeometry(22, 0.16, 18.4), PLASTER), false, true);
  ceiling.position.set(0, 5.56, -0.35);
  scene.add(ceiling);

  const title = makeLabel("Graphic Oregon", 4.4, true);
  title.position.set(0, 5.05, -9.38);
  scene.add(title);

  MARKERS.forEach(addVolume);
}


async function populateStarIS() {
  let rows = [];
  try {
    const res = await fetch("assets/staris/stars.json");
    rows = await res.json();
  } catch (err) {
    return;
  }
  if (!Array.isArray(rows) || !rows.length) return;
  const origin = { x: 16.2, y: 3.1, z: 0 };
  const posArr = [];
  const col = [];
  const tealC = new THREE.Color(teal);
  const goldC = new THREE.Color(gold);
  const sc = 0.08;
  rows.forEach((s) => {
    if (!s || (s.x === 0 && s.y === 0 && s.z === 0)) return;
    posArr.push(s.x * sc + origin.x, s.y * sc + origin.y, s.z * sc + origin.z);
    const tcol = Math.min(1, Math.max(0, (2.2 - (s.mag || 5)) / 7));
    const c = goldC.clone().lerp(tealC, 1 - tcol);
    col.push(c.r, c.g, c.b);
  });
  if (!posArr.length) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(posArr, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  const data = {
    title: "StarIS",
    body: "Star Visualizer on the field.",
    href: STARIS_HREF,
    linkLabel: "Open StarIS",
    openUrl: STARIS_HREF
  };
  const pts = new THREE.Points(
    g,
    new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      depthWrite: false
    })
  );
  pts.userData = data;
  scene.add(pts);
  clickables.push(pts);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.035, 8, 64),
    INLAY
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.set(origin.x, 0.04, origin.z);
  rim.userData = data;
  scene.add(rim);
  clickables.push(rim);
}

async function populatePieces() {
  const [guideTex, artTex, copperTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/art/neahkahnie.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg")
  ]);

  if (guideTex) {
    const hung = framedPiece(guideTex, 3.4, false);
    hung.group.position.set(-5.2, 2.45, -9.36);
    hung.pic.userData = {
      title: "Giving Guide 2022–23",
      body: "Cover of the 2022–23 Giving Guide print.",
      href: "https://graphicoregon.com/",
      linkLabel: "Open graphicoregon.com"
    };
    scene.add(hung.group);
    clickables.push(hung.pic);
    const label = makeLabel("Giving Guide", 3.6, true);
    label.position.set(-5.2, 0.62, -9.36);
    scene.add(label);
  }

  if (artTex) {
    const hung = framedPiece(artTex, 3.2, false);
    hung.group.position.set(5.3, 2.45, -9.36);
    hung.pic.userData = {
      title: "Neahkahnie",
      body: "Coast work from the studio.",
      href: "https://graphicoregon.com/sample-page/",
      linkLabel: "Open the studio page"
    };
    scene.add(hung.group);
    clickables.push(hung.pic);
    const label = makeLabel("Neahkahnie", 3.4, true);
    label.position.set(5.3, 0.62, -9.36);
    scene.add(label);
  }

  if (copperTex) {
    const stand = new THREE.Group();
    const post = shade(new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.2, 0.62), WOOD), true, true);
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

  await populateStarIS();
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
  scene.fog = new THREE.FogExp2(DUSK, 0.026);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 800);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.AmbientLight(0xc4c0b2, 0.38));
  scene.add(new THREE.HemisphereLight(0xf0ece2, 0x3a3c36, 0.72));
  const key = new THREE.DirectionalLight(0xf4efe4, 1.85);
  key.position.set(5.5, 4.4, 3.8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 36;
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 10;
  key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0008;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8ddd8, 0.38);
  fill.position.set(-10, 5.5, -3);
  scene.add(fill);

  buildField();
  bindInput();
  applyCamera();
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
