/* Graphic Oregon — standing figures. Face maps from her portraits. Costume is a prop. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Figure = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const HER = [
    { id: "journalist", file: "self-portrait-charcoal.jpg", ink: 0x1a3a42 },
    { id: "scientist", file: "self-portrait-graphite.jpg", ink: 0x3d4a38 },
    { id: "radio", file: "monochromatic-self-portrait.jpg", ink: 0x2a2e38 },
    { id: "artist", file: "self-portrait-acrylic.jpg", ink: 0x8a6a4a },
    { id: "teacher", file: "female-portrait-oil.jpg", ink: 0x5a3a28 },
    { id: "musician", file: "female-portrait-oil-3.jpg", ink: 0x1c1814 }
  ];

  const SPACING = 1.48;
  const LINE_Z = -0.4;

  function herAt(i) {
    const n = HER.length;
    const x = (i - (n - 1) / 2) * SPACING;
    return Object.assign({ x: x, z: LINE_Z }, HER[i]);
  }

  function lineupSlots() {
    return HER.map(function (_, i) { return herAt(i); });
  }

  function vec2(x, y) {
    return new THREE.Vector2(x, y);
  }

  function lathe(pts, segs, start, span) {
    const profile = pts.map(function (p) { return vec2(p[0], p[1]); });
    const geo = new THREE.LatheGeometry(
      profile,
      segs == null ? 28 : segs,
      start == null ? 0 : start,
      span == null ? Math.PI * 2 : span
    );
    geo.computeVertexNormals();
    return geo;
  }

  function mapHeadUVs(geo) {
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const cy = (box.min.y + box.max.y) * 0.5;
    const h = Math.max(1e-6, box.max.y - box.min.y);
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const lon = Math.atan2(x, z);
      const u = 0.5 + (lon / Math.PI) * 0.48;
      const v = 0.9 - ((y - box.min.y) / h) * 0.82;
      uv.setXY(i, u, v);
    }
    uv.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function cropFaceCanvas(img) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const cw = Math.round(w * 0.82);
    const ch = Math.round(h * 0.74);
    const sx = Math.round((w - cw) / 2);
    const sy = Math.max(0, Math.round(h * 0.03));
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, sx, sy, cw, Math.min(ch, h - sy), 0, 0, 512, 512);
    return c;
  }

  function faceTexture(img) {
    const c = cropFaceCanvas(img);
    if (!c) return null;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.anisotropy = 4;
    return tex;
  }

  function shade(mesh, cast, receive) {
    mesh.castShadow = !!cast;
    mesh.receiveShadow = receive !== false;
    return mesh;
  }

  function skinMat(hex) {
    return new THREE.MeshStandardMaterial({
      color: hex == null ? 0xc4a07a : hex,
      roughness: 0.78,
      metalness: 0.02
    });
  }

  function clothMat(hex) {
    return new THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.86,
      metalness: 0.04
    });
  }

  function faceMat(tex) {
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.02
    });
  }

  function headGeo() {
    return mapHeadUVs(lathe([
      [0.002, 0.17],
      [0.055, 0.162],
      [0.092, 0.138],
      [0.112, 0.09],
      [0.12, 0.03],
      [0.116, -0.02],
      [0.102, -0.07],
      [0.072, -0.112],
      [0.038, -0.138],
      [0.002, -0.15]
    ], 36));
  }

  function hairGeo() {
    return lathe([
      [0.04, 0.188],
      [0.1, 0.176],
      [0.132, 0.14],
      [0.138, 0.06],
      [0.128, -0.02],
      [0.11, -0.08],
      [0.08, -0.12],
      [0.04, -0.1]
    ], 28, Math.PI * 0.38, Math.PI * 1.24);
  }

  function neckGeo() {
    return lathe([
      [0.038, 0.04],
      [0.042, 0.0],
      [0.05, -0.05],
      [0.062, -0.08]
    ], 20);
  }

  function torsoGeo() {
    return lathe([
      [0.08, 0.42],
      [0.14, 0.4],
      [0.168, 0.34],
      [0.155, 0.22],
      [0.128, 0.1],
      [0.138, -0.02],
      [0.162, -0.12],
      [0.15, -0.2],
      [0.08, -0.24]
    ], 32);
  }

  function limbGeo(len, r0, r1) {
    const pts = [];
    for (let i = 0; i <= 12; i += 1) {
      const t = i / 12;
      const swell = Math.sin(t * Math.PI) * 0.01;
      pts.push([r0 + (r1 - r0) * t + swell, -t * len]);
    }
    return lathe(pts, 16);
  }

  function footGeo() {
    return lathe([
      [0.01, 0.04],
      [0.042, 0.03],
      [0.05, 0.0],
      [0.038, -0.02],
      [0.01, -0.025]
    ], 14);
  }

  function paperProp() {
    const g = new THREE.Group();
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 168;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f4ead2";
    ctx.fillRect(0, 0, 128, 168);
    ctx.fillStyle = "#1a1712";
    ctx.font = "700 14px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("GRAPHIC", 64, 28);
    ctx.fillText("OREGON", 64, 46);
    ctx.fillStyle = "#2aa8a0";
    ctx.fillRect(14, 54, 100, 2);
    ctx.fillStyle = "rgba(26,23,18,0.16)";
    for (let i = 0; i < 7; i += 1) {
      ctx.fillRect(16, 68 + i * 12, 96, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.3),
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.62,
        metalness: 0.02,
        side: THREE.DoubleSide
      })
    );
    sheet.rotation.y = -0.35;
    sheet.rotation.x = 0.12;
    g.add(sheet);
    return g;
  }

  function mapProp() {
    const g = new THREE.Group();
    const roll = new THREE.Mesh(
      lathe([[0.01, 0.11], [0.028, 0.1], [0.028, -0.1], [0.01, -0.11]], 14),
      clothMat(0xc4b396)
    );
    roll.rotation.z = Math.PI / 2;
    g.add(roll);
    return g;
  }

  function radioProp() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      lathe([[0.02, 0.08], [0.05, 0.07], [0.055, -0.02], [0.04, -0.06], [0.01, -0.07]], 16),
      clothMat(0x2aa8a0)
    );
    g.add(body);
    return g;
  }

  function brushProp() {
    const g = new THREE.Group();
    const handle = new THREE.Mesh(limbGeo(0.22, 0.012, 0.008), clothMat(0x3a2414));
    const tip = new THREE.Mesh(
      lathe([[0.002, 0.04], [0.018, 0.02], [0.01, -0.01], [0.002, -0.02]], 10),
      clothMat(0xd4b05a)
    );
    tip.position.y = 0.02;
    g.add(handle, tip);
    return g;
  }

  function bookProp() {
    const g = new THREE.Group();
    const cover = new THREE.Mesh(
      lathe([[0.01, 0.08], [0.09, 0.075], [0.09, -0.01], [0.01, -0.015]], 18, 0, Math.PI),
      clothMat(0x2aa8a0)
    );
    cover.rotation.x = Math.PI / 2;
    g.add(cover);
    return g;
  }

  function propFor(id) {
    if (id === "journalist") return paperProp();
    if (id === "scientist") return mapProp();
    if (id === "radio") return radioProp();
    if (id === "artist") return brushProp();
    if (id === "teacher") return bookProp();
    return null;
  }

  function markClass(obj, id) {
    obj.userData.id = id;
    obj.userData.classId = id;
    obj.traverse(function (child) {
      if (child.isMesh) {
        child.userData.id = id;
        child.userData.classId = id;
      }
    });
    return obj;
  }

  function buildFigure(spec, tex) {
    const g = new THREE.Group();
    const cloth = clothMat(spec.ink);
    const skin = skinMat(0xc4a07a);
    const hair = clothMat(0x2a1c14);
    const face = tex ? faceMat(tex) : skinMat(0xc4a07a);

    const head = shade(new THREE.Mesh(headGeo(), face), true, true);
    head.position.set(0, 1.55, 0.02);
    head.rotation.y = 0;
    const hairMesh = shade(new THREE.Mesh(hairGeo(), hair), true, true);
    hairMesh.position.set(0, 1.55, 0);
    const neck = shade(new THREE.Mesh(neckGeo(), skin), true, true);
    neck.position.set(0, 1.42, 0.01);
    const torso = shade(new THREE.Mesh(torsoGeo(), cloth), true, true);
    torso.position.set(0, 1.12, 0);

    const armL = shade(new THREE.Mesh(limbGeo(0.58, 0.038, 0.022), skin), true, true);
    armL.position.set(-0.2, 1.36, 0.02);
    armL.rotation.z = 0.18;
    armL.rotation.x = 0.08;
    const armR = shade(new THREE.Mesh(limbGeo(0.58, 0.038, 0.022), skin), true, true);
    armR.position.set(0.2, 1.36, 0.04);
    armR.rotation.z = -0.22;
    armR.rotation.x = spec.id === "journalist" ? -0.55 : 0.06;

    const legL = shade(new THREE.Mesh(limbGeo(0.78, 0.055, 0.028), cloth), true, true);
    legL.position.set(-0.07, 0.88, 0.01);
    const legR = shade(new THREE.Mesh(limbGeo(0.78, 0.055, 0.028), cloth), true, true);
    legR.position.set(0.07, 0.88, -0.01);

    const footL = shade(new THREE.Mesh(footGeo(), clothMat(0x1a1712)), true, true);
    footL.position.set(-0.08, 0.06, 0.04);
    footL.rotation.x = Math.PI / 2;
    const footR = shade(new THREE.Mesh(footGeo(), clothMat(0x1a1712)), true, true);
    footR.position.set(0.08, 0.06, 0.04);
    footR.rotation.x = Math.PI / 2;

    g.add(head, hairMesh, neck, torso, armL, armR, legL, legR, footL, footR);

    const prop = propFor(spec.id);
    if (prop) {
      if (spec.id === "journalist") prop.position.set(0.28, 1.12, 0.22);
      else if (spec.id === "scientist") prop.position.set(0.26, 1.08, 0.16);
      else if (spec.id === "radio") prop.position.set(0.24, 1.1, 0.18);
      else if (spec.id === "artist") {
        prop.position.set(0.26, 1.14, 0.16);
        prop.rotation.z = -0.7;
      } else if (spec.id === "teacher") prop.position.set(0.24, 1.08, 0.14);
      g.add(prop);
    }

    g.position.set(spec.x, 0, spec.z);
    markClass(g, spec.id);
    g.userData.self = spec.id;
    g.userData.file = spec.file;
    g.userData.kind = "figure";
    return g;
  }

  function duskGround() {
    const geo = lathe([
      [0.2, 0.01],
      [12, 0.0],
      [12, -0.04],
      [0.2, -0.05]
    ], 48);
    return shade(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x2a1c14,
      roughness: 0.94,
      metalness: 0.04
    })), false, true);
  }

  return {
    HER: HER,
    SPACING: SPACING,
    LINE_Z: LINE_Z,
    herAt: herAt,
    lineupSlots: lineupSlots,
    mapHeadUVs: mapHeadUVs,
    cropFaceCanvas: cropFaceCanvas,
    faceTexture: faceTexture,
    buildFigure: buildFigure,
    duskGround: duskGround,
    primitivePeople: false
  };
});
