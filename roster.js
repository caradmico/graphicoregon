/* Graphic Oregon — fighter-select hand (browser + Node). Look stays with GO. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Roster = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const IDS = ["journalist", "scientist", "radio", "artist", "teacher", "musician"];
  const LABELS = {
    journalist: "Journalist",
    scientist: "Scientist",
    radio: "Radio",
    artist: "Artist",
    teacher: "Teacher",
    musician: "Musician"
  };
  const SUBCLASS = {
    scientist: ["watershed", "orbit"],
    radio: ["civilian", "fleet"],
    artist: ["studio", "print"]
  };
  const SUB_LABEL = {
    watershed: "Watershed",
    orbit: "Orbit",
    civilian: "Civilian",
    fleet: "Fleet",
    studio: "Studio",
    print: "Print"
  };
  const FLY_SEC = 1.8;
  const PIONEER_HREF = "https://www.tillamookcountypioneer.net/author/assistant-editor/";
  const RESEARCH_HREF = "https://graphicoregon.com/research/";
  const STARIS_HREF = "https://staris-b01f2.firebaseapp.com";
  const IAU_HREF = "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/";
  const ART_HREF = "https://graphicoregon.com/sample-page/";
  const COPPER_HREF = "https://sassmeharder.com/product/30931683?utm_source=pinterest&utm_medium=organic&utm_campaign=copper-horizon&utm_content=2026-08-21";

  const ROSTER_POSE = { x: 0, y: 1.7, z: 7.2, yaw: 0, pitch: -0.08 };

  // Marks GO can dress. Hand dollies to these; do not invent rooms.
  const MARKS = {
    journalist: { x: -15.25, z: -12.55, kind: "newsie" },
    scientist: { x: 32, z: 2, kind: "table" },
    radio: { x: -1.6, z: -5.2, kind: "lineup" },
    artist: { x: 0, y: -54.3, z: 0, kind: "museum" },
    teacher: { x: 0, z: 32, kind: "lectern" },
    musician: { x: 8, z: -5.2, kind: "lineup" }
  };

  const SHEETS = {
    journalist: {
      meta: "Journalist",
      title: "Journalist",
      body: "Pioneer, Hipfish, Gazette, and Signal. The paper in her hand is this class.",
      links: [{ href: PIONEER_HREF, label: "Tillamook County Pioneer" }],
      figure: null
    },
    scientist: {
      watershed: {
        meta: "Scientist · Watershed",
        title: "Scientist",
        body: "Watershed maps already in the field: Netarts, Nehalem, Nestucca, Siuslaw, Tillamook, Necanicum, and Lane.",
        links: [{ href: RESEARCH_HREF, label: "Open the research index" }],
        figure: { src: "assets/maps/01-context.jpg", alt: "North Coast context map" }
      },
      orbit: {
        meta: "Scientist · Orbit",
        title: "Scientist",
        body: "StarIS, the IAU astronomical mapping proposal, NASA Space Apps, SETI, and ILOA.",
        links: [
          { href: STARIS_HREF, label: "Open StarIS" },
          { href: IAU_HREF, label: "Open the IAU proposal" }
        ],
        figure: null
      }
    },
    radio: {
      civilian: {
        meta: "Radio · Civilian",
        title: "Radio",
        body: "Civilian ham and shortwave. A public radio life.",
        links: [],
        figure: null
      },
      fleet: {
        meta: "Radio · Fleet",
        title: "Radio",
        body: "A nod to Navy electronic warfare and satellites — work she wants. Public only.",
        links: [],
        figure: null
      }
    },
    artist: {
      studio: {
        meta: "Artist · Studio",
        title: "Artist",
        body: "Oil, charcoal, prints. Self-portraits and coast work hang in the hall behind this pick.",
        links: [{ href: ART_HREF, label: "Open the studio page" }],
        figure: { src: "assets/art/self-portrait-charcoal.jpg", alt: "Self-portrait charcoal" }
      },
      print: {
        meta: "Artist · Print",
        title: "Artist",
        body: "Copper Horizon — teal sky, copper rays. Live on Sass.",
        links: [{ href: COPPER_HREF, label: "Open Copper Horizon" }],
        figure: { src: "assets/shop/copper-horizon-overlay-1000x1500.jpg", alt: "Copper Horizon" }
      }
    },
    teacher: {
      meta: "Teacher",
      title: "Teacher",
      body: "She teaches by making the system readable — a lectern and one map you can see. This class is thinner than the others. There is no classroom.",
      links: [{ href: RESEARCH_HREF, label: "Open the research index" }],
      figure: { src: "assets/maps/01-context.jpg", alt: "One real map" }
    },
    musician: {
      meta: "Musician",
      title: "Musician",
      body: "The stage is empty. Tracks she names are not in this field yet.",
      links: [],
      figure: null
    }
  };

  function isId(id) {
    return IDS.indexOf(id) !== -1;
  }

  function defaultSubclass(id) {
    const list = SUBCLASS[id];
    return list ? list[0] : null;
  }

  function subclasses(id) {
    return SUBCLASS[id] ? SUBCLASS[id].slice() : [];
  }

  function actionFor(id) {
    if (id === "journalist") return "paper";
    if (id === "artist") return "museum";
    return "sheet";
  }

  function sheet(id, subclass) {
    if (!isId(id)) return null;
    const raw = SHEETS[id];
    const sub = subclass || defaultSubclass(id);
    const data = raw && raw[sub] ? raw[sub] : raw;
    return {
      id: id,
      title: data.title,
      body: data.body,
      meta: data.meta,
      links: (data.links || []).slice(),
      figure: data.figure,
      subclasses: subclasses(id),
      subclass: sub,
      action: actionFor(id)
    };
  }

  function mark(id) {
    return isId(id) ? Object.assign({}, MARKS[id]) : null;
  }

  function createHand() {
    let selected = null;
    const currentSub = {
      scientist: "watershed",
      radio: "civilian",
      artist: "studio"
    };

    function pick(id) {
      if (!isId(id)) return null;
      selected = id;
      return {
        id: id,
        label: LABELS[id],
        action: actionFor(id),
        mark: mark(id),
        sheet: sheet(id, currentSub[id] || null),
        roster: false,
        requiresWasd: false
      };
    }

    function setSubclass(id, name) {
      if (!isId(id)) return null;
      const list = SUBCLASS[id];
      if (!list || list.indexOf(name) === -1) return sheet(id, currentSub[id] || null);
      currentSub[id] = name;
      return sheet(id, name);
    }

    function goHome() {
      selected = null;
      return {
        id: null,
        action: "roster",
        pose: Object.assign({}, ROSTER_POSE),
        roster: true,
        requiresWasd: false
      };
    }

    return {
      pick: pick,
      setSubclass: setSubclass,
      goHome: goHome,
      selected: function () { return selected; },
      subclass: function (id) { return currentSub[id] || null; },
      sheet: function (id) { return sheet(id, currentSub[id] || null); },
      requiresWasd: false
    };
  }

  return {
    IDS: IDS,
    LABELS: LABELS,
    SUBCLASS: SUBCLASS,
    SUB_LABEL: SUB_LABEL,
    FLY_SEC: FLY_SEC,
    ROSTER_POSE: ROSTER_POSE,
    MARKS: MARKS,
    isId: isId,
    defaultSubclass: defaultSubclass,
    subclasses: subclasses,
    actionFor: actionFor,
    sheet: sheet,
    mark: mark,
    createHand: createHand
  };
});
