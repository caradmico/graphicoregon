/* Graphic Oregon — origin-centered walkable field */

const ink = 0x1a1e1a;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const paper = 0xe8efe8;
const Nav = window.FieldNav;
const PIXEL_RATIO = 1.25;
const DUSK = 0x1a2422;
const FOG = 0x24302c;

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
      const blot = (hash2(x / 42, y / 36) - 0.5) * 18;
      const fine = (hash2(x * 1.7, y * 1.3) - 0.5) * 10;
      const salt = hash2(x / 80, y / 64) > 0.72 ? 12 : 0;
      const k = blot + fine + salt;
      d[p] = clampByte(164 + k);
      d[p + 1] = clampByte(162 + k * 0.94);
      d[p + 2] = clampByte(152 + k * 0.72);
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
      const seam = y % plank < 1 ? -26 : 0;
      const stain = (hash2(id, 4.2) - 0.5) * 28;
      const grain = (hash2(x * 0.11, id * 3.1) - 0.5) * 14;
      const pore = (hash2(x * 2.3, y * 1.1) - 0.5) * 7;
      const k = stain + grain + pore + seam;
      d[p] = clampByte(112 + k);
      d[p + 1] = clampByte(98 + k * 0.88);
      d[p + 2] = clampByte(74 + k * 0.58);
      d[p + 3] = 255;
    }
  });
}

function fieldMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const blot = (hash2(x / 28, y / 34) - 0.5) * 22;
      const wet = hash2(x / 90, y / 70) > 0.64 ? -20 : 0;
      const grit = (hash2(x * 1.9, y * 1.6) - 0.5) * 11;
      const k = blot + wet + grit;
      d[p] = clampByte(78 + k * 0.7);
      d[p + 1] = clampByte(84 + k * 0.86);
      d[p + 2] = clampByte(68 + k * 0.52);
      d[p + 3] = 255;
    }
  });
}

function basaltMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const k = (hash2(x / 18, y / 16) - 0.5) * 20 + (hash2(x * 2.1, y * 1.8) - 0.5) * 9;
      d[p] = clampByte(68 + k);
      d[p + 1] = clampByte(70 + k * 0.92);
      d[p + 2] = clampByte(66 + k * 0.8);
      d[p + 3] = 255;
    }
  }, 256);
}

function bumpMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const k = clampByte(128 + (hash2(x / 12, y / 10) - 0.5) * 70 + (hash2(x * 2.4, y * 2.1) - 0.5) * 36);
      d[p] = k;
      d[p + 1] = k;
      d[p + 2] = k;
      d[p + 3] = 255;
    }
  }, 256);
}

function skyTex() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 512;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#0d1214");
  g.addColorStop(0.34, "#1a2424");
  g.addColorStop(0.5, "#5a6454");
  g.addColorStop(0.56, "#3e4a40");
  g.addColorStop(1, "#1c221c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  return tex;
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
  const bump = o.bump && typeof o.bump.clone === "function" ? o.bump.clone() : o.bump;
  if (bump && bump.repeat) {
    bump.wrapS = THREE.RepeatWrapping;
    bump.wrapT = THREE.RepeatWrapping;
    bump.repeat.set(o.repeat == null ? 1 : o.repeat, o.ry == null ? (o.repeat == null ? 1 : o.repeat) : o.ry);
  }
  return new THREE.MeshStandardMaterial({
    map: tex && tex.isTexture ? tex : null,
    bumpMap: bump && bump.isTexture ? bump : null,
    bumpScale: o.bumpScale == null ? 0 : o.bumpScale,
    color: o.tint == null ? 0xffffff : o.tint,
    roughness: o.roughness == null ? 0.88 : o.roughness,
    metalness: o.metalness == null ? 0.03 : o.metalness,
    side: o.side == null ? THREE.FrontSide : o.side
  });
}

const BUMP = bumpMap();
const PLASTER = surfaceMat(plasterMap(), { repeat: 2, ry: 1.1, roughness: 0.94, bump: BUMP, bumpScale: 0.045 });
const CEILING = surfaceMat(plasterMap(), { repeat: 2, ry: 1.4, roughness: 0.97, tint: 0xa8a49c, bump: BUMP, bumpScale: 0.03 });
const FLOOR = surfaceMat(oakMap(), { repeat: 2, ry: 2, roughness: 0.74, metalness: 0.05, bump: BUMP, bumpScale: 0.06 });
const FIELD = surfaceMat(fieldMap(), { repeat: 14, roughness: 0.86, metalness: 0.05, bump: BUMP, bumpScale: 0.09 });
const WOOD = surfaceMat(woodBlockMap(), { repeat: 1, roughness: 0.68, metalness: 0.06, bump: BUMP, bumpScale: 0.05 });
const FRAME = surfaceMat(woodBlockMap(), { repeat: 1, roughness: 0.48, metalness: 0.12, bump: BUMP, bumpScale: 0.04 });
const INLAY = new THREE.MeshStandardMaterial({
  color: 0x3d5c58,
  roughness: 0.42,
  metalness: 0.28
});
const PAD = new THREE.MeshStandardMaterial({
  color: 0x2c3430,
  roughness: 0.38,
  metalness: 0.36
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
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (pinned) {
    ctx.shadowColor = "rgba(12, 14, 12, 0.55)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#c4b48a";
    ctx.font = "500 40px Georgia, serif";
    ctx.fillText(text, w / 2, h / 2);
  } else {
    ctx.fillStyle = "rgba(22, 24, 20, 0.38)";
    roundRect(ctx, 48, 44, w - 96, h - 88, 2);
    ctx.fill();
    ctx.fillStyle = "#c8bea4";
    ctx.font = "500 30px Georgia, serif";
    ctx.fillText(text, w / 2, h / 2);
  }
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
  const wash = new THREE.Color(0x8a8880).lerp(new THREE.Color(marker.color), 0.16);
  const mat = surfaceMat(basaltMap(), {
    repeat: 1,
    roughness: 0.86,
    metalness: 0.08,
    tint: wash.getHex(),
    bump: BUMP,
    bumpScale: 0.07
  });
  const mesh = shade(new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.2, 1.55), mat), true, true);
  mesh.position.set(marker.pos[0], marker.pos[1], marker.pos[2]);
  mesh.userData = {
    title: marker.title,
    body: marker.body,
    href: marker.href,
    linkLabel: "Open graphicoregon.com"
  };
  scene.add(mesh);
  clickables.push(mesh);
  const label = makeLabel(marker.title, 4.2);
  label.position.set(marker.pos[0], marker.pos[1] + 1.72, marker.pos[2]);
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
    new THREE.BoxGeometry(w + 0.2, h + 0.2, 0.08),
    FRAME
  ), true, true);
  frame.position.z = -0.03;
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0xffffff,
      emissiveMap: tex,
      emissiveIntensity: 0.22,
      side: THREE.DoubleSide
    })
  );
  pic.position.z = 0.03;
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
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 20),
    new THREE.MeshBasicMaterial({ map: skyTex(), side: THREE.BackSide, fog: false, depthWrite: false })
  );
  scene.add(sky);

  FIELD.side = THREE.DoubleSide;
  const field = shade(new THREE.Mesh(new THREE.CircleGeometry(210, 80), FIELD), false, true);
  field.rotation.x = -Math.PI / 2;
  field.position.y = -0.05;
  scene.add(field);

  FLOOR.side = THREE.DoubleSide;
  const plaza = shade(new THREE.Mesh(new THREE.CircleGeometry(13.4, 72), FLOOR), false, true);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.02;
  scene.add(plaza);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(13.35, 0.045, 10, 72),
    INLAY
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.03;
  scene.add(ring);

  const wall = shade(new THREE.Mesh(new THREE.BoxGeometry(22, 5.5, 0.28), PLASTER), true, true);
  wall.position.set(0, 2.75, -9.55);
  scene.add(wall);

  const ceiling = shade(new THREE.Mesh(new THREE.BoxGeometry(22, 0.16, 18.4), CEILING), false, true);
  ceiling.position.set(0, 5.56, -0.35);
  scene.add(ceiling);

  const title = makeLabel("Graphic Oregon", 5.2, true);
  title.position.set(0, 5.02, -9.38);
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
      size: 0.13,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  pts.userData = data;
  scene.add(pts);
  clickables.push(pts);
  const disc = shade(new THREE.Mesh(new THREE.CircleGeometry(4.25, 64), PAD), false, true);
  disc.rotation.x = -Math.PI / 2;
  disc.position.set(origin.x, 0.035, origin.z);
  disc.userData = data;
  scene.add(disc);
  clickables.push(disc);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.04, 8, 64),
    new THREE.MeshStandardMaterial({
      color: 0x3d5c58,
      roughness: 0.36,
      metalness: 0.42,
      emissive: teal,
      emissiveIntensity: 0.12
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.set(origin.x, 0.05, origin.z);
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
  scene.fog = new THREE.FogExp2(FOG, 0.011);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 800);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.AmbientLight(0x9aa298, 0.28));
  scene.add(new THREE.HemisphereLight(0xd0ccbc, 0x3a4238, 0.64));
  const key = new THREE.DirectionalLight(0xf2d8a8, 1.18);
  key.position.set(-10, 16, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 48;
  key.shadow.camera.left = -20;
  key.shadow.camera.right = 20;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -12;
  key.shadow.bias = -0.0008;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa8b8b4, 0.32);
  fill.position.set(8, 6, -10);
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
