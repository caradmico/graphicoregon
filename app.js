/* Graphic Oregon — wanderable 3D portfolio */

const ink = 0x0a1014;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;

const REGIONS = [
  {
    id: "arrival",
    name: "Arrival",
    kind: "intro",
    pos: [0, 4, 18],
    look: [0, 3, 0],
    meta: "Graphic Oregon",
    title: "Technical design solutions",
    body: "Graphic Oregon blends creative design, scientific research, geospatial mapping, and IT expertise. Research, website design, media, and fine art — each a region in this space.",
    href: "https://graphicoregon.com/"
  },
  {
    id: "iau",
    name: "Astronomical Mapping",
    kind: "exploded",
    pos: [-38, 10, -70],
    look: [-38, 8, -88],
    meta: "Research · IAU proposal",
    title: "Astronomical Mapping — an IAU Proposal",
    body: "IAU 1930 boundaries (Delporte’s 88 constellations) often diverge from historical asterisms. The Aquarius–Pisces line from Beta to Iota Aquarii crosses into Capricornus. A dual system is proposed: keep cultural asterisms as an archive, and adopt a universe-centric reference from ICRS and Gaia.",
    href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/"
  },
  {
    id: "nano",
    name: "Nanoactuator Design",
    kind: "research",
    pos: [28, 7, -118],
    look: [28, 6, -132],
    meta: "Research · 2024",
    title: "Open-Source Nanoactuator Design",
    body: "A cost-effective nanoactuator built from hard-disk-drive mechanics, measured with a Michelson interferometer. Off-the-shelf parts and a low-cost optical table are used to open nanometer-scale positioning to more labs.",
    href: "https://graphicoregon.com/open-source-nanoactuator-design-utilizing-hard-disk-drive-components-precision-displacement-measurement-with-a-michelson-interferometer/"
  },
  {
    id: "eval",
    name: "Program Evaluation",
    kind: "research",
    pos: [42, 6, -148],
    look: [42, 5, -160],
    meta: "Research · inclusive arts",
    title: "Program Evaluation Methods",
    body: "Evaluation methods for inclusive art programs — a practical guide for measuring participation, equity, and outcomes.",
    href: "https://graphicoregon.com/program-evaluation-methods/"
  },
  {
    id: "lane",
    name: "Lane Arts Asset Map",
    kind: "research",
    pos: [18, 8, -168],
    look: [18, 7, -180],
    meta: "Research · Lane Arts Council",
    title: "Lane Arts Council Arts Asset Map User Guide",
    body: "A user guide to the Lane Arts Council arts asset map, written while coordinating arts equity research in Lane County.",
    href: "https://graphicoregon.com/lane-arts-council-arts-asset-map-user-guide/"
  },
  {
    id: "netarts",
    name: "Netarts Bay Watershed",
    kind: "exploded",
    pos: [-22, 6, -250],
    look: [-22, 5, -268],
    meta: "Research · Demeter Design, 2008",
    title: "Netarts Bay Watershed Habitat Assessment",
    body: "Prepared for the Tillamook Estuaries Partnership. A ~17,000-acre North Coast watershed and ~2,000-acre saline estuary. Poorly sorted spawning gravels are the primary limiter for Chum; summer rearing is an equal limiter for Coho. Maps and findings hang in this region — not an embedded report.",
    href: "https://graphicoregon.com/netarts-bay-watershed-habitat-assessment/"
  },
  {
    id: "nehalem",
    name: "East Fork Nehalem",
    kind: "research",
    pos: [36, 5, -292],
    look: [36, 4, -304],
    meta: "Research · habitat assessment",
    title: "East Fork Nehalem Watershed Assessment",
    body: "Watershed assessment for the East Fork Nehalem — habitat, sediment, and restoration context on Oregon’s North Coast.",
    href: "https://graphicoregon.com/east-fork-nehalem-watershed-assessment/"
  },
  {
    id: "tillamook-bay",
    name: "Tillamook Bay Restoration",
    kind: "research",
    pos: [48, 7, -318],
    look: [48, 6, -330],
    meta: "Research · restoration plan",
    title: "Tillamook Bay Watershed Habitat Restoration Plan",
    body: "Habitat restoration planning for the Tillamook Bay watershed, including computational ecological restoration priorities.",
    href: "https://graphicoregon.com/tillamook-bay-watershed-habitat-restoration-plan/"
  },
  {
    id: "nestucca",
    name: "Upper Nestucca",
    kind: "research",
    pos: [24, 6, -340],
    look: [24, 5, -352],
    meta: "Research · sediment and habitat",
    title: "Upper Nestucca Sediment and Habitat Study",
    body: "Sediment and habitat study for the Upper Nestucca, part of a coastal assessment series for land managers and restoration partners.",
    href: "https://graphicoregon.com/upper-nestucca-sediment-and-habitat-study/"
  },
  {
    id: "siuslaw",
    name: "North Fork Siuslaw",
    kind: "research",
    pos: [56, 5, -356],
    look: [56, 4, -368],
    meta: "Research · sediment and habitat",
    title: "North Fork Siuslaw Sediment and Habitat Assessment",
    body: "Sediment and habitat assessment for the North Fork Siuslaw watershed.",
    href: "https://graphicoregon.com/north-fork-siuslaw-sediment-and-habitat-assessment/"
  },
  {
    id: "tillamook-river",
    name: "Tillamook River",
    kind: "research",
    pos: [32, 8, -380],
    look: [32, 7, -392],
    meta: "Research · limiting factors",
    title: "Tillamook River Limiting Factors Assessment",
    body: "Limiting-factors assessment for salmonid habitat in the Tillamook River basin.",
    href: "https://graphicoregon.com/tillamook-river-limiting-factors-assessment/"
  },
  {
    id: "necanicum",
    name: "Necanicum Habitat Mapping",
    kind: "research",
    pos: [44, 6, -402],
    look: [44, 5, -414],
    meta: "Research · habitat mapping",
    title: "Necanicum Habitat Mapping",
    body: "Habitat mapping for the Necanicum watershed, published as a map package for restoration and land-use work.",
    href: "https://graphicoregon.com/necanicum-habitat-mapping/"
  },
  {
    id: "nhmp",
    name: "Hazard Mitigation Plan",
    kind: "research",
    pos: [20, 7, -422],
    look: [20, 6, -434],
    meta: "Research · Tillamook County",
    title: "Tillamook County Natural Hazard Mitigation Plan",
    body: "Natural hazard mitigation planning for Tillamook County — mapping risk so communities can prepare.",
    href: "https://graphicoregon.com/tillamook-county-natural-hazard-mitigation-plan/"
  },
  {
    id: "websites",
    name: "Website Design",
    kind: "web",
    pos: [-30, 7, -500],
    look: [-30, 6, -518],
    meta: "Website design and management",
    title: "Website work",
    body: "HTML/CSS, responsive applications, and long-term site management. Named work from the Graphic Oregon studio: Tillamook County Pioneer, Color Outside the Lines, Pete Anderson Realty, Oceanside Cougar Ridge, Gold and Silver Market Update, Big Wave Cafe, Offshore Grill, Smiley Salmon, Manzanita Beach Company, Coast Broadcasting, Brag Props, and House.Me App. Screenshots from the studio gallery hang here.",
    href: "https://graphicoregon.com/"
  },
  {
    id: "art",
    name: "Fine Art",
    kind: "art",
    pos: [8, 6, -620],
    look: [8, 5, -640],
    meta: "Oil · acrylic · ink · digital · charcoal",
    title: "Fine art and illustration",
    body: "A working studio practice — figures, portraits, still lifes, coast studies, and prints. Open to commissions.",
    href: "https://graphicoregon.com/sample-page/"
  }
];

const IAU_CARDS = [
  ["Delporte, 1930", "Eighty-eight constellation boundaries drawn on right ascension and declination, tied to B1875.0 / B1900.0 and the Uranometría Argentina."],
  ["Aquarius–Pisces", "The Beta–Iota Aquarii line crosses into Capricornus and parts from the water-bearer’s traditional shape. Pisces includes post-telescope stars."],
  ["Precession", "Earth-centric borders lose meaning in J2000.0. Proper motion will reshape the sky over millennia."],
  ["Cultural archive", "Chinese lunar mansion Xu (β Aquarii), the Indigenous Australian Emu in the Sky, Polynesian Matariki, Babylonian MUL.APIN and Anunitum, Indian Nakshatras, the Dendera Zodiac."],
  ["Dual system", "Preserve cultural asterisms as heritage. Build a universe-centric map on ICRS and Gaia’s three-dimensional stellar data."]
];

const NETARTS_CARDS = [
  ["Place", "Netarts Bay: a ~2,000-acre saline estuary and ~17,000-acre watershed, 11 miles from Tillamook. Rare habitat variety in a small basin."],
  ["Charge", "Demeter Design, 2008, for the Tillamook Estuaries Partnership. ODFW Aquatic Inventories plus a modified limiting-factors protocol."],
  ["Limiter", "Poorly sorted, embedded spawning gravels — low wood volume — are the primary limiter for Chum. Summer rearing equals that for Coho. Temperature met state standards."],
  ["Fish", "Coho, Steelhead, Chum, and Cutthroat. Netarts is the southern extent of Chum. Whiskey Creek held the most juveniles observed."],
  ["Streams", "Whiskey, Jackson Complex, Austin, Crown Zellarbach, Yeager, Lower Northbay, Rice, O’Hara, Hodgdon, and Fall Creeks."],
  ["Repair", "High priorities: conservation easements on North Fork Whiskey and Fall; culvert replacements; large-wood placement; hatchery diversion upgrade."]
];

const WEB_NAMES = [
  "Tillamook County Pioneer",
  "Color Outside the Lines",
  "Pete Anderson Realty",
  "Oceanside Cougar Ridge",
  "Gold and Silver Market Update",
  "Big Wave Cafe",
  "Offshore Grill",
  "Smiley Salmon",
  "Manzanita Beach Company",
  "Coast Broadcasting",
  "Brag Props",
  "House.Me App"
];

const ARTWORKS = [
  ["assets/art/neahkahnie.jpg", "Neahkahnie"],
  ["assets/art/nehalem.jpg", "Nehalem"],
  ["assets/art/violet-flame.jpg", "Violet Flame"],
  ["assets/art/ocean.jpg", "Ocean"],
  ["assets/art/bird.jpg", "Bird"],
  ["assets/art/cat.jpg", "Cat"],
  ["assets/art/dog.jpg", "Dog"],
  ["assets/art/ghost.jpg", "Ghost"],
  ["assets/art/broken.jpg", "Broken"],
  ["assets/art/large-jelly.jpg", "Large Jelly"],
  ["assets/art/female-figure-oil.jpg", "Female figure, oil on paper"],
  ["assets/art/female-figure-charcoal.jpg", "Female figure, charcoal"],
  ["assets/art/female-nude-charcoal.jpg", "Figure study, charcoal"],
  ["assets/art/female-portrait-acrylic.jpg", "Portrait, acrylic"],
  ["assets/art/female-portrait-oil.jpg", "Portrait, oil"],
  ["assets/art/female-portrait-oil-3.jpg", "Portrait, oil"],
  ["assets/art/leg-in-water.jpg", "Leg in water, oil on paper"],
  ["assets/art/self-portrait-acrylic.jpg", "Self-portrait, acrylic"],
  ["assets/art/self-portrait-charcoal.jpg", "Self-portrait, charcoal"],
  ["assets/art/self-portrait-graphite.jpg", "Self-portrait, graphite"],
  ["assets/art/monochromatic-self-portrait.jpg", "Monochromatic self-portrait, oil"],
  ["assets/art/still-life-acrylic.jpg", "Still life, acrylic"],
  ["assets/art/still-life-charcoal.jpg", "Still life, charcoal"],
  ["assets/art/still-life-graphite.jpg", "Still life, graphite"],
  ["assets/art/cloth-study.jpg", "Cloth study, charcoal"],
  ["assets/art/linoleum-print.jpg", "Linoleum print"],
  ["assets/art/mono-print.jpg", "Mono print"],
  ["assets/art/street-scene.jpg", "Street scene, charcoal, conté, marker"],
  ["assets/art/composition-study.jpg", "Composition study"],
  ["assets/art/male-portrait.jpg", "Portrait, oil pastel and charcoal"],
  ["assets/art/mixed-media-gouache.jpg", "Mixed media, gouache on Canson"]
];

const MAPS = [
  ["assets/maps/01-context.jpg", "Map 1 — Context"],
  ["assets/maps/02-geology-streams.jpg", "Map 2 — Geology and streams surveyed"],
  ["assets/maps/03-nwi-a.jpg", "Map 3a — National Wetlands Inventory"],
  ["assets/maps/03-nwi-b.jpg", "Map 3b — National Wetlands Inventory"],
  ["assets/maps/04-intrinsic-potential.jpg", "Map 4 — Intrinsic potential"],
  ["assets/maps/05-landslide-risk.jpg", "Map 5 — Landslide risk"],
  ["assets/maps/06-passage-barriers.jpg", "Map 6 — Passage barriers"],
  ["assets/maps/07-whiskey-creek.jpg", "Map 7 — Whiskey Creek geology"],
  ["assets/maps/08-jackson-creek.jpg", "Map 8 — Jackson Creek geology"],
  ["assets/maps/16-restoration-projects.jpg", "Map 16 — Restoration projects"]
];

const WEBSHOTS = [
  "assets/web/site-01.jpg",
  "assets/web/site-02.jpg",
  "assets/web/site-03.jpg",
  "assets/web/site-04.jpg",
  "assets/web/site-05.jpg",
  "assets/web/site-06.jpg",
  "assets/web/site-07.jpg",
  "assets/web/site-08.jpg",
  "assets/web/site-09.jpg"
];

const clickables = [];
let scene, camera, renderer, path;
let travel = 0;
let targetTravel = 0;
let flying = null;
let lookYaw = 0;
let lookPitch = 0;
let dragging = false;
let lastX = 0;
let lastY = 0;
let keys = {};
const clock = new THREE.Clock();

function makeLabel(text, opts = {}) {
  const w = opts.w || 1024;
  const h = opts.h || 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = opts.bg || "rgba(10,16,20,0.72)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = opts.stroke || "rgba(212,176,90,0.7)";
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 3, w - 6, h - 6);
  ctx.fillStyle = opts.color || "#e8d29a";
  ctx.font = opts.font || "600 64px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  wrapText(ctx, text, w / 2, h / 2, w - 80, opts.lh || 72);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(opts.pw || 8, opts.ph || 2), mat);
  return mesh;
}

function wrapText(ctx, text, x, y, max, lh) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > max && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  const start = y - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, x, start + i * lh));
}

function makeCard(title, body) {
  const w = 1024, h = 640;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(12,20,24,0.86)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(42,168,160,0.75)";
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.fillStyle = "#d4b05a";
  ctx.font = "600 48px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText(title, 48, 88);
  ctx.fillStyle = "#e8efe8";
  ctx.font = "32px Georgia, serif";
  const words = body.split(" ");
  let line = "", y = 160;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > w - 96) {
      ctx.fillText(line, 48, y);
      line = word + " ";
      y += 46;
    } else line = test;
  }
  ctx.fillText(line, 48, y);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 4.5),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
  return mesh;
}

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      resolve(tex);
    }, undefined, reject);
  });
}

function imagePlane(tex, maxW) {
  const img = tex.image;
  const aspect = img.width / img.height;
  const w = aspect >= 1 ? maxW : maxW * aspect;
  const h = aspect >= 1 ? maxW / aspect : maxW;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(w + 0.12, h + 0.12),
    new THREE.MeshBasicMaterial({ color: gold, side: THREE.DoubleSide })
  );
  frame.position.z = -0.02;
  mesh.add(frame);
  return mesh;
}

function addStars() {
  const n = 2800;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 900;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
    pos[i * 3 + 2] = -Math.random() * 900 + 80;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0xcfe8e4, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.85 });
  scene.add(new THREE.Points(g, m));
}

function addBeacon(region) {
  const geo = new THREE.SphereGeometry(0.35, 24, 24);
  const mat = new THREE.MeshBasicMaterial({ color: region.kind === "exploded" ? gold : teal });
  const orb = new THREE.Mesh(geo, mat);
  orb.position.set(...region.pos);
  orb.userData.regionId = region.id;
  scene.add(orb);
  clickables.push(orb);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 1.25, 48),
    new THREE.MeshBasicMaterial({ color: gold, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(region.pos[0], region.pos[1] - 1.6, region.pos[2]);
  scene.add(ring);
  const title = makeLabel(region.name, { pw: 7.5, ph: 1.6, font: "600 56px Georgia, serif" });
  title.position.set(region.pos[0], region.pos[1] + 2.2, region.pos[2]);
  title.userData.regionId = region.id;
  scene.add(title);
  clickables.push(title);
}

function constellation(origin) {
  const group = new THREE.Group();
  group.position.set(...origin);
  const stars = [
    [-8, 4, -6], [-4, 6, -10], [0, 5, -8], [4, 7, -12], [8, 4, -7],
    [-6, 1, -14], [-1, 2, -16], [5, 1, -15], [9, 3, -18],
    [-10, 8, -4], [2, 9, -5], [11, 6, -9]
  ];
  const pts = [];
  stars.forEach((p) => {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xf3e6b8 })
    );
    s.position.set(...p);
    group.add(s);
    pts.push(new THREE.Vector3(...p));
  });
  const links = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[1,10],[10,11],[4,11],[2,6]];
  links.forEach(([a, b]) => {
    const g = new THREE.BufferGeometry().setFromPoints([pts[a], pts[b]]);
    group.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: teal, transparent: true, opacity: 0.7 })));
  });
  const names = [
    ["Xu (β Aquarii)", -10, 10, -4],
    ["Emu in the Sky", 2, 12, -5],
    ["Matariki", 12, 8, -9],
    ["Dendera Zodiac", -9, -1, -6],
    ["MUL.APIN", 8, -1, -18],
    ["ICRS / Gaia", 0, 11, -8]
  ];
  names.forEach(([t, x, y, z]) => {
    const lab = makeLabel(t, { w: 900, h: 180, pw: 5.5, ph: 1.1, font: "500 48px Georgia, serif", stroke: "rgba(42,168,160,0.7)" });
    lab.position.set(x, y, z);
    group.add(lab);
  });
  IAU_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    const ang = (i / IAU_CARDS.length) * Math.PI * 1.4 - 0.4;
    m.position.set(Math.cos(ang) * 16, 2 + (i % 3) * 1.4, -10 + Math.sin(ang) * 12);
    m.lookAt(0, 3, 0);
    m.userData.regionId = "iau";
    group.add(m);
    clickables.push(m);
  });
  scene.add(group);
}

async function populate() {
  REGIONS.forEach(addBeacon);

  constellation([-38, 8, -88]);

  const netarts = REGIONS.find((r) => r.id === "netarts");
  const [nx, ny, nz] = netarts.pos;
  NETARTS_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    const col = i % 3;
    const row = Math.floor(i / 3);
    m.position.set(nx - 10 + col * 8, ny + 1.5 - row * 5.2, nz - 8);
    m.userData.regionId = "netarts";
    scene.add(m);
    clickables.push(m);
  });

  const mapTex = await Promise.all(MAPS.map(([u]) => loadTexture(u)));
  mapTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 6.4);
    const a = (i / MAPS.length) * Math.PI * 2;
    const r = 16;
    plane.position.set(nx + Math.cos(a) * r, ny + Math.sin(i) * 2.2, nz - 14 + Math.sin(a) * r * 0.55);
    plane.lookAt(nx, ny, nz - 6);
    plane.userData.regionId = "netarts";
    plane.userData.title = MAPS[i][1];
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(MAPS[i][1], { w: 900, h: 160, pw: 5.2, ph: 0.9, font: "500 40px Georgia, serif" });
    cap.position.copy(plane.position);
    cap.position.y -= 3.6;
    cap.lookAt(nx, ny, nz - 6);
    scene.add(cap);
  });

  const artOrigin = REGIONS.find((r) => r.id === "art").pos;
  const artTex = await Promise.all(ARTWORKS.map(([u]) => loadTexture(u)));
  artTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 4.6);
    const cols = 8;
    const col = i % cols;
    const row = Math.floor(i / cols);
    plane.position.set(artOrigin[0] - 16 + col * 5.1, artOrigin[1] + 4 - row * 6.2, artOrigin[2] - 12 - (row % 2) * 3);
    plane.userData.regionId = "art";
    plane.userData.title = ARTWORKS[i][1];
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(ARTWORKS[i][1], { w: 900, h: 160, pw: 4.4, ph: 0.78, font: "500 42px Georgia, serif" });
    cap.position.copy(plane.position);
    cap.position.y -= 2.7;
    scene.add(cap);
  });

  const webOrigin = REGIONS.find((r) => r.id === "websites").pos;
  const webTex = await Promise.all(WEBSHOTS.map((u) => loadTexture(u)));
  webTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 6.8);
    const col = i % 3;
    const row = Math.floor(i / 3);
    plane.position.set(webOrigin[0] - 10 + col * 8.2, webOrigin[1] + 3 - row * 5.4, webOrigin[2] - 10);
    plane.userData.regionId = "websites";
    plane.userData.title = "Website gallery";
    scene.add(plane);
    clickables.push(plane);
  });
  WEB_NAMES.forEach((name, i) => {
    const plaque = makeLabel(name, { w: 900, h: 180, pw: 6.2, ph: 1.15, font: "500 44px Georgia, serif", stroke: "rgba(42,168,160,0.75)" });
    const col = i % 3;
    const row = Math.floor(i / 3);
    plaque.position.set(webOrigin[0] - 10 + col * 8.2, webOrigin[1] - 6.5 - row * 1.5, webOrigin[2] - 4);
    plaque.userData.regionId = "websites";
    scene.add(plaque);
    clickables.push(plaque);
  });

  const arrival = makeLabel("Research · Website design · Media · Fine art", {
    w: 1400, h: 220, pw: 14, ph: 2.2, font: "500 52px Georgia, serif"
  });
  arrival.position.set(0, 1.2, 2);
  scene.add(arrival);
}

function buildPath() {
  const pts = [
    new THREE.Vector3(0, 6, 36),
    new THREE.Vector3(0, 5, 10),
    new THREE.Vector3(-20, 9, -40),
    new THREE.Vector3(-38, 10, -68),
    new THREE.Vector3(-10, 8, -100),
    new THREE.Vector3(28, 8, -124),
    new THREE.Vector3(30, 7, -170),
    new THREE.Vector3(-8, 7, -220),
    new THREE.Vector3(-22, 7, -248),
    new THREE.Vector3(10, 7, -290),
    new THREE.Vector3(40, 7, -350),
    new THREE.Vector3(10, 7, -430),
    new THREE.Vector3(-30, 8, -498),
    new THREE.Vector3(-8, 7, -560),
    new THREE.Vector3(8, 7, -618)
  ];
  path = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.25);
}

function regionForTravel(t) {
  const p = path.getPointAt(t);
  let best = REGIONS[0];
  let d = 1e9;
  for (const r of REGIONS) {
    const dd = p.distanceTo(new THREE.Vector3(...r.pos));
    if (dd < d) { d = dd; best = r; }
  }
  return best;
}

function showRegion(region, extraTitle) {
  document.getElementById("region-name").textContent = region.name;
  const panel = document.getElementById("panel");
  panel.hidden = false;
  document.getElementById("panel-meta").textContent = region.meta;
  document.getElementById("panel-title").textContent = extraTitle || region.title;
  document.getElementById("panel-body").textContent = region.body;
  const a = document.getElementById("panel-link");
  a.href = region.href;
  a.textContent = "Open on graphicoregon.com";
  document.querySelectorAll("#destinations button").forEach((b) => {
    b.classList.toggle("active", b.dataset.id === region.id);
  });
}

function flyTo(region) {
  const dest = new THREE.Vector3(...region.pos);
  let bestT = 0, best = 1e9;
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const d = path.getPointAt(t).distanceTo(dest);
    if (d < best) { best = d; bestT = t; }
  }
  flying = { from: travel, to: Math.max(0, bestT - 0.012), t: 0 };
  showRegion(region);
}

function setupNav() {
  const nav = document.getElementById("destinations");
  REGIONS.forEach((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.id = r.id;
    b.textContent = r.name;
    b.addEventListener("click", () => flyTo(r));
    nav.appendChild(b);
  });
}

function onPointer(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  const ray = new THREE.Raycaster();
  ray.setFromCamera({ x, y }, camera);
  const hits = ray.intersectObjects(clickables, true);
  if (!hits.length) return;
  let obj = hits[0].object;
  while (obj && !obj.userData.regionId && obj.parent) obj = obj.parent;
  const id = obj && obj.userData.regionId;
  const region = REGIONS.find((r) => r.id === id);
  if (region) {
    showRegion(region, obj.userData.title);
    flyTo(region);
  }
}

function bindInput() {
  const el = renderer.domElement;
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    targetTravel = THREE.MathUtils.clamp(targetTravel + e.deltaY * 0.00038, 0, 1);
  }, { passive: false });
  let downX = 0, downY = 0;
  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    lookYaw -= (e.clientX - lastX) * 0.004;
    lookPitch -= (e.clientY - lastY) * 0.003;
    lookPitch = THREE.MathUtils.clamp(lookPitch, -0.7, 0.7);
    lastX = e.clientX;
    lastY = e.clientY;
  });
  el.addEventListener("pointerup", (e) => {
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    dragging = false;
    if (Math.hypot(dx, dy) < 7) onPointer(e);
  });
  window.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  let step = 0;
  if (keys.w || keys.arrowup) step += 0.12;
  if (keys.s || keys.arrowdown) step -= 0.12;
  if (keys.a || keys.arrowleft) lookYaw += dt * 0.9;
  if (keys.d || keys.arrowright) lookYaw -= dt * 0.9;
  if (step) targetTravel = THREE.MathUtils.clamp(targetTravel - step * dt, 0, 1);

  if (flying) {
    flying.t += dt * 0.85;
    const k = Math.min(1, flying.t);
    const s = k * k * (3 - 2 * k);
    travel = flying.from + (flying.to - flying.from) * s;
    targetTravel = travel;
    if (k >= 1) flying = null;
  } else {
    travel += (targetTravel - travel) * 0.06;
  }

  const t = THREE.MathUtils.clamp(travel, 0, 0.999);
  const pos = path.getPointAt(t);
  const look = path.getPointAt(Math.min(0.999, t + 0.018));
  const dir = look.clone().sub(pos).normalize();
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, dir).normalize();
  const aim = look.clone()
    .add(right.multiplyScalar(Math.sin(lookYaw) * 8))
    .add(up.multiplyScalar(Math.sin(lookPitch) * 5));
  camera.position.lerp(pos, 0.18);
  camera.lookAt(aim);

  const region = regionForTravel(t);
  document.getElementById("region-name").textContent = region.name;
  renderer.render(scene, camera);
}

async function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(ink);
  scene.fog = new THREE.FogExp2(0x0a1216, 0.0085);
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 800);
  camera.position.set(0, 6, 36);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene.add(new THREE.AmbientLight(0x6f8a88, 0.9));
  const key = new THREE.PointLight(0x2aa8a0, 18, 80);
  key.position.set(6, 14, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0xd4b05a, 12, 90);
  rim.position.set(-12, 8, -40);
  scene.add(rim);

  addStars();
  buildPath();
  setupNav();
  await populate();
  bindInput();
  showRegion(REGIONS[0]);
  document.getElementById("loader").classList.add("hide");
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  tick();
}

main().catch((err) => {
  console.error(err);
  document.getElementById("loader").querySelector("p").textContent = "Unable to load the gallery. Refresh to try again.";
});
