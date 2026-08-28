/* Graphic Oregon — two rooms, one hand. Museum catalog + portal math. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MuseumData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const ART_HREF = "https://graphicoregon.com/sample-page/";

  // Every file in assets/art/*. Titles follow the studio page / prior hang list.
  const ART = [
    ["0517232026.jpg", "0517232026"],
    ["0716231323.jpg", "0716231323"],
    ["0730230642.jpg", "0730230642"],
    ["20180506_122928-2.jpg", "20180506_122928-2"],
    ["20181111_133449.jpg", "20181111_133449"],
    ["20181121_150820-2.jpg", "20181121_150820-2"],
    ["20181202_131855-2.jpg", "20181202_131855-2"],
    ["20190629_203228-1.jpg", "20190629_203228-1"],
    ["2020-08-21-1.jpg", "2020-08-21-1"],
    ["20200504_131719-1.jpg", "20200504_131719-1"],
    ["20200701_195408.jpg", "20200701_195408"],
    ["20200724_204038-2.jpg", "20200724_204038-2"],
    ["20201024_233425.jpg", "20201024_233425"],
    ["20201024_233433.jpg", "20201024_233433"],
    ["20201024_233453.jpg", "20201024_233453"],
    ["20201024_233510.jpg", "20201024_233510"],
    ["20201024_233520.jpg", "20201024_233520"],
    ["20201025_145436.jpg", "20201025_145436"],
    ["20201206_134723.jpg", "20201206_134723"],
    ["20201206_134739.jpg", "20201206_134739"],
    ["IMG_20151029_091758.jpg", "IMG_20151029_091758"],
    ["IMG_20200214_214207-2.jpg", "IMG_20200214_214207-2"],
    ["IMG_3195.jpg", "IMG_3195"],
    ["IMG_3197.jpg", "IMG_3197"],
    ["IMG_3198.jpg", "IMG_3198"],
    ["IMG_3201.jpg", "IMG_3201"],
    ["IMG_3207.jpg", "IMG_3207"],
    ["IMG_3208.jpg", "IMG_3208"],
    ["IMG_3210.jpg", "IMG_3210"],
    ["NA7y1.jpg", "NA7y1"],
    ["bird.jpg", "Bird"],
    ["broken.jpg", "Broken"],
    ["cat.jpg", "Cat"],
    ["cloth-study.jpg", "Cloth study, charcoal"],
    ["composition-study.jpg", "Composition study"],
    ["dog.jpg", "Dog"],
    ["female-figure-charcoal.jpg", "Female figure, charcoal"],
    ["female-figure-oil.jpg", "Female figure, oil on paper"],
    ["female-nude-charcoal.jpg", "Figure study, charcoal"],
    ["female-portrait-acrylic.jpg", "Portrait, acrylic"],
    ["female-portrait-oil-3.jpg", "Portrait, oil"],
    ["female-portrait-oil-4.jpg", "Portrait, oil"],
    ["female-portrait-oil.jpg", "Portrait, oil"],
    ["ghost.jpg", "Ghost"],
    ["large-jelly.jpg", "Large Jelly"],
    ["leg-in-water.jpg", "Leg in water, oil on paper"],
    ["linoleum-print.jpg", "Linoleum print"],
    ["male-portrait.jpg", "Portrait, oil pastel and charcoal"],
    ["mixed-media-gouache.jpg", "Mixed media, gouache on Canson"],
    ["mono-print.jpg", "Mono print"],
    ["monochromatic-self-portrait.jpg", "Monochromatic self-portrait, oil"],
    ["neahkahnie.jpg", "Neahkahnie"],
    ["nehalem.jpg", "Nehalem"],
    ["ocean.jpg", "Ocean"],
    ["self-portrait-acrylic.jpg", "Self-portrait, acrylic"],
    ["self-portrait-charcoal.jpg", "Self-portrait, charcoal"],
    ["self-portrait-graphite.jpg", "Self-portrait, graphite"],
    ["still-life-1.jpg", "Still life"],
    ["still-life-2-2.jpg", "Still life"],
    ["still-life-acrylic.jpg", "Still life, acrylic"],
    ["still-life-charcoal-3.jpg", "Still life, charcoal"],
    ["still-life-charcoal-4.jpg", "Still life, charcoal"],
    ["still-life-charcoal.jpg", "Still life, charcoal"],
    ["still-life-graphite.jpg", "Still life, graphite"],
    ["still-life-pencil.jpg", "Still life, pencil"],
    ["street-scene.jpg", "Street scene, charcoal, conté, marker"],
    ["unfinished.jpg", "Unfinished"],
    ["violet-flame.jpg", "Violet Flame"]
  ];

  const PAPER_LEAD = {
    kicker: "Tillamook County Pioneer",
    title: "Space Just Got a Little Closer",
    byline: "By Cara Mico, assistant editor",
    dek: "A Pioneer science piece on nearer space — Hubble, the coast, and how far the night still is.",
    href: "https://www.tillamookcountypioneer.net/space-just-got-a-little-closer/"
  };

  const PAPER_FEATURES = [
    {
      kicker: "Cannon Beach Gazette",
      title: "Program seeks to protect puffin population",
      dek: "March 16, 2019. Gazette page is 404; this is the sister reprint, bylined Cara Mico / For Cannon Beach Gazette.",
      href: "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/"
    },
    {
      kicker: "Tillamook County Pioneer",
      title: "The Return of Sea Otters to Haystack Rock",
      dek: "By Cara Mico. Otters coming back to the rock.",
      href: "https://www.tillamookcountypioneer.net/the-return-of-sea-otters-to-haystack-rock/"
    },
    {
      kicker: "Tillamook County Pioneer",
      title: "A New View: Space",
      dek: "By Cara Mico. Hubble, JWST, and whether colonization is realistic.",
      href: "https://www.tillamookcountypioneer.net/a-new-view-space/"
    }
  ];

  const PAPER_SIGNAL = [
    ["Hum and Swish", "https://seasidesignal.com/2019/09/21/hum-and-swish/"],
    ["Cleaning up on the diamond", "https://seasidesignal.com/2019/09/18/cleaning-up-on-the-diamond/"],
    ["Preparedness forum invites community involvement", "https://seasidesignal.com/2019/09/10/preparedness-forum-invites-community-involvement/"],
    ["Pickleball headed to Gearhart", "https://seasidesignal.com/2019/08/27/pickleball-headed-to-gearhart/"],
    ["Jeepers creepers, birding event at Circle Creek", "https://seasidesignal.com/2019/08/13/jeepers-creepers-birding-event-at-circle-creek/"],
    ["Social justice motivates artist May Wallace", "https://seasidesignal.com/2019/08/02/social-justice-motivates-artist-may-wallace/"],
    ["NCLC volunteers go deep into the weeds", "https://seasidesignal.com/2019/08/01/nclc-volunteers-go-deep-into-the-weeds/"],
    ["Fresh picked! Farmers Market in Seaside", "https://seasidesignal.com/2019/07/25/fresh-picked-farmers-market-in-seaside/"],
    ["Making ‘scents’ at Beach Books", "https://seasidesignal.com/2019/07/09/making-scents-at-beach-books/"],
    ["Hypertufa workshop promotes local species", "https://seasidesignal.com/2019/07/01/hypertufa-workshop-promotes-local-species/"],
    ["Ode to the Tides", "https://seasidesignal.com/2019/06/19/ode-to-the-tides/"],
    ["The food all around us", "https://seasidesignal.com/2019/05/29/the-food-all-around-us/"],
    ["‘Preserving pollinators’ on the North Coast", "https://seasidesignal.com/2019/05/29/preserving-pollinators-on-the-north-coast/"],
    ["Firehouse committee zeroes in on High Point site", "https://seasidesignal.com/2019/05/22/firehouse-committee-zeroes-in-on-high-point-site/"],
    ["Sparking change, one piece of plastic at a time", "https://seasidesignal.com/2019/05/21/sparking-change-one-piece-of-plastic-at-a-time/"]
  ];

  const PAPER_BRIEFS = [
    {
      kicker: "Pioneer",
      title: "Understanding AI Language Models",
      href: "https://www.tillamookcountypioneer.net/understanding-ai-language-models-an-introductory-guide/"
    },
    {
      kicker: "Pioneer",
      title: "Climate Change on the Oregon Coast",
      href: "https://www.tillamookcountypioneer.net/climate-change-on-the-oregon-coast-3-part-series/"
    },
    {
      kicker: "Portland Mercury",
      title: "And Your Ammo, Too!",
      href: "https://www.portlandmercury.com/news/2013/02/20/8531590/and-your-ammo-too"
    },
    {
      kicker: "Portland Mercury",
      title: "A Temporary Armistice",
      href: "https://www.portlandmercury.com/news/2012/12/05/7826150/a-temporary-armistice"
    }
  ];

  const PAPER_ARCHIVE = {
    title: "Pioneer author archive",
    dek: "Assistant editor since 2022. The author page mixes other writers — the pieces in this edition are Cara Mico bylines.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/"
  };

  const FOREST_PORTAL = {
    x: -12.2,
    z: -1.2,
    y: 0,
    inwardX: -1,
    inwardZ: 0,
    halfWidth: 0.72,
    maxDepth: 1.15
  };

  const NEWSIE = {
    x: -6.6,
    z: 2.35,
    handRadius: 2.7
  };

  const MUSEUM = {
    doorX: 0,
    doorZ: 400,
    inwardX: -1,
    inwardZ: 0,
    halfWidth: 0.9,
    maxDepth: 1.3,
    minX: -58,
    maxX: 2.2,
    minZ: 389.4,
    maxZ: 410.6,
    minY: 0.15,
    maxY: 8.4,
    spawnX: -3.4,
    spawnY: 1.7,
    spawnZ: 400,
    spawnYaw: -Math.PI / 2,
    exitX: -10.4,
    exitY: 1.7,
    exitZ: -1.2,
    exitYaw: Math.PI / 2
  };

  function artPath(file) {
    return "assets/art/" + file;
  }

  function artFiles() {
    return ART.map((row) => row[0]);
  }

  function planeAlong(x, z, doorX, doorZ, inwardX, inwardZ) {
    return (x - doorX) * inwardX + (z - doorZ) * inwardZ;
  }

  function planeAcross(x, z, doorX, doorZ, inwardX, inwardZ) {
    return (x - doorX) * (-inwardZ) + (z - doorZ) * inwardX;
  }

  function inPortalSlot(x, z, door) {
    const along = planeAlong(x, z, door.x, door.z, door.inwardX, door.inwardZ);
    const across = planeAcross(x, z, door.x, door.z, door.inwardX, door.inwardZ);
    return Math.abs(across) <= door.halfWidth && Math.abs(along) <= door.maxDepth;
  }

  function portalCross(prevX, prevZ, nextX, nextZ, door) {
    if (!inPortalSlot(nextX, nextZ, door) && !inPortalSlot(prevX, prevZ, door)) return 0;
    const a = planeAlong(prevX, prevZ, door.x, door.z, door.inwardX, door.inwardZ);
    const b = planeAlong(nextX, nextZ, door.x, door.z, door.inwardX, door.inwardZ);
    if (a <= 0 && b > 0) return 1;
    if (a >= 0 && b < 0) return -1;
    return 0;
  }

  function forestDoor() {
    return {
      x: FOREST_PORTAL.x,
      z: FOREST_PORTAL.z,
      inwardX: FOREST_PORTAL.inwardX,
      inwardZ: FOREST_PORTAL.inwardZ,
      halfWidth: FOREST_PORTAL.halfWidth,
      maxDepth: FOREST_PORTAL.maxDepth
    };
  }

  function museumDoor() {
    return {
      x: MUSEUM.doorX,
      z: MUSEUM.doorZ,
      inwardX: MUSEUM.inwardX,
      inwardZ: MUSEUM.inwardZ,
      halfWidth: MUSEUM.halfWidth,
      maxDepth: MUSEUM.maxDepth
    };
  }

  function clampRoom(room, pos, forest) {
    const out = { x: pos.x, y: pos.y, z: pos.z };
    if (room === "museum") {
      out.x = Math.max(MUSEUM.minX, Math.min(MUSEUM.maxX, out.x));
      out.y = Math.max(MUSEUM.minY, Math.min(MUSEUM.maxY, out.y));
      out.z = Math.max(MUSEUM.minZ, Math.min(MUSEUM.maxZ, out.z));
      return out;
    }
    const b = forest || { xz: 220, y: 121 };
    out.x = Math.max(-b.xz, Math.min(b.xz, out.x));
    out.y = Math.max(-b.y, Math.min(b.y, out.y));
    out.z = Math.max(-b.xz, Math.min(b.xz, out.z));
    return out;
  }

  function paperHrefs() {
    const hrefs = [PAPER_LEAD.href, PAPER_ARCHIVE.href];
    PAPER_FEATURES.forEach((p) => hrefs.push(p.href));
    PAPER_SIGNAL.forEach((p) => hrefs.push(p[1]));
    PAPER_BRIEFS.forEach((p) => hrefs.push(p.href));
    return hrefs;
  }

  return {
    ART: ART,
    ART_HREF: ART_HREF,
    ART_COUNT: ART.length,
    PAPER_LEAD: PAPER_LEAD,
    PAPER_FEATURES: PAPER_FEATURES,
    PAPER_SIGNAL: PAPER_SIGNAL,
    PAPER_BRIEFS: PAPER_BRIEFS,
    PAPER_ARCHIVE: PAPER_ARCHIVE,
    FOREST_PORTAL: FOREST_PORTAL,
    NEWSIE: NEWSIE,
    MUSEUM: MUSEUM,
    artPath: artPath,
    artFiles: artFiles,
    planeAlong: planeAlong,
    planeAcross: planeAcross,
    inPortalSlot: inPortalSlot,
    portalCross: portalCross,
    forestDoor: forestDoor,
    museumDoor: museumDoor,
    clampRoom: clampRoom,
    paperHrefs: paperHrefs
  };
});
