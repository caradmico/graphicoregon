/* Graphic Oregon — a coastal clearing you can leave */

const teal = 0x2aa8a0;
const gold = 0xd4b05a;
const Nav = window.FieldNav;
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

function applyCamera() {
  Nav.lookVector(yaw, pitch, look);
  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(pos.x + look.x, pos.y + look.y, pos.z + look.z);
}

function clampPos() {
  pos.x = Nav.clamp(pos.x, -BOUNDS, BOUNDS);
  pos.z = Nav.clamp(pos.z, -BOUNDS, BOUNDS);
  pos.y = Nav.clamp(pos.y, -BOUNDS * 0.55, BOUNDS * 0.55);
  pos.y = Nav.rideGround(pos.y, heightAt(pos.x, pos.z), EYE);
}

function goHome() {
  pos.x = 0;
  pos.y = EYE;
  pos.z = 0;
  yaw = -0.38;
  pitch = -0.08;
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
  const hud = (t) => t && t.closest && t.closest("#hud a, #hud button, #panel");
  el.tabIndex = 0;
  wakeHand(el);

  function onWheel(e) {
    if (hud(e.target)) return;
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
}

function travel(dt) {
  if (held.turnLeft) yaw -= TURN * dt;
  if (held.turnRight) yaw += TURN * dt;
  const speed = held.fast ? MOVE_FAST : MOVE;
  const offset = Nav.moveOffset(yaw, pitch, held, dt, speed);
  pos.x += offset.x;
  pos.y += offset.y;
  pos.z += offset.z;
  clampPos();
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

  buildLand();
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
  getPose: () => ({ x: pos.x, y: pos.y, z: pos.z, yaw: yaw, pitch: pitch }),
  setPose: (p) => {
    if (p.x != null) pos.x = p.x;
    if (p.y != null) pos.y = p.y;
    if (p.z != null) pos.z = p.z;
    if (p.yaw != null) yaw = p.yaw;
    if (p.pitch != null) pitch = p.pitch;
    clampPos();
  },
  lookVector: () => Nav.lookVector(yaw, pitch),
  goHome: goHome,
  spawn: { x: 0, y: EYE, z: 0 },
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
