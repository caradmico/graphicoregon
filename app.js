/* Graphic Oregon — a coastal clearing you can leave */

const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const Nav = window.FieldNav;
const World = window.MuseumData;
const PIXEL_RATIO = 1.25;
const DUSK = 0x3d2a1c;
const HAZE = 0x7a5230;

const BOUNDS = 220;
const EYE = 1.7;
const MOVE = 9;
const MOVE_FAST = 16;
const TURN = 1.7;
const COPPER_HREF = "https://sassmeharder.com/product/30931683?utm_source=pinterest&utm_medium=organic&utm_campaign=copper-horizon&utm_content=2026-08-21";
const STARIS_HREF = "https://staris-b01f2.firebaseapp.com";
const ART_HREF = "https://graphicoregon.com/sample-page/";
const RESEARCH_HREF = "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/";
const HOME_HREF = "https://graphicoregon.com/";

const WALKS = [
  { id: "art", title: "Art", pos: [-36, 2.4, -2], href: ART_HREF, body: "The museum is bigger than the door." },
  { id: "research", title: "Research", pos: [34, 2.2, 2], href: RESEARCH_HREF, body: "Mapping and habitat studies." },
  { id: "writing", title: "Writing", pos: [0, 2.1, 34], href: HOME_HREF, body: "Journalism and media." },
  { id: "websites", title: "Websites", pos: [0, 2.2, -36], href: HOME_HREF, body: "Website design." },
  { id: "credentials", title: "Credentials", pos: [0, 26, 0], href: HOME_HREF, body: "Education and practice." },
  { id: "ground", title: "Ground", pos: [0, -10, 0], href: HOME_HREF, body: "The field continues below." }
];

let scene, camera, renderer;
let yaw = -0.38;
let pitch = -0.08;
let dragging = false;
let lookLocked = false;
let lastX = 0;
let lastY = 0;
let downX = 0;
let downY = 0;
const held = Nav.emptyHeld();
const pos = { x: 0, y: EYE, z: 0 };
const look = { x: 0, y: 0, z: -1 };
const clickables = [];
const billboards = [];
const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();
let room = "forest";
let paperOpen = false;
let paperGiven = false;
let museumArtHung = 0;
let lastXz = { x: pos.x, z: pos.z };
let newsieGroup = null;
let forestPortalMesh = null;
let museumPortalMesh = null;
let portalTarget = null;
let portalCam = null;
let wipeTimer = 0;
let hintText = "";
const PLASTER = new THREE.MeshStandardMaterial({
  color: 0xc8b89a,
  roughness: 0.92,
  metalness: 0.04
});
const TEAL_BLOCK = new THREE.MeshStandardMaterial({
  color: teal,
  roughness: 0.46,
  metalness: 0.18
});
const GOLD_BLOCK = new THREE.MeshStandardMaterial({
  color: gold,
  roughness: 0.4,
  metalness: 0.28
});

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

function earthMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const blot = (hash2(x / 38, y / 44) - 0.5) * 22;
      const blade = (hash2(x * 1.9, y * 0.35) - 0.5) * 16;
      const grit = (hash2(x * 2.4, y * 2.1) - 0.5) * 8;
      const k = blot + blade + grit;
      d[p] = clampByte(78 + k * 0.55);
      d[p + 1] = clampByte(96 + k);
      d[p + 2] = clampByte(58 + k * 0.4);
      d[p + 3] = 255;
    }
  });
}

function skyMap() {
  const tex = canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const t = ((i / n) | 0) / (n - 1);
      let r;
      let g;
      let b;
      if (t < 0.56) {
        const u = t / 0.56;
        const s = u * u;
        r = 28 + (228 - 28) * s;
        g = 32 + (142 - 32) * s;
        b = 48 + (78 - 48) * s;
      } else {
        const u = (t - 0.56) / 0.44;
        r = 228 + (62 - 228) * u;
        g = 142 + (52 - 142) * u;
        b = 78 + (44 - 78) * u;
      }
      d[p] = clampByte(r);
      d[p + 1] = clampByte(g);
      d[p + 2] = clampByte(b);
      d[p + 3] = 255;
    }
  }, 512);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

function rockMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const k = (hash2(x / 18, y / 14) - 0.5) * 28 + (hash2(x, y) - 0.5) * 10;
      d[p] = clampByte(78 + k);
      d[p + 1] = clampByte(58 + k * 0.7);
      d[p + 2] = clampByte(46 + k * 0.5);
      d[p + 3] = 255;
    }
  }, 256);
}

function timberMap() {
  return canvasTex((d, n) => {
    const plank = 36;
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const id = (y / plank) | 0;
      const seam = y % plank < 1 ? -18 : 0;
      const stain = (hash2(id, 3.4) - 0.5) * 22;
      const grain = (hash2(x * 0.13, id * 2.8) - 0.5) * 11;
      const k = stain + grain + seam;
      d[p] = clampByte(96 + k);
      d[p + 1] = clampByte(78 + k * 0.82);
      d[p + 2] = clampByte(54 + k * 0.55);
      d[p + 3] = 255;
    }
  }, 256);
}

function waterMap() {
  return canvasTex((d, n) => {
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const swell = Math.sin(x * 0.08 + y * 0.03) * 10;
      const k = swell + (hash2(x * 0.4, y * 1.6) - 0.5) * 12;
      d[p] = clampByte(22 + k * 0.4);
      d[p + 1] = clampByte(58 + k);
      d[p + 2] = clampByte(72 + k * 0.7);
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
    side: o.side == null ? THREE.FrontSide : o.side,
    transparent: !!o.transparent,
    opacity: o.opacity == null ? 1 : o.opacity
  });
}

const EARTH = surfaceMat(earthMap(), { repeat: 18, ry: 18, roughness: 0.96, side: THREE.DoubleSide });
const ROCK = surfaceMat(rockMap(), { repeat: 2, roughness: 0.9, metalness: 0.06 });
const TIMBER = surfaceMat(timberMap(), { repeat: 1, roughness: 0.72, metalness: 0.04 });
const FRAME = surfaceMat(timberMap(), { repeat: 1, roughness: 0.55, metalness: 0.08 });
const WATER = surfaceMat(waterMap(), { repeat: 10, ry: 4, roughness: 0.28, metalness: 0.22 });
const RING = new THREE.MeshStandardMaterial({
  color: 0x8a6a38,
  roughness: 0.55,
  metalness: 0.18
});
const NEEDLE = new THREE.MeshStandardMaterial({
  color: 0x1f2a22,
  roughness: 0.86,
  metalness: 0.04
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

function heightAt(x, z) {
  const r = Math.hypot(x, z);
  const flatten = Math.min(1, Math.max(0, (r - 7) / 22));
  const hills = Math.sin(x * 0.042 + 0.4) * Math.cos(z * 0.036) * 2.35
    + Math.sin(x * 0.11 + z * 0.08) * 0.7;
  const west = x < -16
    ? ((-16 - x) / 46) * 3.6 * Math.max(0, 1 - Math.abs(z) / 56)
    : 0;
  return hills * flatten + west;
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

function billboard(obj, label, kind) {
  obj.userData.billboard = true;
  if (label) obj.userData.label = label;
  if (kind) obj.userData.kind = kind;
  billboards.push(obj);
  return obj;
}

function makeSign(text, scale) {
  const w = 640;
  const h = 160;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(22, 18, 12, 0.58)";
  roundRect(ctx, 28, 32, w - 56, h - 64, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(200, 160, 82, 0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ead7a4";
  ctx.font = "500 44px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(scale || 5.2, (scale || 5.2) * 0.25),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  return billboard(mesh, text, "sign");
}

function faceCenter(obj) {
  obj.lookAt(0, obj.position.y, 0);
}

function addClick(mesh, data) {
  Object.assign(mesh.userData, data);
  clickables.push(mesh);
}

function framedPiece(tex, height) {
  const img = tex.image;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const w = height * aspect;
  const h = height;
  const group = new THREE.Group();
  const frame = shade(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.07),
    FRAME
  ), true, true);
  frame.position.z = -0.03;
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshLambertMaterial({
      map: tex,
      emissive: 0xffffff,
      emissiveMap: tex,
      emissiveIntensity: 0.32,
      side: THREE.DoubleSide
    })
  );
  pic.position.z = 0.02;
  group.add(frame, pic);
  return { group: group, pic: pic, width: w, height: h };
}

function easelAt(x, z, hung, data, label, labelScale) {
  const y = heightAt(x, z);
  const stand = new THREE.Group();
  const post = shade(new THREE.Mesh(new THREE.BoxGeometry(0.18, hung.height + 0.7, 0.18), TIMBER), true, true);
  post.position.y = (hung.height + 0.7) / 2;
  const rail = shade(new THREE.Mesh(new THREE.BoxGeometry(hung.width + 0.4, 0.1, 0.16), TIMBER), true, true);
  rail.position.y = 0.34;
  hung.group.position.set(0, hung.height * 0.5 + 0.55, 0.08);
  stand.add(post, rail, hung.group);
  stand.position.set(x, y, z);
  faceCenter(stand);
  billboard(stand, label, "print");
  addClick(hung.pic, data);
  scene.add(stand);
  const sign = makeSign(label, labelScale || 4.4);
  sign.position.set(x, y + hung.height + 1.15, z);
  scene.add(sign);
  return stand;
}

function fir(x, z, h) {
  const y = heightAt(x, z);
  const g = new THREE.Group();
  const trunk = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, h * 0.28, 6), TIMBER), true, true);
  trunk.position.y = h * 0.14;
  const crown = shade(new THREE.Mesh(new THREE.ConeGeometry(h * 0.28, h * 0.82, 7), NEEDLE), true, true);
  crown.position.y = h * 0.58;
  g.add(trunk, crown);
  g.position.set(x, y, z);
  scene.add(g);
}

function boulder(x, z, w, h, d) {
  const y = heightAt(x, z);
  const rock = shade(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ROCK), true, true);
  rock.position.set(x, y + h * 0.42, z);
  rock.rotation.y = hash2(x, z) * Math.PI;
  scene.add(rock);
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

function setHint(text) {
  hintText = text || "";
  const el = document.getElementById("hint");
  if (!el) return;
  if (!hintText) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  el.hidden = false;
  el.textContent = hintText;
}

function hidePaper() {
  paperOpen = false;
  const el = document.getElementById("paper");
  if (el) el.hidden = true;
}

function linkEl(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = text;
  return a;
}

function fillPaper() {
  const root = document.getElementById("paper-body");
  if (!root || root.childNodes.length) return;
  const lead = World.PAPER_LEAD;
  const leadBox = document.createElement("section");
  leadBox.className = "paper-lead";
  const kicker = document.createElement("div");
  kicker.className = "paper-kicker";
  kicker.textContent = lead.kicker;
  const h2 = document.createElement("h2");
  h2.appendChild(linkEl(lead.href, lead.title));
  const by = document.createElement("p");
  by.className = "byline";
  by.textContent = lead.byline;
  const dek = document.createElement("p");
  dek.className = "dek";
  dek.textContent = lead.dek;
  leadBox.append(kicker, h2, by, dek);

  const grid = document.createElement("div");
  grid.className = "paper-grid";
  const feat = document.createElement("div");
  World.PAPER_FEATURES.forEach((story) => {
    const col = document.createElement("div");
    col.className = "paper-col";
    const k = document.createElement("div");
    k.className = "paper-kicker";
    k.textContent = story.kicker;
    const h3 = document.createElement("h3");
    h3.appendChild(linkEl(story.href, story.title));
    const p = document.createElement("p");
    p.textContent = story.dek;
    col.append(k, h3, p);
    feat.appendChild(col);
  });
  const side = document.createElement("div");
  const sk = document.createElement("div");
  sk.className = "paper-kicker";
  sk.textContent = "Seaside Signal · 2019";
  const list = document.createElement("div");
  list.className = "paper-signal";
  World.PAPER_SIGNAL.forEach((row) => {
    list.appendChild(linkEl(row[1], row[0]));
  });
  side.append(sk, list);
  grid.append(feat, side);

  const briefs = document.createElement("div");
  briefs.className = "paper-briefs";
  const bk = document.createElement("div");
  bk.className = "paper-kicker";
  bk.textContent = "Also in this edition";
  briefs.appendChild(bk);
  World.PAPER_BRIEFS.forEach((story) => {
    briefs.appendChild(linkEl(story.href, story.kicker + " — " + story.title));
  });

  const rack = document.createElement("p");
  rack.className = "paper-rack";
  const archive = linkEl(World.PAPER_ARCHIVE.href, World.PAPER_ARCHIVE.title);
  rack.append(
    "HipFish Monthly stays in the rack — a coast tabloid, not a pile of PDFs. ",
    World.PAPER_ARCHIVE.dek + " ",
    archive
  );

  root.append(leadBox, grid, briefs, rack);
}

function showPaper() {
  fillPaper();
  hidePanel();
  paperOpen = true;
  paperGiven = true;
  const el = document.getElementById("paper");
  if (el) el.hidden = false;
}

function enterMuseum() {
  if (room === "museum") return;
  room = "museum";
  pos.x = World.MUSEUM.spawnX;
  pos.y = World.MUSEUM.spawnY;
  pos.z = World.MUSEUM.spawnZ;
  yaw = World.MUSEUM.spawnYaw;
  pitch = -0.04;
  lastXz.x = pos.x;
  lastXz.z = pos.z;
  applyRoomLight();
  flashWipe();
  hidePanel();
}

function exitMuseum() {
  if (room === "forest") return;
  room = "forest";
  pos.x = World.MUSEUM.exitX;
  pos.y = World.MUSEUM.exitY;
  pos.z = World.MUSEUM.exitZ;
  yaw = World.MUSEUM.exitYaw;
  pitch = -0.06;
  lastXz.x = pos.x;
  lastXz.z = pos.z;
  applyRoomLight();
  flashWipe();
  hidePanel();
}

function checkPortals() {
  const forestDoor = World.forestDoor();
  const museumDoor = World.museumDoor();
  if (room === "forest") {
    const cross = World.portalCross(lastXz.x, lastXz.z, pos.x, pos.z, forestDoor);
    if (cross === 1) enterMuseum();
  } else {
    const cross = World.portalCross(lastXz.x, lastXz.z, pos.x, pos.z, museumDoor);
    if (cross === -1) exitMuseum();
  }
  lastXz.x = pos.x;
  lastXz.z = pos.z;
}

function newsieDist() {
  return Math.hypot(pos.x - World.NEWSIE.x, pos.z - World.NEWSIE.z);
}

function updateHint() {
  if (paperOpen) {
    setHint("");
    return;
  }
  if (room === "forest" && newsieDist() < World.NEWSIE.handRadius + 1.2) {
    setHint(paperGiven ? "The newsie will hand you another Extra" : "A newsie holds a paper out");
    return;
  }
  if (room === "forest" && World.inPortalSlot(pos.x, pos.z, World.forestDoor())) {
    setHint("Step through — bigger on the inside");
    return;
  }
  if (room === "museum" && World.inPortalSlot(pos.x, pos.z, World.museumDoor())) {
    setHint("The forest is through the small door");
    return;
  }
  setHint("");
}

function applyCamera() {
  Nav.lookVector(yaw, pitch, look);
  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(pos.x + look.x, pos.y + look.y, pos.z + look.z);
}

function clampPos() {
  const next = World.clampRoom(room, pos, { xz: BOUNDS, y: BOUNDS * 0.55 });
  pos.x = next.x;
  pos.y = next.y;
  pos.z = next.z;
}

function applyRoomLight() {
  if (!scene) return;
  if (room === "museum") {
    scene.background = new THREE.Color(0x2a2218);
    scene.fog = new THREE.Fog(0x5a4a38, 28, 78);
  } else {
    scene.background = new THREE.Color(DUSK);
    scene.fog = new THREE.Fog(HAZE, 70, 240);
  }
}

function flashWipe() {
  const el = document.getElementById("wipe");
  if (!el) return;
  el.hidden = false;
  el.classList.add("on");
  wipeTimer = 0.2;
}

function goHome() {
  room = "forest";
  pos.x = 0;
  pos.y = EYE;
  pos.z = 0;
  yaw = -0.38;
  pitch = -0.08;
  lastXz.x = pos.x;
  lastXz.z = pos.z;
  applyRoomLight();
  hidePanel();
  hidePaper();
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
  if (obj.userData.action === "enter-museum") {
    enterMuseum();
    return;
  }
  if (obj.userData.action === "exit-museum") {
    exitMuseum();
    return;
  }
  if (obj.userData.action === "take-paper") {
    showPaper();
    return;
  }
  showPanel(obj.userData);
  if (obj.userData.openUrl) {
    window.open(obj.userData.openUrl, "_blank", "noopener");
  }
}

function wakeHand(el) {
  if (!el) return;
  el.tabIndex = 0;
  try {
    el.focus({ preventScroll: true });
  } catch (err) {
    el.focus();
  }
}

function bindInput() {
  const el = renderer.domElement;
  const hud = (t) => t && t.closest && t.closest("#hud a, #hud button, #panel, #paper");
  el.tabIndex = 0;
  wakeHand(el);

  function onWheel(e) {
    if (paperOpen || hud(e.target)) return;
    e.preventDefault();
    wakeHand(el);
    const step = Nav.dollyStep(e.deltaY, e.deltaMode);
    const flat = Nav.flatForward(yaw);
    pos.x += flat.x * step;
    pos.z += flat.z * step;
    if (Math.abs(e.deltaX) > 0.5) {
      const side = Nav.wheelUnit(e.deltaX, e.deltaMode) * Nav.DOLLY;
      const right = Nav.rightVector(yaw);
      pos.x += right.x * side;
      pos.z += right.z * side;
    }
    clampPos();
    checkPortals();
  }
  window.addEventListener("wheel", onWheel, { passive: false });

  el.addEventListener("pointerdown", (e) => {
    wakeHand(el);
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
    const flags = Nav.setHeld(held, e.code, e.key, true);
    if (Nav.isMoveKey(e.code, e.key)) e.preventDefault();
    if (flags.escape) {
      if (lookLocked) document.exitPointerLock();
      hidePanel();
      hidePaper();
    }
    if (flags.lock) {
      if (lookLocked) document.exitPointerLock();
      else el.requestPointerLock();
    }
    if (flags.home) goHome();
  }, true);
  window.addEventListener("keyup", (e) => {
    Nav.setHeld(held, e.code, e.key, false);
  }, true);
  window.addEventListener("blur", () => {
    const clear = Nav.emptyHeld();
    Object.keys(clear).forEach((k) => {
      held[k] = false;
    });
  });
  const fold = document.getElementById("paper-fold");
  if (fold) fold.addEventListener("click", hidePaper);
  const paper = document.getElementById("paper");
  if (paper) {
    paper.addEventListener("click", (e) => {
      if (e.target === paper) hidePaper();
    });
  }
}

function travel(dt) {
  if (paperOpen) return;
  if (held.turnLeft) yaw -= TURN * dt;
  if (held.turnRight) yaw += TURN * dt;
  const speed = held.fast ? MOVE_FAST : MOVE;
  const offset = Nav.moveOffset(yaw, pitch, held, dt, speed);
  pos.x += offset.x;
  pos.y += offset.y;
  pos.z += offset.z;
  clampPos();
  checkPortals();
  if (room === "forest" && !paperGiven && newsieDist() < World.NEWSIE.handRadius) {
    showPaper();
  }
}

function buildLand() {
  const geo = new THREE.PlaneGeometry(420, 420, 96, 96);
  geo.rotateX(-Math.PI / 2);
  const attr = geo.attributes.position;
  for (let i = 0; i < attr.count; i++) {
    const x = attr.getX(i);
    const z = attr.getZ(i);
    attr.setY(i, heightAt(x, z));
  }
  attr.needsUpdate = true;
  geo.computeVertexNormals();
  scene.add(shade(new THREE.Mesh(geo, EARTH), false, true));

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(380, 40, 20),
    new THREE.MeshBasicMaterial({
      map: skyMap(),
      side: THREE.BackSide,
      fog: false,
      depthWrite: false
    })
  );
  scene.add(sky);

  const sea = shade(new THREE.Mesh(new THREE.PlaneGeometry(200, 300), WATER), false, true);
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(-118, -0.45, -6);
  scene.add(sea);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.4, 0.045, 10, 72), RING);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.04;
  scene.add(ring);

  boulder(-38, -4, 7.2, 4.6, 5.4);
  boulder(-44, 6, 5.4, 3.4, 4.8);
  boulder(-32, 10, 3.6, 2.2, 3.2);
  boulder(-41, -14, 4.2, 2.8, 3.6);

  fir(-30, 12, 6.4);
  fir(-36, -10, 7.2);
  fir(-27, 20, 5.6);
  fir(7, 30, 6.1);
  fir(-8, 33, 7.0);
  fir(12, 28, 5.2);
  fir(-22, -18, 6.8);
  fir(-18, -28, 5.4);
  fir(-16.5, 6.2, 5.8);
  fir(-20.5, -6.4, 6.3);
}

function swirlMap() {
  return canvasTex((d, n) => {
    const cx = n * 0.5;
    const cy = n * 0.5;
    for (let i = 0, p = 0; i < n * n; i++, p += 4) {
      const x = i % n;
      const y = (i / n) | 0;
      const dx = (x - cx) / n;
      const dy = (y - cy) / n;
      const r = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      const band = 0.5 + 0.5 * Math.sin(a * 7 + r * 28);
      d[p] = clampByte(24 + band * 40 + (1 - r) * 30);
      d[p + 1] = clampByte(90 + band * 90 + (1 - r) * 40);
      d[p + 2] = clampByte(88 + band * 70);
      d[p + 3] = clampByte(220 - r * 80);
    }
  }, 256);
}

function makeCaption(text) {
  const w = 512;
  const h = 96;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(32, 26, 18, 0.72)";
  ctx.fillRect(16, 22, w - 32, 52);
  ctx.fillStyle = "#ead7a4";
  ctx.font = "500 28px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.45),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
}

function portalDoorway(width, height, action, label) {
  const group = new THREE.Group();
  const swirl = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.92, height * 0.92),
    new THREE.MeshBasicMaterial({
      map: swirlMap(),
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    })
  );
  swirl.position.z = 0.02;
  addClick(swirl, {
    action: action,
    title: label,
    body: "A small door. The hall behind it is larger than the frame.",
    href: ART_HREF,
    linkLabel: "Open the studio page"
  });
  const view = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.92, height * 0.92),
    new THREE.MeshBasicMaterial({ color: 0x1a1410 })
  );
  view.position.z = -0.01;
  group.add(view, swirl);
  group.userData.view = view;
  group.userData.swirl = swirl;
  return group;
}

function buildForestBooth() {
  const door = World.FOREST_PORTAL;
  const booth = new THREE.Group();
  const body = shade(new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.7, 1.55), TEAL_BLOCK), true, true);
  body.position.y = 1.35;
  const step = shade(new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.22, 1.9), GOLD_BLOCK), true, true);
  step.position.y = 0.11;
  const cap = shade(new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.28, 1.8), GOLD_BLOCK), true, true);
  cap.position.y = 2.82;
  const crown = shade(new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.32, 1.2), TEAL_BLOCK), true, true);
  crown.position.y = 3.1;
  const finial = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.28), GOLD_BLOCK), true, true);
  finial.position.y = 3.42;
  const ring = shade(new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.045, 8, 28), RING), true, true);
  ring.position.set(0.78, 1.45, 0);
  ring.rotation.y = Math.PI / 2;
  booth.add(body, step, cap, crown, finial, ring);
  const portal = portalDoorway(1.12, 2.15, "enter-museum", "Museum");
  portal.position.set(0.86, 1.35, 0);
  portal.rotation.y = Math.PI / 2;
  booth.add(portal);
  forestPortalMesh = portal;
  booth.position.set(door.x - 0.86, door.y, door.z);
  scene.add(booth);
  const sign = makeSign("Museum", 3.6);
  sign.position.set(door.x + 1.6, 3.15, door.z);
  addClick(sign, {
    action: "enter-museum",
    title: "Museum",
    body: "Bigger on the inside. The sample-page portfolio hangs in the hall.",
    href: ART_HREF,
    linkLabel: "Open the studio page"
  });
  scene.add(sign);
}

function buildNewsie() {
  const g = new THREE.Group();
  const pants = shade(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.22), new THREE.MeshStandardMaterial({
    color: 0x3a3328,
    roughness: 0.9
  })), true, true);
  pants.position.y = 0.28;
  const shirt = shade(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.26), TEAL_BLOCK), true, true);
  shirt.position.y = 0.64;
  const head = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), new THREE.MeshStandardMaterial({
    color: 0xd4b08a,
    roughness: 0.85
  })), true, true);
  head.position.y = 0.98;
  const cap = shade(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.34), GOLD_BLOCK), true, true);
  cap.position.y = 1.14;
  const brim = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.16), GOLD_BLOCK), true, true);
  brim.position.set(0, 1.1, 0.22);
  const bag = shade(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.12), new THREE.MeshStandardMaterial({
    color: 0x6a3a28,
    roughness: 0.8
  })), true, true);
  bag.position.set(0.22, 0.55, 0);
  const paper = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.03), new THREE.MeshStandardMaterial({
    color: 0xefe6d4,
    roughness: 0.7,
    emissive: 0x3a3020,
    emissiveIntensity: 0.2
  })), true, true);
  paper.position.set(0.18, 0.72, 0.18);
  g.add(pants, shirt, head, cap, brim, bag, paper);
  g.position.set(World.NEWSIE.x, heightAt(World.NEWSIE.x, World.NEWSIE.z), World.NEWSIE.z);
  billboard(g, "Extra! Extra!", "newsie");
  addClick(shirt, {
    action: "take-paper",
    title: "The Coast Extra",
    body: "A newsie kid with the late edition. Take the paper — her real bylines are inside.",
    href: World.PAPER_ARCHIVE.href,
    linkLabel: "Pioneer author archive"
  });
  addClick(paper, { action: "take-paper", title: "The Coast Extra" });
  addClick(head, { action: "take-paper", title: "The Coast Extra" });
  scene.add(g);
  newsieGroup = g;
  const sign = makeSign("Extra! Extra!", 3.4);
  sign.position.set(World.NEWSIE.x, g.position.y + 1.55, World.NEWSIE.z);
  addClick(sign, { action: "take-paper", title: "The Coast Extra" });
  scene.add(sign);
}

function buildMuseum() {
  const m = World.MUSEUM;
  const hall = new THREE.Group();
  const length = m.doorX - m.minX;
  const width = m.maxZ - m.minZ;
  const height = 8.2;
  const cx = (m.minX + m.doorX) / 2;
  const cz = (m.minZ + m.maxZ) / 2;
  const floor = shade(new THREE.Mesh(new THREE.BoxGeometry(length + 2.4, 0.18, width), PLASTER), false, true);
  floor.position.set(cx, -0.09, cz);
  const ceil = shade(new THREE.Mesh(new THREE.BoxGeometry(length + 2.4, 0.16, width), PLASTER), false, true);
  ceil.position.set(cx, height, cz);
  const north = shade(new THREE.Mesh(new THREE.BoxGeometry(length + 2.4, height, 0.32), PLASTER), false, true);
  north.position.set(cx, height / 2, m.maxZ);
  const south = shade(new THREE.Mesh(new THREE.BoxGeometry(length + 2.4, height, 0.32), PLASTER), false, true);
  south.position.set(cx, height / 2, m.minZ);
  const west = shade(new THREE.Mesh(new THREE.BoxGeometry(0.32, height, width), PLASTER), false, true);
  west.position.set(m.minX, height / 2, cz);
  const eastL = shade(new THREE.Mesh(new THREE.BoxGeometry(0.32, height, width * 0.38), PLASTER), false, true);
  eastL.position.set(m.doorX + 0.2, height / 2, m.minZ + width * 0.19);
  const eastR = shade(new THREE.Mesh(new THREE.BoxGeometry(0.32, height, width * 0.38), PLASTER), false, true);
  eastR.position.set(m.doorX + 0.2, height / 2, m.maxZ - width * 0.19);
  const lintel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.4, 2.4), GOLD_BLOCK), true, true);
  lintel.position.set(m.doorX + 0.2, 3.3, m.doorZ);
  hall.add(floor, ceil, north, south, west, eastL, eastR, lintel);
  const railN = shade(new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), GOLD_BLOCK), false, true);
  railN.position.set(cx, 0.28, m.maxZ - 0.22);
  const railS = shade(new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), GOLD_BLOCK), false, true);
  railS.position.set(cx, 0.28, m.minZ + 0.22);
  hall.add(railN, railS);
  for (let i = 0; i < 7; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.06, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xf0d8a0 })
    );
    bar.position.set(m.doorX - 6 - i * 7.4, height - 0.2, cz);
    hall.add(bar);
  }
  scene.add(hall);
  const portal = portalDoorway(1.35, 2.35, "exit-museum", "Forest");
  portal.position.set(m.doorX - 0.05, 1.4, m.doorZ);
  portal.rotation.y = -Math.PI / 2;
  scene.add(portal);
  museumPortalMesh = portal;
  const sign = makeSign("The collection is larger than the door", 7.2);
  sign.position.set(-8.5, 7.15, cz);
  scene.add(sign);
}

function hangMuseumPiece(tex, title, x, y, z, yaw) {
  const img = tex.image;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  let h = 2.05;
  let w = h * aspect;
  if (w > 2.55) {
    w = 2.55;
    h = w / aspect;
  }
  const hung = framedPiece(tex, h);
  hung.group.position.set(x, y, z);
  hung.group.rotation.y = yaw;
  addClick(hung.pic, {
    title: title,
    body: "From the sample-page studio portfolio.",
    href: ART_HREF,
    linkLabel: "Open the studio page"
  });
  scene.add(hung.group);
  const cap = makeCaption(title);
  cap.position.set(x, y - h * 0.5 - 0.28, z);
  cap.rotation.y = yaw;
  scene.add(cap);
  museumArtHung += 1;
}

function museumSlot(i, count) {
  const m = World.MUSEUM;
  const cols = Math.ceil(count / 4);
  const wall = i % 2;
  const row = Math.floor(i / 2) % 2;
  const col = Math.floor(i / 4);
  const span = (m.doorX - 4) - (m.minX + 3);
  const t = cols <= 1 ? 0.5 : col / (cols - 1);
  const x = -4 - t * span;
  const y = row === 0 ? 2.15 : 5.25;
  const z = wall === 0 ? m.minZ + 0.42 : m.maxZ - 0.42;
  const yaw = wall === 0 ? 0 : Math.PI;
  return { x: x, y: y, z: z, yaw: yaw };
}

async function populateMuseum() {
  const files = World.ART;
  const textures = await Promise.all(files.map((row) => loadTexture(World.artPath(row[0]))));
  textures.forEach((tex, i) => {
    if (!tex) return;
    const slot = museumSlot(i, files.length);
    hangMuseumPiece(tex, files[i][1], slot.x, slot.y, slot.z, slot.yaw);
  });
}

function addWalkSigns() {
  WALKS.forEach((walk) => {
    const sign = makeSign(walk.title, walk.id === "credentials" || walk.id === "ground" ? 6.2 : 7.2);
    sign.position.set(walk.pos[0], walk.pos[1], walk.pos[2]);
    addClick(sign, {
      title: walk.title,
      body: walk.body,
      href: walk.href,
      linkLabel: "Open graphicoregon.com"
    });
    scene.add(sign);
  });
}

function buildResearchTable() {
  const x = 32;
  const z = 2;
  const y = heightAt(x, z);
  const slab = shade(new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.22, 4.2), ROCK), true, true);
  slab.position.set(x, y + 0.82, z);
  scene.add(slab);
  const legs = [
    [-2.3, -1.6],
    [2.3, -1.6],
    [-2.3, 1.6],
    [2.3, 1.6]
  ];
  legs.forEach((p) => {
    const leg = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.82, 0.28), ROCK), true, true);
    leg.position.set(x + p[0], y + 0.41, z + p[1]);
    scene.add(leg);
  });
  return { x: x, y: y + 0.94, z: z };
}

function buildWritingLectern() {
  const x = 0;
  const z = 32;
  const y = heightAt(x, z);
  const post = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.15, 0.28), TIMBER), true, true);
  post.position.set(x, y + 0.58, z);
  const board = shade(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.5), TIMBER), true, true);
  board.position.set(x, y + 1.16, z);
  scene.add(post, board);
  return { x: x, y: y + 1.24, z: z };
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
  const origin = { x: 18, y: 17.5, z: -6 };
  const posArr = [];
  const col = [];
  const tealC = new THREE.Color(teal);
  const goldC = new THREE.Color(gold);
  const sc = 0.14;
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
    body: "A star field you can travel into.",
    href: STARIS_HREF,
    linkLabel: "Open StarIS",
    openUrl: STARIS_HREF
  };
  const pts = new THREE.Points(
    g,
    new THREE.PointsMaterial({
      size: 0.16,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      depthWrite: false
    })
  );
  addClick(pts, data);
  scene.add(pts);
  const sign = makeSign("StarIS", 5.6);
  sign.position.set(origin.x, origin.y - 7.2, origin.z);
  addClick(sign, data);
  scene.add(sign);
}

async function populatePieces() {
  const [guideTex, artTex, copperTex, mapTex, newsTex, webTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/art/neahkahnie.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg"),
    loadTexture("assets/maps/01-context.jpg"),
    loadTexture("assets/news/gazette-puffin.jpg"),
    loadTexture("assets/web/site-01.jpg")
  ]);

  if (guideTex) {
    easelAt(-7.6, -11.2, framedPiece(guideTex, 3.15), {
      title: "Giving Guide 2022–23",
      body: "Cover of the 2022–23 Tillamook County Giving Guide.",
      href: HOME_HREF,
      linkLabel: "Open graphicoregon.com"
    }, "Giving Guide", 4.2);
  }

  if (artTex) {
    easelAt(-17.4, -3.2, framedPiece(artTex, 3.4), {
      title: "Neahkahnie",
      body: "Coast work from the studio.",
      href: ART_HREF,
      linkLabel: "Open the studio page"
    }, "Neahkahnie", 4.0);
  }

  if (copperTex) {
    const hung = framedPiece(copperTex, 2.45);
    const x = 6.8;
    const z = -10.4;
    const y = heightAt(x, z);
    const stand = new THREE.Group();
    const post = shade(new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.15, 0.58), TIMBER), true, true);
    post.position.y = 0.58;
    hung.group.position.set(0, 2.0, 0);
    stand.add(post, hung.group);
    stand.position.set(x, y, z);
    faceCenter(stand);
    billboard(stand, "Copper Horizon", "print");
    addClick(hung.pic, {
      title: "Copper Horizon ocean graphic tee",
      body: "Teal sky. Copper rays.",
      href: COPPER_HREF,
      linkLabel: "Open Copper Horizon",
      openUrl: COPPER_HREF
    });
    scene.add(stand);
    const sign = makeSign("Copper Horizon", 4.8);
    sign.position.set(x, y + 3.7, z);
    scene.add(sign);
  }

  if (mapTex) {
    const table = buildResearchTable();
    const img = mapTex.image;
    const aspect = img && img.width && img.height ? img.width / img.height : 1.4;
    const w = 4.6;
    const h = w / aspect;
    const map = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshLambertMaterial({
        map: mapTex,
        emissive: 0xffffff,
        emissiveMap: mapTex,
        emissiveIntensity: 0.22
      })
    );
    map.rotation.x = -Math.PI / 2;
    map.position.set(table.x, table.y, table.z);
    addClick(map, {
      title: "Research",
      body: "North Coast mapping — Netarts and the watersheds.",
      href: RESEARCH_HREF,
      linkLabel: "Open the IAU proposal"
    });
    scene.add(map);
  } else {
    buildResearchTable();
  }

  if (newsTex) {
    const lectern = buildWritingLectern();
    const hung = framedPiece(newsTex, 1.7);
    hung.group.position.set(lectern.x, lectern.y + 0.9, lectern.z);
    faceCenter(hung.group);
    billboard(hung.group, "Writing", "print");
    addClick(hung.pic, {
      title: "Writing",
      body: "Coast journalism and the papers.",
      href: HOME_HREF,
      linkLabel: "Open graphicoregon.com"
    });
    scene.add(hung.group);
  } else {
    buildWritingLectern();
  }

  if (webTex) {
    const hung = framedPiece(webTex, 2.6);
    const x = 0;
    const z = -34;
    const y = heightAt(x, z);
    hung.group.position.set(x, y + 2.0, z);
    faceCenter(hung.group);
    billboard(hung.group, "Websites", "print");
    addClick(hung.pic, {
      title: "Websites",
      body: "Website design for the coast.",
      href: HOME_HREF,
      linkLabel: "Open graphicoregon.com"
    });
    scene.add(hung.group);
  }

  await populateStarIS();
  await populateMuseum();
}

function renderPortalViews() {
  if (!portalTarget || !portalCam) return;
  const looking = room === "forest" ? forestPortalMesh : museumPortalMesh;
  if (!looking || !looking.userData.view) return;
  if (room === "forest") {
    portalCam.position.set(World.MUSEUM.spawnX, 1.75, World.MUSEUM.spawnZ);
    portalCam.lookAt(World.MUSEUM.minX + 12, 2.8, World.MUSEUM.spawnZ);
  } else {
    portalCam.position.set(World.MUSEUM.exitX, 1.7, World.MUSEUM.exitZ);
    portalCam.lookAt(World.FOREST_PORTAL.x, 1.5, World.FOREST_PORTAL.z);
  }
  if (forestPortalMesh) forestPortalMesh.visible = false;
  if (museumPortalMesh) museumPortalMesh.visible = false;
  renderer.setRenderTarget(portalTarget);
  renderer.render(scene, portalCam);
  renderer.setRenderTarget(null);
  if (forestPortalMesh) forestPortalMesh.visible = true;
  if (museumPortalMesh) museumPortalMesh.visible = true;
  const mat = looking.userData.view.material;
  if (mat.map !== portalTarget.texture) {
    mat.map = portalTarget.texture;
    mat.needsUpdate = true;
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
  if (forestPortalMesh && forestPortalMesh.userData.swirl) {
    forestPortalMesh.userData.swirl.rotation.z += dt * 0.18;
  }
  if (museumPortalMesh && museumPortalMesh.userData.swirl) {
    museumPortalMesh.userData.swirl.rotation.z -= dt * 0.14;
  }
  if (wipeTimer > 0) {
    wipeTimer -= dt;
    if (wipeTimer <= 0) {
      const el = document.getElementById("wipe");
      if (el) {
        el.classList.remove("on");
        el.hidden = true;
      }
    }
  }
  updateHint();
  renderPortalViews();
  renderer.render(scene, camera);
}

function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(DUSK);
  scene.fog = new THREE.Fog(HAZE, 70, 240);
  camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 900);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.AmbientLight(0xd4c2a0, 0.4));
  scene.add(new THREE.HemisphereLight(0xffe0b0, 0x243028, 0.78));
  const sun = new THREE.DirectionalLight(0xffd2a0, 2.05);
  sun.position.set(-42, 22, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 4;
  sun.shadow.camera.far = 90;
  sun.shadow.camera.left = -36;
  sun.shadow.camera.right = 36;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -16;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x8aa4aa, 0.28);
  fill.position.set(24, 14, -12);
  scene.add(fill);

  portalTarget = new THREE.WebGLRenderTarget(512, 768);
  portalCam = new THREE.PerspectiveCamera(58, 1.12 / 2.15, 0.2, 120);
  buildLand();
  buildForestBooth();
  buildNewsie();
  buildMuseum();
  addWalkSigns();
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
  getPose: () => ({ x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch, room: room }),
  setPose: (p) => {
    if (p.x != null) pos.x = p.x;
    if (p.y != null) pos.y = p.y;
    if (p.z != null) pos.z = p.z;
    if (p.yaw != null) yaw = p.yaw;
    if (p.pitch != null) pitch = p.pitch;
    lastXz.x = pos.x;
    lastXz.z = pos.z;
    clampPos();
  },
  lookVector: () => Nav.lookVector(yaw, pitch),
  goHome: goHome,
  spawn: { x: 0, y: EYE, z: 0 },
  room: () => room,
  enterMuseum: enterMuseum,
  exitMuseum: exitMuseum,
  showPaper: showPaper,
  hidePaper: hidePaper,
  paperOpen: () => paperOpen,
  paperGiven: () => paperGiven,
  museumArtCount: () => museumArtHung,
  newsiePos: () => ({ x: World.NEWSIE.x, z: World.NEWSIE.z }),
  portalPos: () => ({ x: World.FOREST_PORTAL.x, z: World.FOREST_PORTAL.z }),
  billboardCount: () => billboards.length,
  billboardLabels: () => billboards.map((o) => o.userData.label).filter(Boolean),
  billboardPrints: () => billboards.filter((o) => o.userData.kind === "print").map((o) => o.userData.label),
  billboardPoses: () => billboards.map((o) => ({
    label: o.userData.label,
    kind: o.userData.kind,
    x: o.position.x,
    y: o.position.y,
    z: o.position.z
  }))
};

main();
