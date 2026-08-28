/* Graphic Oregon — a coastal clearing you can leave */

const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const Nav = window.FieldNav;
const Roster = window.Roster;
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
const PIONEER_HREF = "https://www.tillamookcountypioneer.net/author/assistant-editor/";
const Art = window.ArtInventory;

const MUSEUM = {
  x: 0,
  y: -56,
  z: 0,
  len: 42,
  wid: 15.2,
  h: 8.6
};
const PORTAL_FOREST = { x: -17.8, z: -14.4 };

// Fighter lineup in the ROSTER_POSE look. One row, one backdrop. Rooms later.
const LINEUP = {
  journalist: { x: -5.0, z: -3.2 },
  scientist: { x: -3.0, z: -3.2 },
  radio: { x: -1.0, z: -3.2 },
  artist: { x: 1.0, z: -3.2 },
  teacher: { x: 3.0, z: -3.2 },
  musician: { x: 5.0, z: -3.2 }
};

const WALKS = [
  { id: "art", title: "Art", pos: [-36, 2.4, -2], href: ART_HREF, body: "Oil, acrylic, charcoal, and prints." },
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
const hungArt = [];
const portalVeils = [];
const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();
let portalSide = "forest";
let portalCool = 0;
let fieldFog = null;
let museumRoot = null;
let hallSun = null;
let museumArtStarted = false;
let wheelBudget = 3.2;
let wheelReset = 0;

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
const PLASTER = new THREE.MeshStandardMaterial({
  color: 0xc4b396,
  roughness: 0.92,
  metalness: 0.02
});
const PLASTER_IN = new THREE.MeshStandardMaterial({
  color: 0xd8cbb0,
  roughness: 0.88,
  metalness: 0.02
});
const DECO = new THREE.MeshStandardMaterial({
  color: gold,
  roughness: 0.42,
  metalness: 0.28
});
const TEAL_PANEL = new THREE.MeshStandardMaterial({
  color: 0x1e6e6a,
  roughness: 0.55,
  metalness: 0.12
});
const SKIN = new THREE.MeshStandardMaterial({
  color: 0xc4a07a,
  roughness: 0.86,
  metalness: 0.02
});
const CAP = new THREE.MeshStandardMaterial({
  color: 0x3a2a18,
  roughness: 0.8,
  metalness: 0.04
});
const PAPER = new THREE.MeshStandardMaterial({
  color: 0xeee6d4,
  roughness: 0.62,
  metalness: 0.02
});
const COPPER = new THREE.MeshStandardMaterial({
  color: 0xb8734a,
  roughness: 0.44,
  metalness: 0.52
});
const HAIR = new THREE.MeshStandardMaterial({
  color: 0x2a1c14,
  roughness: 0.8,
  metalness: 0.02
});
const SMOCK = new THREE.MeshStandardMaterial({
  color: 0xc9b896,
  roughness: 0.88,
  metalness: 0.02
});
const COAT = new THREE.MeshStandardMaterial({
  color: 0x2f4a44,
  roughness: 0.74,
  metalness: 0.06
});
const DUSK_CLOTH = new THREE.MeshStandardMaterial({
  color: 0x3a2e28,
  roughness: 0.86,
  metalness: 0.04
});
let newsieHold = null;
const hand = Roster.createHand();
let fly = null;

function capTexture(tex, max) {
  const img = tex && tex.image;
  if (!img || !img.width || !img.height) return tex;
  const m = Math.max(img.width, img.height);
  if (m <= max) return tex;
  const s = max / m;
  const w = Math.max(1, Math.round(img.width * s));
  const h = Math.max(1, Math.round(img.height * s));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  tex.image = c;
  tex.needsUpdate = true;
  return tex;
}

function loadTexture(url) {
  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        capTexture(tex, 1024);
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

function lookSlot(id) {
  const p = LINEUP[id];
  if (!p) return { x: 0, y: 0, z: 0 };
  return { x: p.x, y: heightAt(p.x, p.z), z: p.z };
}

function facePrintedPage(mesh, target) {
  if (!mesh || !target) return;
  mesh.lookAt(target.x, target.y, target.z);
  mesh.rotateY(Math.PI);
}

function addClick(mesh, data) {
  Object.assign(mesh.userData, data);
  clickables.push(mesh);
}

function addClickTree(obj, data) {
  obj.traverse((child) => {
    if (child.isMesh) addClick(child, data);
  });
}

function afterFirstPaint(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
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
  addClick(hung.pic, data);
  scene.add(stand);
  const sign = makeSign(label, labelScale || 4.4);
  sign.position.set(x, y + hung.height + 1.15, z);
  scene.add(sign);
  return stand;
}

function quietCaption(text) {
  const w = 640;
  const h = 80;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(22, 18, 12, 0.42)";
  ctx.fillRect(0, 18, w, 44);
  ctx.fillStyle = "#d8c9a4";
  ctx.font = text.length > 20 ? "400 22px Georgia, serif" : "400 26px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 0.26),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  return billboard(mesh, text, "caption");
}

function forestDoorX() {
  return PORTAL_FOREST.x + 1.02;
}

function museumDoorX() {
  return MUSEUM.x + MUSEUM.len / 2 - 0.18;
}

const prevPos = { x: 0, y: EYE, z: 0 };

function showMuseum(on) {
  const vis = !!on;
  if (museumRoot) museumRoot.visible = vis;
  if (hallSun) hallSun.visible = vis;
}

function museumEye() {
  return {
    x: museumDoorX() - 2.4,
    y: MUSEUM.y + EYE,
    z: MUSEUM.z,
    yaw: -Math.PI / 2,
    pitch: 0
  };
}

function openMuseumVolume() {
  portalSide = "museum";
  portalCool = 0.85;
  showMuseum(true);
  if (!museumArtStarted) {
    museumArtStarted = true;
    streamMuseumArt().catch((err) => console.warn(err));
  }
}

function enterMuseum() {
  openMuseumVolume();
  applyPose(museumEye());
  prevPos.x = pos.x;
  prevPos.y = pos.y;
  prevPos.z = pos.z;
}

function exitMuseum() {
  const fx = forestDoorX() + 2.1;
  const fz = PORTAL_FOREST.z;
  pos.x = fx;
  pos.y = heightAt(fx, fz) + EYE;
  pos.z = fz;
  prevPos.x = pos.x;
  prevPos.y = pos.y;
  prevPos.z = pos.z;
  yaw = Math.PI / 2;
  pitch = 0;
  portalSide = "forest";
  portalCool = 0.85;
  showMuseum(false);
}

function stepPortal() {
  if (portalCool > 0) return;
  if (portalSide === "forest") {
    const y0 = heightAt(PORTAL_FOREST.x, PORTAL_FOREST.z);
    const nearY = pos.y > y0 - 0.6 && pos.y < y0 + 5.2;
    const hit = Nav.crossedSlab(
      prevPos.x, prevPos.z, pos.x, pos.z,
      PORTAL_FOREST.x - 0.4, forestDoorX() + 0.85,
      PORTAL_FOREST.z - 1.55, PORTAL_FOREST.z + 1.55
    );
    if (nearY && hit) enterMuseum();
    return;
  }
  const nearY = pos.y > MUSEUM.y - 0.2 && pos.y < MUSEUM.y + 6.2;
  const hit = Nav.crossedSlab(
    prevPos.x, prevPos.z, pos.x, pos.z,
    museumDoorX() - 0.4, museumDoorX() + 2.2,
    MUSEUM.z - 1.4, MUSEUM.z + 1.4
  );
  if (nearY && hit) exitMuseum();
}

function buildPortal() {
  const x = PORTAL_FOREST.x;
  const z = PORTAL_FOREST.z;
  const y = heightAt(x, z);
  const g = new THREE.Group();
  const postL = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.5, 0.28), TEAL_PANEL), true, true);
  postL.position.set(-0.92, 1.75, 0.92);
  const postR = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.5, 0.28), TEAL_PANEL), true, true);
  postR.position.set(-0.92, 1.75, -0.92);
  const postLB = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.5, 0.28), TEAL_PANEL), true, true);
  postLB.position.set(0.92, 1.75, 0.92);
  const postRB = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.5, 0.28), TEAL_PANEL), true, true);
  postRB.position.set(0.92, 1.75, -0.92);
  const sideN = shade(new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.5, 0.12), TEAL_PANEL), true, true);
  sideN.position.set(0, 1.75, 1.04);
  const sideS = shade(new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.5, 0.12), TEAL_PANEL), true, true);
  sideS.position.set(0, 1.75, -1.04);
  const back = shade(new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.5, 2.08), TEAL_PANEL), true, true);
  back.position.set(-1.04, 1.75, 0);
  const roof = shade(new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.18, 2.28), DECO), true, true);
  roof.position.set(0, 3.62, 0);
  const cap = shade(new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.22, 1.55), DECO), true, true);
  cap.position.set(0, 3.82, 0);
  const step = shade(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 2.05), DECO), true, true);
  step.position.set(1.15, 0.08, 0);
  const jambN = shade(new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.05, 0.2), DECO), true, true);
  jambN.position.set(1.02, 1.58, 0.86);
  const jambS = shade(new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.05, 0.2), DECO), true, true);
  jambS.position.set(1.02, 1.58, -0.86);
  const lintel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 1.92), DECO), true, true);
  lintel.position.set(1.02, 3.18, 0);
  const inner = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 1.55), DECO), true, true);
  inner.position.set(1.02, 3.0, 0);
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 2.85),
    new THREE.MeshBasicMaterial({
      color: 0x3ec8c0,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  veil.position.set(1.02, 1.58, 0);
  veil.rotation.y = Math.PI / 2;
  portalVeils.push(veil);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 8, 28), DECO);
  ring.position.set(1.02, 1.62, 0);
  ring.rotation.y = Math.PI / 2;
  g.add(postL, postR, postLB, postRB, sideN, sideS, back, roof, cap, step, jambN, jambS, lintel, inner, veil, ring);
  g.position.set(x, y, z);
  scene.add(g);
}

function buildMuseum() {
  const ox = MUSEUM.x;
  const oy = MUSEUM.y;
  const oz = MUSEUM.z;
  const L = MUSEUM.len;
  const W = MUSEUM.wid;
  const H = MUSEUM.h;
  const g = new THREE.Group();
  const floor = shade(new THREE.Mesh(new THREE.BoxGeometry(L + 0.4, 0.2, W + 0.4), TIMBER), false, true);
  floor.position.set(ox, oy - 0.1, oz);
  const ceil = shade(new THREE.Mesh(new THREE.BoxGeometry(L + 0.4, 0.16, W + 0.4), PLASTER), false, true);
  ceil.position.set(ox, oy + H, oz);
  const north = shade(new THREE.Mesh(new THREE.BoxGeometry(L + 0.4, H, 0.28), PLASTER_IN), false, true);
  north.position.set(ox, oy + H / 2, oz + W / 2);
  const south = shade(new THREE.Mesh(new THREE.BoxGeometry(L + 0.4, H, 0.28), PLASTER_IN), false, true);
  south.position.set(ox, oy + H / 2, oz - W / 2);
  const west = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, H, W), PLASTER_IN), false, true);
  west.position.set(ox - L / 2, oy + H / 2, oz);
  const doorW = 2.2;
  const doorH = 3.25;
  const eastY = oy + H / 2;
  const sideW = (W - doorW) / 2;
  const eastN = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, H, sideW), PLASTER_IN), false, true);
  eastN.position.set(ox + L / 2, eastY, oz + (doorW + sideW) / 2);
  const eastS = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, H, sideW), PLASTER_IN), false, true);
  eastS.position.set(ox + L / 2, eastY, oz - (doorW + sideW) / 2);
  const lintelH = H - doorH;
  const eastLintel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, lintelH, doorW), PLASTER_IN), false, true);
  eastLintel.position.set(ox + L / 2, oy + doorH + lintelH / 2, oz);
  const corniceN = shade(new THREE.Mesh(new THREE.BoxGeometry(L, 0.1, 0.18), DECO), false, true);
  corniceN.position.set(ox, oy + H - 0.28, oz + W / 2 - 0.2);
  const corniceS = shade(new THREE.Mesh(new THREE.BoxGeometry(L, 0.1, 0.18), DECO), false, true);
  corniceS.position.set(ox, oy + H - 0.28, oz - W / 2 + 0.2);
  const jambN = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, doorH, 0.22), DECO), true, true);
  jambN.position.set(ox + L / 2, oy + doorH / 2, oz + doorW / 2);
  const jambS = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, doorH, 0.22), DECO), true, true);
  jambS.position.set(ox + L / 2, oy + doorH / 2, oz - doorW / 2);
  const doorLint = shade(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, doorW + 0.2), DECO), true, true);
  doorLint.position.set(ox + L / 2, oy + doorH + 0.02, oz);
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(doorW - 0.15, doorH - 0.12),
    new THREE.MeshBasicMaterial({
      color: 0x3ec8c0,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  veil.position.set(ox + L / 2 - 0.02, oy + doorH / 2, oz);
  veil.rotation.y = Math.PI / 2;
  portalVeils.push(veil);
  const benchA = shade(new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.42, 0.7), TIMBER), true, true);
  benchA.position.set(ox - 6, oy + 0.21, oz);
  const benchB = shade(new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.42, 0.7), TIMBER), true, true);
  benchB.position.set(ox + 6, oy + 0.21, oz);
  const runner = shade(new THREE.Mesh(new THREE.BoxGeometry(L - 6, 0.03, 2.4), TEAL_PANEL), false, true);
  runner.position.set(ox, oy + 0.02, oz);
  g.add(floor, ceil, north, south, west, eastN, eastS, eastLintel, corniceN, corniceS, jambN, jambS, doorLint, veil, benchA, benchB, runner);
  museumRoot = g;
  museumRoot.visible = false;
  scene.add(museumRoot);

  hallSun = new THREE.DirectionalLight(0xffe4c0, 0.9);
  hallSun.position.set(ox + 10, oy + 22, oz + 8);
  hallSun.target.position.set(ox, oy + 2, oz);
  hallSun.visible = false;
  scene.add(hallSun);
  scene.add(hallSun.target);
}

function museumSlots(count) {
  const slots = [];
  const perRow = Math.ceil(count / 4);
  const usable = MUSEUM.len - 4.4;
  const cell = usable / perRow;
  const x0 = MUSEUM.x - MUSEUM.len / 2 + 2.2;
  const rows = [MUSEUM.y + 2.12, MUSEUM.y + 5.32];
  const walls = [
    { z: MUSEUM.z + MUSEUM.wid / 2 - 0.2, rotY: Math.PI },
    { z: MUSEUM.z - MUSEUM.wid / 2 + 0.2, rotY: 0 }
  ];
  let i = 0;
  walls.forEach((wall) => {
    rows.forEach((y) => {
      for (let k = 0; k < perRow && i < count; k += 1, i += 1) {
        slots.push({
          x: x0 + k * cell + cell / 2,
          y: y,
          z: wall.z,
          rotY: wall.rotY
        });
      }
    });
  });
  return slots;
}

function hangMuseumPiece(file, tex, slot) {
  const title = Art.titleFromFile(file);
  const hung = framedPiece(tex, 1.85);
  hung.group.position.set(slot.x, slot.y, slot.z);
  hung.group.rotation.y = slot.rotY;
  hung.group.userData.label = title;
  hung.group.userData.kind = "print";
  addClick(hung.pic, {
    title: title,
    body: "",
    href: ART_HREF,
    linkLabel: "Open the studio page",
    meta: "Graphic Oregon"
  });
  const root = museumRoot || scene;
  root.add(hung.group);
  const cap = quietCaption(title);
  cap.position.set(slot.x, slot.y - hung.height * 0.5 - 0.22, slot.z);
  root.add(cap);
  hungArt.push(file);
}

async function streamMuseumArt() {
  const files = Art.HANG.filter((f) => Art.shouldHang(f) && !Art.isPrivate(f));
  const slots = museumSlots(files.length);
  for (let i = 0; i < files.length; i += 1) {
    const tex = await loadTexture("assets/art/" + files[i]);
    if (tex && slots[i]) hangMuseumPiece(files[i], tex, slots[i]);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function paintOfferedSheet() {
  const w = 256;
  const h = 336;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2a2418";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 26px Georgia, serif";
  ctx.fillText("GRAPHIC OREGON", w / 2, 40);
  ctx.fillStyle = "#0d7377";
  ctx.fillRect(18, 50, w - 36, 4);
  ctx.fillStyle = "#3d5348";
  ctx.font = "600 11px Georgia, serif";
  ctx.fillText("WRITING  ·  THE COAST PAPERS", w / 2, 70);
  ctx.strokeStyle = "rgba(42, 36, 24, 0.55)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, 84);
  ctx.lineTo(w * 0.5, h - 18);
  ctx.stroke();
  ctx.fillStyle = "rgba(42, 36, 24, 0.38)";
  for (let i = 0; i < 8; i++) {
    const y0 = 90 + i * 28;
    ctx.fillRect(20, y0, 92, 6);
    ctx.fillRect(20, y0 + 9, 78, 3);
    ctx.fillRect(w * 0.5 + 10, y0, 88, 6);
    ctx.fillRect(w * 0.5 + 10, y0 + 9, 70, 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.anisotropy = 4;
  return tex;
}

function buildNewsie() {
  const slot = lookSlot("journalist");
  const x = slot.x;
  const z = slot.z;
  const y = slot.y;
  const g = new THREE.Group();
  const head = shade(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), SKIN), true, true);
  head.position.set(-0.02, 1.4, 0.08);
  head.rotation.x = 0.1;
  const brim = shade(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), CAP), true, true);
  brim.position.set(-0.02, 1.54, 0.08);
  const crown = shade(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.26), CAP), true, true);
  crown.position.set(-0.02, 1.62, 0.08);
  const body = shade(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.22), TEAL_PANEL), true, true);
  body.position.set(0, 1.02, -0.02);
  body.rotation.x = 0.16;
  const armL = shade(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.1), SKIN), true, true);
  armL.position.set(-0.28, 0.96, -0.04);
  armL.rotation.z = 0.78;
  armL.rotation.x = -0.35;
  const extras = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.08), PAPER), true, true);
  extras.position.set(-0.36, 0.84, -0.08);
  extras.rotation.z = 0.58;
  extras.rotation.x = -0.18;
  const legL = shade(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.12), CAP), true, true);
  legL.position.set(-0.1, 0.4, -0.06);
  const legR = shade(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.12), CAP), true, true);
  legR.position.set(0.11, 0.4, 0.14);
  const offer = new THREE.Group();
  offer.position.set(0, 1.2, 0);
  const armR = shade(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.56), SKIN), true, true);
  armR.position.set(0.3, 0.04, -0.22);
  const palm = shade(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.1, 0.13), SKIN), true, true);
  palm.position.set(0.34, 0.02, -0.52);
  const sheetTex = paintOfferedSheet();
  const sheetMat = new THREE.MeshBasicMaterial({
    map: sheetTex,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.7), sheetMat);
  sheet.position.set(0.52, 0.36, -0.68);
  const hit = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.92),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  );
  sheet.add(hit);
  offer.add(armR, palm, sheet);
  g.add(head, brim, crown, body, armL, extras, offer, legL, legR);
  g.position.set(x, y, z);
  faceCenter(g);
  g.updateMatrixWorld(true);
  facePrintedPage(sheet, camera ? camera.position : Roster.ROSTER_POSE);
  const data = {
    paper: true,
    self: "journalist",
    id: "journalist",
    title: "A paper",
    body: "A paper from the path.",
    meta: "Writing"
  };
  addClickTree(g, data);
  scene.add(g);
  const sign = classSign("Journalist");
  sign.position.set(x, y + 2.42, z);
  scene.add(sign);
  newsieHold = { offer: offer, sheet: sheet, rest: offer.rotation.x };
}

function boxPart(w, h, d, mat, x, y, z, rx, ry, rz) {
  const mesh = shade(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat), true, true);
  mesh.position.set(x, y, z);
  if (rx) mesh.rotation.x = rx;
  if (ry) mesh.rotation.y = ry;
  if (rz) mesh.rotation.z = rz;
  return mesh;
}

function classSign(text) {
  const w = 512;
  const h = 120;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ead7a4";
  ctx.font = "600 46px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(12, 8, 4, 0.72)";
  ctx.shadowBlur = 10;
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 0.4),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  return billboard(mesh, text, "sign");
}

function buildBoxSelf(opts) {
  const g = new THREE.Group();
  const bodyMat = opts.body || TEAL_PANEL;
  const legMat = opts.leg || CAP;
  g.add(boxPart(0.28, 0.28, 0.28, SKIN, 0, 1.42, 0.02));
  g.add(boxPart(0.32, 0.16, 0.3, HAIR, 0, 1.58, 0));
  g.add(boxPart(0.4, 0.5, 0.24, bodyMat, 0, 1.05, 0));
  g.add(boxPart(0.1, 0.38, 0.1, SKIN, -0.28, 1.0, 0, 0, 0, 0.1));
  g.add(boxPart(0.1, 0.38, 0.1, SKIN, 0.28, 1.0, 0, 0, 0, -0.1));
  g.add(boxPart(0.12, 0.52, 0.14, legMat, -0.1, 0.4, 0));
  g.add(boxPart(0.12, 0.52, 0.14, legMat, 0.1, 0.4, 0));
  if (opts.decorate) opts.decorate(g);
  return g;
}

function standLineup(id, group, title) {
  const slot = lookSlot(id);
  group.position.set(slot.x, slot.y, slot.z);
  faceCenter(group);
  group.userData.self = id;
  group.userData.id = id;
  addClickTree(group, { self: id, id: id });
  scene.add(group);
  const sign = classSign(title);
  sign.position.set(slot.x, slot.y + 2.42, slot.z);
  sign.userData.self = id;
  sign.userData.id = id;
  scene.add(sign);
  return slot;
}

function buildLineupBackdrop() {
  const clothMat = new THREE.MeshBasicMaterial({
    color: 0x1a5c58,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const goldMat = new THREE.MeshBasicMaterial({
    color: gold,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const floorMat = new THREE.MeshBasicMaterial({
    color: 0x123834,
    toneMapped: false
  });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(48, 22), clothMat);
  cloth.position.set(0, 10.4, -5.15);
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(49.2, 23), goldMat);
  frame.position.set(0, 10.4, -5.28);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), clothMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(-23.8, 10.4, 3.6);
  const right = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), clothMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(23.8, 10.4, 3.6);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(48, 20), clothMat);
  roof.rotation.x = Math.PI / 2;
  roof.position.set(0, 21.2, 3.6);
  const stage = new THREE.Mesh(new THREE.BoxGeometry(48, 0.2, 17.2), floorMat);
  stage.position.set(0, 0.04, 2.6);
  scene.add(frame, cloth, left, right, roof, stage);
}

function buildLineup() {
  buildLineupBackdrop();
  buildNewsie();
  standLineup("scientist", buildBoxSelf({
    body: COAT,
    decorate: (root) => {
      root.add(boxPart(0.46, 0.62, 0.3, COAT, 0, 1.02, 0.02));
    }
  }), "Scientist");
  standLineup("radio", buildBoxSelf({
    body: COPPER,
    decorate: (root) => {
      const band = shade(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 10, 20), COPPER), true, true);
      band.position.set(0, 1.52, 0.02);
      band.rotation.x = Math.PI / 2;
      root.add(band, boxPart(0.12, 0.14, 0.08, COPPER, -0.22, 1.46, 0.02), boxPart(0.12, 0.14, 0.08, COPPER, 0.22, 1.46, 0.02));
    }
  }), "Radio");
  standLineup("artist", buildBoxSelf({
    body: SMOCK,
    decorate: (root) => {
      root.add(boxPart(0.44, 0.56, 0.2, SMOCK, 0, 0.98, 0.04));
    }
  }), "Artist");
  standLineup("teacher", buildBoxSelf({
    body: TEAL_PANEL,
    decorate: (root) => {
      root.add(boxPart(0.46, 0.68, 0.28, TEAL_PANEL, 0, 1.0, 0));
    }
  }), "Teacher");
  const musicSlot = standLineup("musician", buildBoxSelf({
    body: DUSK_CLOTH,
    leg: DUSK_CLOTH
  }), "Musician");
  const note = quietCaption("empty stage");
  note.position.set(musicSlot.x, musicSlot.y + 0.28, musicSlot.z + 0.42);
  scene.add(note);
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
  const fig = document.getElementById("panel-figure");
  const img = document.getElementById("panel-img");
  if (fig && img) {
    if (data.figure && data.figure.src) {
      img.src = data.figure.src;
      img.alt = data.figure.alt || "";
      fig.hidden = false;
    } else {
      img.removeAttribute("src");
      img.alt = "";
      fig.hidden = true;
    }
  }
  const subs = document.getElementById("panel-subs");
  if (subs) {
    subs.innerHTML = "";
    const names = data.subclasses || [];
    if (names.length) {
      names.forEach((name) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = Roster.SUB_LABEL[name] || name;
        b.setAttribute("aria-pressed", name === data.subclass ? "true" : "false");
        b.addEventListener("click", () => {
          const id = hand.selected();
          if (!id) return;
          hand.setSubclass(id, name);
          showClassSheet(id);
        });
        subs.appendChild(b);
      });
      subs.hidden = false;
    } else {
      subs.hidden = true;
    }
  }
  const links = document.getElementById("panel-links");
  links.innerHTML = "";
  const list = data.links && data.links.length
    ? data.links
    : (data.href ? [{ href: data.href, label: data.linkLabel || "Open" }] : []);
  list.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = item.label || "Open";
    links.appendChild(a);
  });
  panel.hidden = false;
}

function hidePanel() {
  const panel = document.getElementById("panel");
  if (panel) panel.hidden = true;
  const fig = document.getElementById("panel-figure");
  if (fig) fig.hidden = true;
  const subs = document.getElementById("panel-subs");
  if (subs) {
    subs.innerHTML = "";
    subs.hidden = true;
  }
}

function hidePaper() {
  const el = document.getElementById("paper");
  if (el) el.hidden = true;
}

function showPaper() {
  hidePanel();
  const el = document.getElementById("paper");
  if (el) el.hidden = false;
}

function fitVolume() {
  if (!camera || !scene) return;
  if (portalSide === "museum") {
    scene.fog = null;
    if (camera.far !== 48) {
      camera.near = 0.12;
      camera.far = 48;
      camera.updateProjectionMatrix();
    }
    return;
  }
  if (fieldFog) scene.fog = fieldFog;
  if (camera.far !== 900) {
    camera.near = 0.1;
    camera.far = 900;
    camera.updateProjectionMatrix();
  }
}

function applyCamera() {
  fitVolume();
  Nav.lookVector(yaw, pitch, look);
  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(pos.x + look.x, pos.y + look.y, pos.z + look.z);
}

function groundY() {
  return portalSide === "museum" ? MUSEUM.y : heightAt(pos.x, pos.z);
}

function clampPos() {
  pos.x = Nav.clamp(pos.x, -BOUNDS, BOUNDS);
  pos.z = Nav.clamp(pos.z, -BOUNDS, BOUNDS);
  pos.y = Nav.clamp(pos.y, -BOUNDS * 0.55, BOUNDS * 0.55);
  pos.y = Nav.rideGround(pos.y, groundY(), EYE);
}

function currentPose() {
  return { x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch };
}

function applyPose(p) {
  if (!p) return;
  if (p.x != null) pos.x = p.x;
  if (p.y != null) pos.y = p.y;
  if (p.z != null) pos.z = p.z;
  if (p.yaw != null) yaw = p.yaw;
  if (p.pitch != null) pitch = p.pitch;
}

function startFly(to) {
  fly = {
    from: currentPose(),
    to: to,
    t: 0,
    dur: Roster.FLY_SEC
  };
}

function stepFly(dt) {
  if (!fly) return false;
  fly.t += dt;
  const u = Math.min(1, fly.t / fly.dur);
  applyPose(Nav.lerpPose(fly.from, fly.to, u));
  if (u >= 1) fly = null;
  return true;
}

function poseForClass(id) {
  if (id === "artist") return museumEye();
  const m = Roster.mark(id);
  if (!m) return Object.assign({}, Roster.ROSTER_POSE);
  const eye = Nav.eyeToward({ x: m.x, z: m.z }, { x: 0, z: 0 }, id === "journalist" ? 3.6 : 3.4);
  return {
    x: eye.x,
    y: heightAt(eye.x, eye.z) + EYE,
    z: eye.z,
    yaw: eye.yaw,
    pitch: -0.06
  };
}

function setRosterChrome(onRoster) {
  const roster = document.getElementById("roster");
  const back = document.getElementById("back");
  if (roster) roster.hidden = !onRoster;
  if (back) back.hidden = onRoster;
}

function showClassSheet(id) {
  const data = hand.sheet(id);
  if (!data) return;
  if (data.action === "paper") {
    hidePanel();
    showPaper();
    return;
  }
  hidePaper();
  showPanel(data);
}

function pickClass(id) {
  const next = hand.pick(id);
  if (!next) return null;
  setRosterChrome(false);
  if (next.action === "museum") {
    openMuseumVolume();
  } else if (portalSide === "museum") {
    portalSide = "forest";
    showMuseum(false);
  }
  startFly(poseForClass(id));
  showClassSheet(id);
  return next;
}

function returnToRoster() {
  fly = null;
  const home = hand.goHome();
  portalSide = "forest";
  portalCool = 0;
  showMuseum(false);
  hidePanel();
  hidePaper();
  applyPose(home.pose);
  prevPos.x = pos.x;
  prevPos.y = pos.y;
  prevPos.z = pos.z;
  setRosterChrome(true);
}

function goHome() {
  returnToRoster();
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
  if (obj.userData.paper) {
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
  const hud = (t) => t && t.closest && t.closest("#hud a, #hud button, #panel, #paper, #roster, #back");
  el.tabIndex = 0;
  wakeHand(el);

  function onWheel(e) {
    if (hud(e.target)) return;
    e.preventDefault();
    wakeHand(el);
    const now = performance.now();
    if (now - wheelReset > 90) {
      wheelBudget = 3.2;
      wheelReset = now;
    }
    const step = Nav.wheelCap(Nav.dollyStep(e.deltaY, e.deltaMode), wheelBudget);
    wheelBudget = Math.max(0, wheelBudget - Math.abs(step));
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    prevPos.z = pos.z;
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
    stepPortal();
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
  function onLookMove(e) {
    if (lookLocked) return;
    if (!dragging) return;
    const next = Nav.applyLook(yaw, pitch, e.clientX - lastX, e.clientY - lastY);
    yaw = next.yaw;
    pitch = next.pitch;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  el.addEventListener("pointermove", onLookMove);
  window.addEventListener("pointermove", onLookMove);
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

  el.addEventListener("pointerenter", () => {
    wakeHand(el);
  });
  window.addEventListener("keydown", (e) => {
    const flags = Nav.setHeld(held, e.code, e.key, true);
    if (Nav.isMoveKey(e.code, e.key)) e.preventDefault();
    if (flags.escape) {
      if (lookLocked) document.exitPointerLock();
      if (hand.selected()) returnToRoster();
      else {
        hidePanel();
        hidePaper();
      }
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
  const fold = document.getElementById("paper-close");
  if (fold) fold.addEventListener("click", hidePaper);
  const paper = document.getElementById("paper");
  if (paper) {
    paper.addEventListener("click", (e) => {
      if (e.target === paper) hidePaper();
    });
  }
}

function bindRoster() {
  const nav = document.getElementById("roster");
  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-class]");
      if (!btn) return;
      pickClass(btn.getAttribute("data-class"));
    });
  }
  const back = document.getElementById("back");
  if (back) back.addEventListener("click", returnToRoster);
}

function travel(dt) {
  if (fly) return;
  if (held.turnLeft) yaw -= TURN * dt;
  if (held.turnRight) yaw += TURN * dt;
  if (held.lookUp) pitch = Nav.clamp(pitch + TURN * dt, -Nav.PITCH_LIMIT, Nav.PITCH_LIMIT);
  if (held.lookDown) pitch = Nav.clamp(pitch - TURN * dt, -Nav.PITCH_LIMIT, Nav.PITCH_LIMIT);
  const speed = held.fast ? MOVE_FAST : MOVE;
  prevPos.x = pos.x;
  prevPos.y = pos.y;
  prevPos.z = pos.z;
  const offset = Nav.moveOffset(yaw, pitch, held, dt, speed);
  pos.x += offset.x;
  pos.y += offset.y;
  pos.z += offset.z;
  clampPos();
  if (portalCool > 0) portalCool = Math.max(0, portalCool - dt);
  stepPortal();
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
  const [guideTex, copperTex, mapTex, newsTex, webTex] = await Promise.all([
    loadTexture("assets/print/giving-guide-cover.jpg"),
    loadTexture("assets/shop/copper-horizon-overlay-1000x1500.jpg"),
    loadTexture("assets/maps/01-context.jpg"),
    loadTexture("assets/news/gazette-puffin.jpg"),
    loadTexture("assets/web/site-01.jpg")
  ]);

  if (guideTex) {
    easelAt(-10.4, -16.8, framedPiece(guideTex, 3.15), {
      title: "Giving Guide 2022–23",
      body: "Cover of the 2022–23 Tillamook County Giving Guide.",
      href: HOME_HREF,
      linkLabel: "Open graphicoregon.com"
    }, "Giving Guide", 4.2);
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
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!stepFly(dt)) travel(dt);
  applyCamera();
  const pulse = 0.3 + Math.sin(clock.elapsedTime * 1.55) * 0.1;
  portalVeils.forEach((veil) => {
    if (veil.material) veil.material.opacity = pulse;
  });
  if (newsieHold) {
    newsieHold.offer.rotation.x = newsieHold.rest + Math.sin(clock.elapsedTime * 1.3) * 0.045;
    facePrintedPage(newsieHold.sheet, camera.position);
  }
  billboards.forEach((obj) => {
    if (!obj.visible) return;
    if (obj.parent && obj.parent.visible === false) return;
    const dx = obj.position.x - camera.position.x;
    const dy = obj.position.y - camera.position.y;
    const dz = obj.position.z - camera.position.z;
    if (dx * dx + dy * dy + dz * dz < 0.04) return;
    obj.lookAt(camera.position);
  });
  renderer.render(scene, camera);
}

function main() {
  if (location.search) {
    history.replaceState(null, "", location.pathname + location.hash);
  }
  scene = new THREE.Scene();
  scene.background = new THREE.Color(DUSK);
  fieldFog = new THREE.Fog(HAZE, 70, 240);
  scene.fog = fieldFog;
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

  buildLand();
  buildPortal();
  buildMuseum();
  buildLineup();
  addWalkSigns();
  bindInput();
  bindRoster();
  applyPose(Roster.ROSTER_POSE);
  prevPos.x = pos.x;
  prevPos.y = pos.y;
  prevPos.z = pos.z;
  applyCamera();
  document.getElementById("loader").classList.add("hide");
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO));
    renderer.setSize(innerWidth, innerHeight);
  });
  tick();
  afterFirstPaint(() => {
    populatePieces().catch((err) => console.warn(err));
  });
}

window.__field = {
  getPose: () => ({ x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch }),
  setPose: (p) => {
    if (p.x != null) pos.x = p.x;
    if (p.y != null) pos.y = p.y;
    if (p.z != null) pos.z = p.z;
    if (p.yaw != null) yaw = p.yaw;
    if (p.pitch != null) pitch = p.pitch;
    if (p.side === "museum" || pos.y < MUSEUM.y + 10) portalSide = "museum";
    if (p.side === "forest") portalSide = "forest";
    showMuseum(portalSide === "museum");
    clampPos();
    stepPortal();
  },
  enterHall: enterMuseum,
  exitHall: exitMuseum,
  held: () => Object.assign({}, held),
  lookVector: () => Nav.lookVector(yaw, pitch),
  goHome: goHome,
  pickClass: pickClass,
  returnToRoster: returnToRoster,
  selectedClass: () => hand.selected(),
  rosterIds: () => Roster.IDS.slice(),
  spawn: Object.assign({}, Roster.ROSTER_POSE),
  billboardCount: () => billboards.length,
  billboardLabels: () => billboards.map((o) => o.userData.label).filter(Boolean),
  billboardPrints: () => billboards.filter((o) => o.userData.kind === "print").map((o) => o.userData.label),
  billboardPoses: () => billboards.map((o) => ({
    label: o.userData.label,
    kind: o.userData.kind,
    x: o.position.x,
    y: o.position.y,
    z: o.position.z
  })),
  hungArt: () => hungArt.slice(),
  hungCount: () => hungArt.length,
  portalSide: () => portalSide,
  paperOpen: () => {
    const el = document.getElementById("paper");
    return !!(el && !el.hidden);
  },
  newsieOffering: () => !!(newsieHold && newsieHold.sheet),
  newsieSheet: () => {
    if (!newsieHold || !newsieHold.sheet) return null;
    newsieHold.sheet.updateWorldMatrix(true, false);
    const v = newsieHold.sheet.getWorldPosition(new THREE.Vector3());
    return { x: v.x, y: v.y, z: v.z };
  },
  projectSheet: () => {
    if (!newsieHold || !newsieHold.sheet || !camera) return null;
    newsieHold.sheet.updateWorldMatrix(true, false);
    const v = newsieHold.sheet.getWorldPosition(new THREE.Vector3());
    v.project(camera);
    return { x: v.x, y: v.y, z: v.z };
  },
  showPaper: showPaper,
  hidePaper: hidePaper
};

main();
