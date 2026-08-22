/* Graphic Oregon — wanderable 3D portfolio */

const ink = 0x0a1014;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;

const REGIONS = [
  {
    id: "arrival",
    name: "Arrival",
    kind: "intro",
    axis: "South of origin · looking north",
    pos: [0, 15, -72],
    look: [0, 8, 22],
    meta: "Graphic Oregon",
    title: "Technical design solutions",
    body: "Art west. Research east. Writing north. Credentials above. Websites south.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  },
  {
    id: "art",
    name: "Plaza",
    kind: "art",
    axis: "West · −X plaza",
    pos: [-128, 10, 0],
    look: [-168, 9, 0],
    meta: "Oil · acrylic · charcoal · prints",
    title: "Plaza",
    body: "The west studio. Portraits, still life, coast, prints, and the gift shop.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "lobby",
    name: "Lobby",
    kind: "art",
    axis: "West · −X inside",
    pos: [-176, 4.3, 0],
    look: [-206, 3.6, 0],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-176, 4.3, 0], look: [-206, 3.6, 0] }
    ],
    noBeacon: true,
    meta: "Lobby",
    title: "Lobby",
    body: "Dark ink halls, teal rim light, gold labels. Corridors run north to portraits, south to still life and the gift shop, and west toward coast, prints, and the studio.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "portraits",
    name: "Portraits & figures",
    kind: "art",
    axis: "West · −X, north wing",
    pos: [-176, 4.1, 30],
    look: [-176, 3.5, 56],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-176, 4.3, 6], look: [-176, 4.0, 20] },
      { pos: [-176, 4.1, 30], look: [-176, 3.5, 56] }
    ],
    noBeacon: true,
    meta: "Oil · acrylic · charcoal · graphite",
    title: "Portraits and figures",
    body: "Figures, nudes, and self-portraits hung on the walls. Titles follow the studio filenames and mediums.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "still-life",
    name: "Still life",
    kind: "art",
    axis: "West · −X, south wing",
    pos: [-208, 4.1, -30],
    look: [-208, 3.5, -52],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-176, 4.3, 0], look: [-200, 4.0, -18] },
      { pos: [-208, 4.1, -30], look: [-208, 3.5, -52] }
    ],
    noBeacon: true,
    meta: "Acrylic · charcoal · graphite · pencil",
    title: "Still life",
    body: "Still lifes and a cloth study, hung on the walls. Titles follow the studio filenames.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "coast",
    name: "Coast",
    kind: "art",
    axis: "West · −X, far wing",
    pos: [-230, 4.1, 0],
    look: [-250, 3.5, 0],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-200, 4.3, 0], look: [-230, 4.0, 0] },
      { pos: [-230, 4.1, 0], look: [-250, 3.5, 0] }
    ],
    noBeacon: true,
    meta: "Neahkahnie · Ocean · Nehalem",
    title: "Coast",
    body: "Neahkahnie, Ocean, Nehalem, and camera-roll landscapes that are clearly coast. Hung on the walls of this hall.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "prints",
    name: "Prints",
    kind: "art",
    axis: "West · −X, northwest wing",
    pos: [-234, 4.1, 26],
    look: [-234, 3.5, 40],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-220, 4.3, 0], look: [-234, 4.0, 18] },
      { pos: [-234, 4.1, 26], look: [-234, 3.5, 40] }
    ],
    noBeacon: true,
    meta: "Linoleum · mono · gouache",
    title: "Prints",
    body: "Linoleum print, mono print, and mixed-media gouache. Three works on the far wall.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "studio",
    name: "Studio",
    kind: "art",
    axis: "West · −X, southwest wing",
    pos: [-236, 4.1, -32],
    look: [-236, 3.5, -58],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-220, 4.3, 0], look: [-236, 4.0, -20] },
      { pos: [-236, 4.1, -32], look: [-236, 3.5, -58] }
    ],
    noBeacon: true,
    meta: "Animals · studio · dated photographs",
    title: "Studio",
    body: "Animals, jelly, violet flame, ghost, broken, unfinished, and leftover dated photographs. Titles follow the filenames.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "shop",
    name: "Gift shop",
    kind: "art",
    axis: "West · −X, off the lobby",
    pos: [-170, 4.2, -21.5],
    look: [-170, 3.5, -36],
    hops: [
      { pos: [-128, 10, 0], look: [-168, 9, 0] },
      { pos: [-156, 4.6, 0], look: [-176, 4.1, 0] },
      { pos: [-170, 4.3, -10], look: [-170, 4.0, -20] },
      { pos: [-170, 4.2, -21.5], look: [-170, 3.5, -36] }
    ],
    noBeacon: true,
    meta: "sassmeharder · Shirts with Sass",
    title: "Gift shop",
    body: "sassmeharder / Shirts with Sass. Click a stand to open the live product. Four graphic tees up front; skirts, hoodie, dress, and longsleeve along the wall.",
    href: "https://sassmeharder.com/",
    linkLabel: "Open sassmeharder.com"
  },
  {
    id: "iau",
    name: "Astronomical Mapping",
    kind: "exploded",
    axis: "East · +X",
    pos: [98, 24, -28],
    look: [98, 20, -50],
    meta: "Research · IAU proposal",
    title: "Astronomical Mapping — an IAU Proposal",
    body: "IAU 1930 boundaries (Delporte’s 88 constellations) often diverge from historical asterisms. The Aquarius–Pisces line from Beta to Iota Aquarii crosses into Capricornus. A dual system is proposed: keep cultural asterisms as an archive, and adopt a universe-centric reference from ICRS and Gaia.",
    href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/",
    linkLabel: "Open the IAU proposal"
  },
  {
    id: "iloa",
    name: "ILOA / Lunar Observatory",
    kind: "research",
    axis: "East · +X, high",
    pos: [72, 44, -118],
    look: [86, 42, -134],
    meta: "Research · Palo Alto, 2025–Present",
    title: "3D Modeling and Astrometric Research",
    body: "International Lunar Observatory Association, Palo Alto, 2025–Present. Working-group support for a revised constellation-boundary map; abstracts and posters for global conferences. Stanford on the Moon: planning a permanent endowment for a university observatory, with alumni engagement and a reunion conference.",
    href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/",
    linkLabel: "Related: IAU mapping proposal"
  },
  {
    id: "nano",
    name: "Nanoactuator Design",
    kind: "exploded",
    axis: "East · +X",
    pos: [138, 12, 42],
    look: [152, 10, 28],
    meta: "Research · 2024",
    title: "Open-Source Nanoactuator Design",
    body: "A cost-effective nanoactuator built from hard-disk-drive mechanics, measured with a Michelson interferometer. Apparatus photos and figures from the paper hang in this neighborhood.",
    href: "https://graphicoregon.com/open-source-nanoactuator-design-utilizing-hard-disk-drive-components-precision-displacement-measurement-with-a-michelson-interferometer/",
    linkLabel: "Open the nanoactuator paper"
  },
  {
    id: "eval",
    name: "Program Evaluation",
    kind: "exploded",
    axis: "East · +X",
    pos: [168, 9, 8],
    look: [184, 8, -6],
    meta: "Research · inclusive arts",
    title: "Program Evaluation Methods",
    body: "Evaluation methods for inclusive art programs. Figures from the guide — focus-group tools and the OSLP SWOC — hang in this neighborhood.",
    href: "https://graphicoregon.com/program-evaluation-methods/",
    linkLabel: "Open the evaluation guide"
  },
  {
    id: "lane",
    name: "Lane Arts Asset Map",
    kind: "exploded",
    axis: "East · +X",
    pos: [128, 14, -62],
    look: [142, 12, -78],
    meta: "Research · Lane Arts Council",
    title: "Lane Arts Council Arts Asset Map User Guide",
    body: "A user guide to the Lane Arts Council arts asset map. Interface screenshots and map figures from the guide hang here.",
    href: "https://graphicoregon.com/lane-arts-council-arts-asset-map-user-guide/",
    linkLabel: "Open the asset map guide"
  },
  {
    id: "netarts",
    name: "Netarts Bay Watershed",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [108, -2, 48],
    look: [108, -4, 16],
    mark: [108, 10, 16],
    quietMark: true,
    meta: "Research · Demeter Design, 2008",
    title: "Netarts Bay Watershed Habitat Assessment",
    body: "Prepared for the Tillamook Estuaries Partnership. A ~17,000-acre North Coast watershed and ~2,000-acre saline estuary. Poorly sorted spawning gravels are the primary limiter for Chum; summer rearing is an equal limiter for Coho. Maps and findings hang in this region — not an embedded report.",
    href: "https://graphicoregon.com/netarts-bay-watershed-habitat-assessment/",
    linkLabel: "Open the Netarts assessment"
  },
  {
    id: "nehalem",
    name: "East Fork Nehalem",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [158, -14, -22],
    look: [172, -14, -36],
    meta: "Research · habitat assessment",
    title: "East Fork Nehalem Watershed Assessment",
    body: "Watershed assessment for the East Fork Nehalem. Maps and figures from the report hang in this neighborhood.",
    href: "https://graphicoregon.com/east-fork-nehalem-watershed-assessment/",
    linkLabel: "Open the Nehalem assessment"
  },
  {
    id: "tillamook-bay",
    name: "Tillamook Bay Restoration",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [186, -12, 32],
    look: [200, -12, 18],
    meta: "Research · restoration plan",
    title: "Tillamook Bay Watershed Habitat Restoration Plan",
    body: "Habitat restoration planning for the Tillamook Bay watershed. CERP priority maps from the report hang in this neighborhood.",
    href: "https://graphicoregon.com/tillamook-bay-watershed-habitat-restoration-plan/",
    linkLabel: "Open the restoration plan"
  },
  {
    id: "nestucca",
    name: "Upper Nestucca",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [148, -16, 68],
    look: [162, -16, 54],
    meta: "Research · sediment and habitat",
    title: "Upper Nestucca Sediment and Habitat Study",
    body: "Sediment and habitat study for the Upper Nestucca. Maps and field figures from the report hang in this neighborhood.",
    href: "https://graphicoregon.com/upper-nestucca-sediment-and-habitat-study/",
    linkLabel: "Open the Nestucca study"
  },
  {
    id: "siuslaw",
    name: "North Fork Siuslaw",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [202, -14, -6],
    look: [216, -14, -20],
    meta: "Research · sediment and habitat",
    title: "North Fork Siuslaw Sediment and Habitat Assessment",
    body: "Sediment and habitat assessment for the North Fork Siuslaw watershed. MidCoast Watershed Council, 2009. Maps from the report hang here. Distinct from the 2009 headwater and road-condition assessment further out.",
    href: "https://graphicoregon.com/north-fork-siuslaw-sediment-and-habitat-assessment/",
    linkLabel: "Open the Siuslaw assessment"
  },
  {
    id: "tillamook-river",
    name: "Tillamook River",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [172, -18, -52],
    look: [186, -18, -66],
    meta: "Research · limiting factors",
    title: "Tillamook River Limiting Factors Assessment",
    body: "Limiting-factors assessment for salmonid habitat in the Tillamook River basin. Creek maps from the report hang in this neighborhood.",
    href: "https://graphicoregon.com/tillamook-river-limiting-factors-assessment/",
    linkLabel: "Open the Tillamook River assessment"
  },
  {
    id: "necanicum",
    name: "Necanicum Habitat Mapping",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [196, -10, 72],
    look: [210, -10, 58],
    meta: "Research · habitat mapping",
    title: "Necanicum Habitat Mapping",
    body: "Habitat mapping for the Necanicum watershed. Maps from the published map package hang as objects in this neighborhood.",
    href: "https://graphicoregon.com/necanicum-habitat-mapping/",
    linkLabel: "Open the Necanicum maps"
  },
  {
    id: "nhmp",
    name: "Hazard Mitigation Plan",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [142, -6, -92],
    look: [156, -6, -106],
    meta: "Research · Tillamook County",
    title: "Tillamook County Natural Hazard Mitigation Plan",
    body: "Natural hazard mitigation planning for Tillamook County. Figures from the plan hang in this neighborhood.",
    href: "https://graphicoregon.com/tillamook-county-natural-hazard-mitigation-plan/",
    linkLabel: "Open the hazard mitigation plan"
  },
  {
    id: "willamette-culvert",
    name: "Willamette Culvert Inventory",
    kind: "research",
    axis: "East · +X, further",
    pos: [248, -8, 110],
    look: [264, -8, 94],
    meta: "Technical consulting · 2011",
    title: "Willamette River Culvert Inventory",
    body: "Middle Willamette Watershed Council, 2011. Title and client from the published CV technical consulting reports. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "willamette-plan",
    name: "Willamette Restoration Plan",
    kind: "research",
    axis: "East · +X, further",
    pos: [268, -10, 70],
    look: [284, -10, 54],
    meta: "Technical consulting · 2011",
    title: "Willamette River Restoration Plan",
    body: "Mid-Willamette Watershed Alliance, 2011. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "hells-canyon",
    name: "Snake River Hells Canyon",
    kind: "research",
    axis: "East · +X, further",
    pos: [288, -12, 20],
    look: [304, -12, 4],
    meta: "Technical consulting · 2010",
    title: "Snake River Hells Canyon Watershed Assessment",
    body: "Powder Basin Watershed Council, 2010. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "oweb",
    name: "OWEB Riparian Restoration",
    kind: "research",
    axis: "East · +X, further",
    pos: [258, -6, -40],
    look: [274, -6, -56],
    meta: "Technical consulting · 2010",
    title: "OWEB Riparian Restoration Effectiveness",
    body: "Oregon Watershed Enhancement Board, 2010. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "john-day",
    name: "North Fork John Day",
    kind: "research",
    axis: "East · +X, further",
    pos: [292, -14, -80],
    look: [308, -14, -96],
    meta: "Technical consulting · 2010",
    title: "North Fork John Day Watershed Sediment and Physical Habitat Assessment",
    body: "Bureau of Land Management, 2010. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "santiam",
    name: "Santiam Calapooia",
    kind: "research",
    axis: "East · +X, further",
    pos: [318, -10, -20],
    look: [334, -10, -36],
    meta: "Technical consulting · 2010",
    title: "Santiam Calapooia Model Watershed Restoration Plan",
    body: "Santiam and Calapooia Watershed Councils, 2010. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "siuslaw-headwater",
    name: "Siuslaw Headwater & Roads",
    kind: "research",
    axis: "East · +X, further",
    pos: [240, -18, -128],
    look: [256, -18, -144],
    meta: "Technical consulting · 2009",
    title: "North Fork Siuslaw River Headwater and Road Condition Assessment",
    body: "MidCoast Watershed Council, 2009. A separate report from the North Fork Siuslaw Sediment and Habitat Assessment. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "big-elk",
    name: "Big Elk & Indian Creek",
    kind: "research",
    axis: "East · +X, further",
    pos: [275, -16, 150],
    look: [291, -16, 134],
    meta: "Technical consulting · 2009",
    title: "Big Elk and Indian Creek Watersheds Physical Habitat Assessment",
    body: "MidCoast Watershed Council, 2009. Title and client from the published CV. No separate PDF page on graphicoregon.com.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "journalism",
    name: "Journalism & Writing",
    kind: "write",
    axis: "North · +Z",
    pos: [6, 14, 148],
    look: [6, 12, 196],
    meta: "Writing · 2012–present",
    title: "Journalism and editing",
    body: "Assistant editor at the Tillamook County Pioneer, with live Cara Mico bylines in this hall. Earlier work: Seaside Signal (fifteen 2019 stories), Cannon Beach Gazette titles from the CV, HipFish Monthly issue PDFs, and two Portland Mercury pieces. Freelance newspaper work since November 2012.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/",
    linkLabel: "Pioneer author archive"
  },
  {
    id: "gazette",
    name: "Cannon Beach Gazette",
    kind: "write",
    axis: "North · +Z, further",
    pos: [10, 12, 288],
    look: [10, 11, 322],
    meta: "Writing · Gazette 2019",
    title: "Cannon Beach Gazette, 2019",
    body: "Titles from the published CV. The Gazette pages are not recovered live except the puffin reprint on the Seaside Signal, bylined Cara Mico / For Cannon Beach Gazette.",
    href: "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/",
    linkLabel: "Open the Gazette puffin reprint"
  },
  {
    id: "credentials",
    name: "Qualifications",
    kind: "creds",
    axis: "Above · +Y",
    pos: [0, 58, -8],
    look: [0, 54, -28],
    meta: "Experience · education · training",
    title: "Qualifications and credentials",
    body: "Roles from Graphic Oregon’s Experience page and the published CV. Certifications named here are the ones on that record — not a LinkedIn Learning inventory. Awards hang as medals above this ring.",
    href: "https://graphicoregon.com/experience/",
    linkLabel: "Open the Experience page"
  },
  {
    id: "aitutor",
    name: "AI Tutor",
    kind: "creds",
    axis: "Above · +Y, east",
    pos: [36, 78, 28],
    look: [36, 76, 8],
    meta: "Global Logic · 2024–2025",
    title: "AI Tutor, Global Logic",
    body: "San Francisco, 2024–2025. Developed and edited content for Google’s ML models, focusing on data quality. Refined machine responses to meet Google’s standards. Used Looker to monitor and optimize content production metrics.",
    href: "https://graphicoregon.com/experience/",
    linkLabel: "Open the Experience page"
  },
  {
    id: "service",
    name: "Service & Civic Work",
    kind: "creds",
    axis: "Above · +Y, west",
    pos: [-38, 74, -48],
    look: [-38, 72, -68],
    meta: "Service · elected office",
    title: "Service and civic work",
    body: "Named service from the published CV: North Coast Communities for Watershed Protection drinking-water work (2024), Kings Mountain Archery Range, SETI development consulting, Women in Science Portland, CART Manzanita, and elected boards at Tillamook County Transportation District (2014–2017) and Garibaldi Rural Fire Protection District (2014–2016).",
    href: "https://graphicoregon.com/experience/",
    linkLabel: "Open the Experience page"
  },
  {
    id: "talks",
    name: "Presentations",
    kind: "creds",
    axis: "Above · +Y, further",
    pos: [42, 88, -58],
    look: [42, 86, -78],
    meta: "Presentations and conferences",
    title: "Presentations and conferences",
    body: "From the published CV: University of Oregon 2017 graduate research on evaluation methods and the Lane Arts asset map; American Planners Association 2015 charette on climate and salmon habitat; Network of Oregon Watershed Councils 2010 co-presentation on restoration planning prioritization methods.",
    href: "https://graphicoregon.com/research/",
    linkLabel: "Open the research index"
  },
  {
    id: "awards",
    name: "Awards",
    kind: "creds",
    axis: "Above · +Y",
    pos: [0, 96, 18],
    look: [0, 94, -2],
    meta: "Fellowships and awards",
    title: "Fellowships and awards",
    body: "Recology Artist Residency, Astoria Visual Arts Alliance, 2018. Arts Research Travel Grant, University of Oregon, 2017. Studio Art Scholarship, Otis College of Art and Design, 2002.",
    href: "https://graphicoregon.com/experience/",
    linkLabel: "Open the Experience page"
  },
  {
    id: "websites",
    name: "Website Design",
    kind: "web",
    axis: "South · −Z, lower",
    pos: [14, -10, -148],
    look: [14, -10, -168],
    meta: "Website design and management",
    title: "Website work",
    body: "HTML/CSS, responsive applications, and long-term site management. Named work from the Graphic Oregon studio list. Screenshots from the studio gallery hang here, with a moon-phase widget as a client website object — not studio art. Named contract domains sit further south.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  },
  {
    id: "contracts",
    name: "Named Web Contracts",
    kind: "web",
    axis: "South · −Z, further",
    pos: [36, -16, -208],
    look: [36, -16, -228],
    meta: "CV contract domains",
    title: "Named website contracts",
    body: "From the published CV: goldsilvermarketupdate.com, coloroutsidelines.com, offshoregrill.com, bigwavecafe.com, and marketing strategy for oil painter PK Jones. Color Outside the Lines also appears on the studio home list; the defended live URL is coloroutsidethelines.org.",
    href: "https://coloroutsidethelines.org/",
    linkLabel: "Open Color Outside the Lines"
  }
];

const NAV_GROUPS = [
  { label: "Arrival", ids: ["arrival"] },
  { label: "Art · west", ids: ["art", "lobby", "portraits", "still-life", "coast", "prints", "studio", "shop"] },
  { label: "Research · east +X", ids: ["iau", "iloa", "nano", "eval", "lane", "netarts", "nehalem", "tillamook-bay", "nestucca", "siuslaw", "tillamook-river", "necanicum", "nhmp", "willamette-culvert", "willamette-plan", "hells-canyon", "oweb", "john-day", "santiam", "siuslaw-headwater", "big-elk"] },
  { label: "Writing · north +Z", ids: ["journalism", "gazette"] },
  { label: "Credentials · above +Y", ids: ["credentials", "aitutor", "service", "talks", "awards"] },
  { label: "Websites · south −Z", ids: ["websites", "contracts"] }
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

const ILOA_CARDS = [
  ["3D modeling and astrometry", "International Lunar Observatory Association, Palo Alto, 2025–Present. Working-group support for a revised constellation-boundary mapping system."],
  ["Stanford on the Moon", "Planning a permanent endowment for a university observatory, coordinating meetings with university leaders and stakeholders under the Stanford on the Moon initiative."],
  ["Conference and alumni", "A multi-part initiative for lunar research and alumni engagement — invitations, venue, student groups, and an endowment meeting."],
  ["Weekly calendar", "Managing the accuracy of a weekly calendar: updates, proofreading, and editing so the organizational tool stays reliable."]
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

const WEB_CONTRACTS = [
  ["goldsilvermarketupdate.com", "CV contract. Gold and Silver Market Update — web designer.", "https://goldsilvermarketupdate.com"],
  ["coloroutsidelines.com", "CV contract domain. Studio home list names Color Outside the Lines; the defended live URL is coloroutsidethelines.org.", "https://coloroutsidethelines.org/"],
  ["offshoregrill.com", "CV contract. Offshore Grill — website design and web admin.", "https://offshoregrill.com"],
  ["bigwavecafe.com", "CV contract. Big Wave Cafe — web admin.", "https://bigwavecafe.com"],
  ["PK Jones", "Currently developing marketing strategy for oil painter PK Jones. Named on the published CV. No public contract URL listed.", ""]
];

const PORTRAITS = [
  ["assets/art/female-figure-oil.jpg", "Female figure, oil on paper"],
  ["assets/art/female-figure-charcoal.jpg", "Female figure, charcoal"],
  ["assets/art/female-nude-charcoal.jpg", "Figure study, charcoal"],
  ["assets/art/female-portrait-acrylic.jpg", "Portrait, acrylic"],
  ["assets/art/female-portrait-oil.jpg", "Portrait, oil"],
  ["assets/art/female-portrait-oil-3.jpg", "Portrait, oil"],
  ["assets/art/female-portrait-oil-4.jpg", "Portrait, oil"],
  ["assets/art/leg-in-water.jpg", "Leg in water, oil on paper"],
  ["assets/art/self-portrait-acrylic.jpg", "Self-portrait, acrylic"],
  ["assets/art/self-portrait-charcoal.jpg", "Self-portrait, charcoal"],
  ["assets/art/self-portrait-graphite.jpg", "Self-portrait, graphite"],
  ["assets/art/monochromatic-self-portrait.jpg", "Monochromatic self-portrait, oil"],
  ["assets/art/male-portrait.jpg", "Portrait, oil pastel and charcoal"],
  ["assets/art/IMG_20200214_214207-2.jpg", "IMG_20200214_214207-2", -90],
  ["assets/art/20201206_134723.jpg", "20201206_134723", -90],
  ["assets/art/20201206_134739.jpg", "20201206_134739", -90],
  ["assets/art/IMG_3195.jpg", "IMG_3195"],
  ["assets/art/IMG_3197.jpg", "IMG_3197"],
  ["assets/art/IMG_3198.jpg", "IMG_3198"],
  ["assets/art/IMG_3201.jpg", "IMG_3201"],
  ["assets/art/0517232026.jpg", "0517232026"],
  ["assets/art/0716231323.jpg", "0716231323", -90]
];

const STILL_LIFE = [
  ["assets/art/still-life-acrylic.jpg", "Still life, acrylic"],
  ["assets/art/still-life-charcoal.jpg", "Still life, charcoal"],
  ["assets/art/still-life-charcoal-3.jpg", "Still life, charcoal"],
  ["assets/art/still-life-charcoal-4.jpg", "Still life, charcoal"],
  ["assets/art/still-life-graphite.jpg", "Still life, graphite"],
  ["assets/art/still-life-pencil.jpg", "Still life, pencil"],
  ["assets/art/still-life-1.jpg", "Still life"],
  ["assets/art/still-life-2-2.jpg", "still-life-2"],
  ["assets/art/cloth-study.jpg", "Cloth study, charcoal"],
  ["assets/art/IMG_3210.jpg", "IMG_3210"]
];

const COAST = [
  ["assets/art/neahkahnie.jpg", "Neahkahnie"],
  ["assets/art/ocean.jpg", "Ocean"],
  ["assets/art/nehalem.jpg", "Nehalem"],
  ["assets/art/20180506_122928-2.jpg", "20180506_122928-2"],
  ["assets/art/20181121_150820-2.jpg", "20181121_150820-2"],
  ["assets/art/20201024_233510.jpg", "20201024_233510"],
  ["assets/art/IMG_3208.jpg", "IMG_3208"],
  ["assets/art/20201025_145436.jpg", "20201025_145436"]
];

const PRINTS = [
  ["assets/art/linoleum-print.jpg", "Linoleum print"],
  ["assets/art/mono-print.jpg", "Mono print"],
  ["assets/art/mixed-media-gouache.jpg", "Mixed media, gouache on Canson"]
];

const STUDIO = [
  ["assets/art/bird.jpg", "Bird"],
  ["assets/art/cat.jpg", "Cat"],
  ["assets/art/dog.jpg", "Dog"],
  ["assets/art/large-jelly.jpg", "Large Jelly"],
  ["assets/art/violet-flame.jpg", "Violet Flame"],
  ["assets/art/ghost.jpg", "Ghost"],
  ["assets/art/broken.jpg", "Broken"],
  ["assets/art/unfinished.jpg", "Unfinished"],
  ["assets/art/street-scene.jpg", "Street scene, charcoal, conté, marker"],
  ["assets/art/composition-study.jpg", "Composition study"],
  ["assets/art/20181111_133449.jpg", "20181111_133449"],
  ["assets/art/20181202_131855-2.jpg", "20181202_131855-2"],
  ["assets/art/20190629_203228-1.jpg", "20190629_203228-1"],
  ["assets/art/2020-08-21-1.jpg", "2020-08-21-1"],
  ["assets/art/20200504_131719-1.jpg", "20200504_131719-1"],
  ["assets/art/20200701_195408.jpg", "20200701_195408"],
  ["assets/art/20200724_204038-2.jpg", "20200724_204038-2"],
  ["assets/art/IMG_20151029_091758.jpg", "IMG_20151029_091758"],
  ["assets/art/0730230642.jpg", "0730230642"],
  ["assets/art/NA7y1.jpg", "NA7y1"],
  ["assets/art/20201024_233425.jpg", "20201024_233425"],
  ["assets/art/20201024_233433.jpg", "20201024_233433"],
  ["assets/art/20201024_233453.jpg", "20201024_233453"],
  ["assets/art/20201024_233520.jpg", "20201024_233520"],
  ["assets/art/IMG_3207.jpg", "IMG_3207"]
];

const SHOP_PRODUCTS = [
  { file: "assets/shop/copper-horizon.jpg", title: "Copper Horizon Softstyle Tee", href: "https://sassmeharder.com/product/30931683", kind: "tee", price: "$22.99" },
  { file: "assets/shop/glow-bell.jpg", title: "Glow Bell Softstyle Tee", href: "https://sassmeharder.com/product/30931686", kind: "tee", price: "$22.99" },
  { file: "assets/shop/cliff-sun.jpg", title: "Cliff Sun Softstyle Tee — Gold Rings, Red Rock, Cold Water", href: "https://sassmeharder.com/product/30932080", kind: "tee", price: "$22.99" },
  { file: "assets/shop/prism-wash.jpg", title: "Prism Wash Softstyle Tee — Violet, Ember, Teal", href: "https://sassmeharder.com/product/30932082", kind: "tee", price: "$22.99" },
  { file: "assets/shop/rainbow-skirt.jpg", title: "Rainbow 'Rainbows are beautiful' Women's Skater Skirt", href: "https://sassmeharder.com/product/29281220", kind: "skirt" },
  { file: "assets/shop/cloud-dream-skirt.jpg", title: "Cloud Dream Skater Skirt — \"Above It All\"", href: "https://sassmeharder.com/product/29281029", kind: "skirt" },
  { file: "assets/shop/la-nightlife-hoodie.jpg", title: "LA Night Life — Black & Gold Pullover Hoodie", href: "https://sassmeharder.com/product/29281146", kind: "hoodie" },
  { file: "assets/shop/longsleeve-vneck.jpg", title: "Women's Long Sleeve V-neck Shirt (AOP)", href: "https://sassmeharder.com/product/29280927", kind: "longsleeve" },
  { file: "assets/shop/tshirt-dress.jpg", title: "T-Shirt Dress (AOP)", href: "https://sassmeharder.com/product/29281285", kind: "dress" },
  { file: "assets/shop/unisex-softstyle.jpg", title: "Unisex Softstyle T-Shirt", href: "https://sassmeharder.com/product/29470923", kind: "tee" }
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


const RESEARCH_FIGS = {
  nano: [
    ["assets/research/nano/01.jpg", "Page 28"],
    ["assets/research/nano/02.jpg", "Page 29"],
    ["assets/research/nano/03.jpg", "Page 10"],
    ["assets/research/nano/04.jpg", "Page 10"],
    ["assets/research/nano/05.jpg", "Page 10"],
    ["assets/research/nano/06.jpg", "Michelson interferometer"]
  ],
  eval: [
    ["assets/research/eval/01.jpg", "Figure 2 — inclusion and exclusion"],
    ["assets/research/eval/02.jpg", "Figure 2 — Focus group voucher"],
    ["assets/research/eval/03.jpg", "Figure 3 — Focus group questions"],
    ["assets/research/eval/04.jpg", "Figure 5 — OSLP Arts & Culture SWOC Analysis"]
  ],
  lane: [
    ["assets/research/lane/01.jpg", "Arts Asset Map User Guide"],
    ["assets/research/lane/02.jpg", "Page 7"],
    ["assets/research/lane/03.jpg", "Login screen"],
    ["assets/research/lane/04.jpg", "Page 12"],
    ["assets/research/lane/05.jpg", "Page 13"],
    ["assets/research/lane/06.jpg", "Page 13"],
    ["assets/research/lane/07.jpg", "Page 14"],
    ["assets/research/lane/08.jpg", "Page 14"],
    ["assets/research/lane/09.jpg", "Page 14"],
    ["assets/research/lane/10.jpg", "Using the map"]
  ],
  nehalem: [
    ["assets/research/nehalem/01.jpg", "Select EMAP and AQI reference data"],
    ["assets/research/nehalem/02.jpg", "Map 4a — Points of Use / Diversion"],
    ["assets/research/nehalem/03.jpg", "Page 20"],
    ["assets/research/nehalem/04.jpg", "Watershed Assessment"],
    ["assets/research/nehalem/05.jpg", "Page 72"],
    ["assets/research/nehalem/06.jpg", "Map 1a — Overview"],
    ["assets/research/nehalem/07.jpg", "Map 9 — Fish verification and presence"],
    ["assets/research/nehalem/08.jpg", "Page 22"],
    ["assets/research/nehalem/09.jpg", "Watershed Assessment"],
    ["assets/research/nehalem/10.jpg", "Chapter 9 — Fish Habitat and Distribution"]
  ],
  "tillamook-bay": [
    ["assets/research/tillamook-bay/01.jpg", "Top outreach priorities"],
    ["assets/research/tillamook-bay/02.jpg", "Top 10 priorities"],
    ["assets/research/tillamook-bay/03.jpg", "Top 10 priorities"],
    ["assets/research/tillamook-bay/04.jpg", "Top 10 priorities"],
    ["assets/research/tillamook-bay/05.jpg", "Priorities 11–94"],
    ["assets/research/tillamook-bay/06.jpg", "Priorities 11–94"],
    ["assets/research/tillamook-bay/07.jpg", "Priorities 11–94 — Bewley"],
    ["assets/research/tillamook-bay/08.jpg", "Map — page 338"],
    ["assets/research/tillamook-bay/09.jpg", "Top 10 priorities"],
    ["assets/research/tillamook-bay/10.jpg", "Map — page 346"]
  ],
  nestucca: [
    ["assets/research/nestucca/01.jpg", "Water quality impairment by fine sediment"],
    ["assets/research/nestucca/02.jpg", "Sediment, shade, and complexity"],
    ["assets/research/nestucca/03.jpg", "Physical habitat study"],
    ["assets/research/nestucca/04.jpg", "Page 18"],
    ["assets/research/nestucca/05.jpg", "Page 90"],
    ["assets/research/nestucca/06.jpg", "Map 1 — Nestucca River Watershed"],
    ["assets/research/nestucca/07.jpg", "Shade assessment"],
    ["assets/research/nestucca/08.jpg", "Summary of watershed metrics"],
    ["assets/research/nestucca/09.jpg", "Page 21"],
    ["assets/research/nestucca/10.jpg", "Sediment benchmarks"]
  ],
  siuslaw: [
    ["assets/research/siuslaw/01.jpg", "Map 5 — Reference locations"],
    ["assets/research/siuslaw/02.jpg", "Map 1 — Landuse and ownership"],
    ["assets/research/siuslaw/03.jpg", "North Fork Siuslaw Sediment"],
    ["assets/research/siuslaw/04.jpg", "North Fork Siuslaw Sediment and Habitat Assessment"],
    ["assets/research/siuslaw/05.jpg", "Page 62"],
    ["assets/research/siuslaw/06.jpg", "Page 71"],
    ["assets/research/siuslaw/07.jpg", "Map 6 — Bank condition listing"],
    ["assets/research/siuslaw/08.jpg", "Page 12"],
    ["assets/research/siuslaw/09.jpg", "Page 65"],
    ["assets/research/siuslaw/10.jpg", "Page 76"]
  ],
  "tillamook-river": [
    ["assets/research/tillamook-river/01.jpg", "Map 3i — Munson Creek"],
    ["assets/research/tillamook-river/02.jpg", "Habitat Assessment and Limiting Factors Analysis"],
    ["assets/research/tillamook-river/03.jpg", "Page 105"],
    ["assets/research/tillamook-river/04.jpg", "Map 3f — Killam Creek"],
    ["assets/research/tillamook-river/05.jpg", "Map 3m — Bewley Creek"],
    ["assets/research/tillamook-river/06.jpg", "Habitat Assessment and Limiting Factors Analysis"],
    ["assets/research/tillamook-river/07.jpg", "Habitat Assessment and Limiting Factors Analysis"],
    ["assets/research/tillamook-river/08.jpg", "Page 102"],
    ["assets/research/tillamook-river/09.jpg", "Map 3h — Simmons Creek"],
    ["assets/research/tillamook-river/10.jpg", "Map 3b — Mainstem Tillamook"]
  ],
  necanicum: [
    ["assets/research/necanicum/01.jpg", "Neacoxie public ownership"],
    ["assets/research/necanicum/02.jpg", "Neacoxie wetlands"],
    ["assets/research/necanicum/03.jpg", "Necanicum and Neacoxie properties"],
    ["assets/research/necanicum/04.jpg", "Necanicum vegetation"],
    ["assets/research/necanicum/05.jpg", "Necanicum geology"],
    ["assets/research/necanicum/06.jpg", "Necanicum mass movement"],
    ["assets/research/necanicum/07.jpg", "Necanicum potential contamination"],
    ["assets/research/necanicum/08.jpg", "Necanicum public ownership"],
    ["assets/research/necanicum/09.jpg", "Necanicum roads"],
    ["assets/research/necanicum/10.jpg", "Necanicum wetlands"]
  ],
  nhmp: [
    ["assets/research/nhmp/01.jpg", "Tillamook County Natural Hazard Mitigation Plan"],
    ["assets/research/nhmp/02.jpg", "Tillamook County Natural Hazard Mitigation Plan, 2017"],
    ["assets/research/nhmp/03.jpg", "Page 25"],
    ["assets/research/nhmp/04.jpg", "Page 30"],
    ["assets/research/nhmp/05.jpg", "Tillamook County Natural Hazard Mitigation Plan"]
  ]
};

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

const JOBS = [
  ["Technical Writer & Data Analyst", "Mass Melt LLC", "Nov 2023–Present", "Technical communication and statistical analysis for a hardware startup. Transforming complex data into technical narratives."],
  ["Program Coordinator", "Success Centers", "Sep 2023–2024", "Fundraising and development for an education, employment, and arts nonprofit. Communications and outreach."],
  ["Assistant Editor & Web Maestro", "Tillamook County Pioneer", "Jun 2022–Present", "Journalist and editor; website development and graphic design. Adobe Premiere Pro. Stories for a diverse online audience."],
  ["Freelance Journalist", "Newspapers", "Nov 2012–Present", "Arts, environment, and emergency preparedness. Assistant editor at the Tillamook Pioneer, reporting along the north Oregon coast."],
  ["Strategic Business Consultant", "Graphic Oregon / Demeter Design / Land and Water Services", "Jan 2006–Present", "Website design, nonprofit fundraising, and environmental project data analysis."],
  ["Real Estate Marketing", "Pete Anderson Realty", "May 2022–Sep 2023", "Research and content for real estate marketing. SEO management and social media strategy."],
  ["Zoning Analyst & Market Research", "Housable", "Feb 2020–May 2022", "Zoning evaluation, corporate communications, content, market research, and software development support."],
  ["Marine Habitat Biologist & Educator", "City of Cannon Beach", "Feb 2019–Dec 2019", "Marine habitat education and research. Social media marketing and volunteer training."],
  ["Program Director", "Cannon Beach Arts Association", "Feb 2017–Nov 2019", "Arts programming, fundraising, and marketing strategy for the community arts organization."],
  ["Graduate Research Assistant", "Lane Arts Council", "Sep 2015–Dec 2017", "Coordinated an arts equity research program in Lane County."],
  ["Land Use Planning Specialist", "Tillamook County", "May 2014–Sep 2015", "Development permit processing, GIS analysis, and floodplain management."],
  ["Radio Broadcasting", "KTIL 95.5 FM Tillamook, KMUN", "2013–2014", "Radio broadcasting and marketing. Live broadcasts and audience engagement."],
  ["Watershed Council Coordinator", "North Clackamas Urban Watersheds Council", "Apr 2012–Apr 2013", "Restoration planning, GIS analysis, and educational outreach."],
  ["Presidential Fellow", "Organizing for America", "Sep 2012–Nov 2012", "Outreach campaign, data collection, and volunteer recruitment during the 2012 election."],
  ["Biological Research Consultant", "Demeter Design / Graphic Oregon", "Since 2006", "Data collection, analysis, and project management for environmental research."],
  ["Production Manager", "North Coast Music Festival", "2016–2019", "Festival programming for a local musical festival. Raised funds from local businesses to support artist travel and pay."],
  ["Grants and Sponsorship Coordinator", "Willamette Valley Music Festival", "2016–2017", "Grant writing and sponsorship program coordinator for the University of Oregon student music festival."],
  ["Communications Design Assistant", "University of Oregon School of Music & Dance", "2016–2017", "Communications design for the school of music and dance."],
  ["Minutes Recorder", "Lane Council of Governments", "2015–2016", "Public records keeper for Eugene-area government meetings."]
];

const EDUCATION = [
  ["MS, Arts Administration", "University of Oregon, 2018", "Specialization in public budget administration, nonprofit management, and arts administration. Research with the Oregon Supported Living Program and Lane Arts Council."],
  ["Graduate Certificate, Nonprofit Management", "University of Oregon, 2017", "Access and equity in community arts programs. Research evaluating access at the Portland Community Music Center."],
  ["BS, Watershed Restoration Science and Policy", "Oregon State University, 2007", "Watershed restoration science and policy."],
  ["Studio Art Foundation", "Otis College of Art and Design, 2002–2003", "Foundation studio training, Los Angeles."]
];

const CERTS = [
  ["Google Analytics Certificate", "2023"],
  ["Educational Training", "Lane Education School District, Eugene 2016"],
  ["GIS mapping", "Oregon Department of Revenue, Salem 2015"],
  ["Comprehensive planning for emergency services", "FEMA, Salem 2015"],
  ["Floodplain training and certified floodplain mapper", "FEMA, Eugene 2015"],
  ["Aquatics Inventory Protocol", "ODFW, Corvallis 2008"],
  ["Environmental Monitoring Assessment Program Protocol", "EPA, Tillamook 2006"],
  ["Wild Steelhead Spawning Monitoring", "ODFW, Tillamook 2005"]
];

const AWARDS = [
  ["Recology Artist Residency", "Astoria Visual Arts Alliance, 2018"],
  ["Arts Research Travel Grant", "University of Oregon, 2017"],
  ["Studio Art Scholarship", "Otis College of Art and Design, 2002"]
];

const SERVICE = [
  ["Drinking Water Source Project Manager", "North Coast Communities for Watershed Protection, 2024", "Drinking-water source project work for NCCWP, 2024."],
  ["Kings Mountain Archery Range", "Board member, publicist, nonprofit consultant, 2024", "Board, publicity, and nonprofit consulting for Kings Mountain Archery Range."],
  ["Development Consultant", "SETI, 2024", "Development consulting for SETI, 2024."],
  ["Communications Volunteer", "Women in Science Portland, 2020", "Communications volunteer with Women in Science Portland."],
  ["Board Member", "Conservation Action Resource Team, Manzanita, 2019–2020", "Board service with CART, Manzanita."],
  ["Elected Board Member", "Tillamook County Transportation District, 2014–2017", "Elected board member, Tillamook County Transportation District."],
  ["Elected Board Member", "Garibaldi Rural Fire Protection District, 2014–2016", "Elected board member, Garibaldi RFPD."]
];

const TALKS = [
  ["Evaluation Methods for Inclusive Art Programs at OSLP", "Arts and Administration Graduate Research Presentation, University of Oregon, 2017.", "https://graphicoregon.com/program-evaluation-methods/"],
  ["Lane Arts Council Arts Asset Mapping", "Arts and Administration Poster Session, University of Oregon, 2017.", "https://graphicoregon.com/lane-arts-council-arts-asset-map-user-guide/"],
  ["Planning for Climate Change, Considering Salmon Habitat", "American Planners Association Annual Conference, 2015. Charette presenter.", ""],
  ["Restoration Planning Prioritization Methods", "Network of Oregon Watershed Councils, 2010. Co-presenter.", ""]
];

const PIONEER_PIECES = [
  ["Author archive", "Cara Mico, assistant editor. The Pioneer author page mixes other writers — sample Cara bylines hang beside this card.", "https://www.tillamookcountypioneer.net/author/assistant-editor/", "assets/news/pioneer-archive.jpg"],
  ["A New View: Space", "By Cara Mico. Hubble, JWST, and whether colonization is realistic.", "https://www.tillamookcountypioneer.net/a-new-view-space/"],
  ["Space Just Got a Little Closer", "By Cara Mico, Assistant Editor. A Pioneer science piece on nearer space.", "https://www.tillamookcountypioneer.net/space-just-got-a-little-closer/", "assets/news/pioneer-space-just-got-a-little-closer.jpg"],
  ["The Return of Sea Otters to Haystack Rock", "By Cara Mico. Sea otters returning to Haystack Rock.", "https://www.tillamookcountypioneer.net/the-return-of-sea-otters-to-haystack-rock/"],
  ["Understanding AI Language Models", "By Cara Mico. An introductory guide to AI language models.", "https://www.tillamookcountypioneer.net/understanding-ai-language-models-an-introductory-guide/"],
  ["Climate Change on the Oregon Coast", "By Cara Mico. A three-part series on climate change on the Oregon coast.", "https://www.tillamookcountypioneer.net/climate-change-on-the-oregon-coast-3-part-series/"],
  ["Near Space Corporation in Tillamook", "By Cara Mico, Assistant Editor. Near Space Corporation test flights out of Tillamook.", "https://www.tillamookcountypioneer.net/near-space-corporation-in-tillamook-bringing-humans-closer-to-the-void/"],
  ["On the Future of Artificial Intelligence", "By Cara Mico, Assistant Editor. How AI can help humanity.", "https://www.tillamookcountypioneer.net/on-the-future-of-artificial-intelligence-and-how-it-can-help-humanity/"],
  ["Spy vs. Spy — Balloon War", "By Cara Mico, Assistant Editor. Balloon incidents and sky news.", "https://www.tillamookcountypioneer.net/spy-vs-spy-balloon-war/"],
  ["The Data of Immigration", "By Cara Mico, Assistant Editor. A data look at immigration.", "https://www.tillamookcountypioneer.net/the-data-of-immigration/", "assets/news/pioneer-data-of-immigration.jpg"],
  ["Homelessness in Tillamook County and on the West Coast", "By Cara Mico, Assistant Editor. How Tillamook County diverges from larger West Coast cities.", "https://www.tillamookcountypioneer.net/homelessness-in-tillamook-county-and-on-the-west-coast/"],
  ["A Hidden Gem: The Minor Peak of Saddle Mountain", "Posted by Cara Mico, Assistant Editor. The minor peak of Saddle Mountain in Oregon’s coastal range.", "https://www.tillamookcountypioneer.net/a-hidden-gem-the-minor-peak-of-saddle-mountain/"]
];

const SEASIDE_PIECES = [
  ["Hum and Swish", "Seaside Signal, September 21, 2019", "https://seasidesignal.com/2019/09/21/hum-and-swish/", "assets/news/signal-hum-and-swish.jpg"],
  ["Cleaning up on the diamond", "Seaside Signal, September 18, 2019", "https://seasidesignal.com/2019/09/18/cleaning-up-on-the-diamond/", "assets/news/signal-cleaning-up-diamond.jpg"],
  ["Preparedness forum invites community involvement", "Seaside Signal, September 10, 2019", "https://seasidesignal.com/2019/09/10/preparedness-forum-invites-community-involvement/", "assets/news/signal-preparedness-forum.jpg"],
  ["Pickleball headed to Gearhart", "Seaside Signal, August 27, 2019", "https://seasidesignal.com/2019/08/27/pickleball-headed-to-gearhart/", "assets/news/signal-pickleball.jpg"],
  ["Jeepers creepers, birding event at Circle Creek", "Seaside Signal, August 13, 2019", "https://seasidesignal.com/2019/08/13/jeepers-creepers-birding-event-at-circle-creek/", "assets/news/signal-jeepers-creepers.jpg"],
  ["Social justice motivates artist May Wallace", "Seaside Signal, August 2, 2019", "https://seasidesignal.com/2019/08/02/social-justice-motivates-artist-may-wallace/", "assets/news/signal-may-wallace.jpg"],
  ["NCLC volunteers go deep into the weeds", "Seaside Signal, August 1, 2019", "https://seasidesignal.com/2019/08/01/nclc-volunteers-go-deep-into-the-weeds/", "assets/news/signal-nclc-weeds.jpg"],
  ["Fresh picked! Farmers Market in Seaside", "Seaside Signal, July 25, 2019", "https://seasidesignal.com/2019/07/25/fresh-picked-farmers-market-in-seaside/", "assets/news/signal-farmers-market.jpg"],
  ["Making ‘scents’ at Beach Books", "Seaside Signal, July 9, 2019", "https://seasidesignal.com/2019/07/09/making-scents-at-beach-books/", "assets/news/signal-beach-books.jpg"],
  ["Hypertufa workshop promotes local species", "Seaside Signal, July 1, 2019", "https://seasidesignal.com/2019/07/01/hypertufa-workshop-promotes-local-species/", "assets/news/signal-hypertufa.jpg"],
  ["Ode to the Tides", "Seaside Signal, June 19, 2019", "https://seasidesignal.com/2019/06/19/ode-to-the-tides/", "assets/news/signal-ode-to-the-tides.jpg"],
  ["The food all around us", "Seaside Signal, May 29, 2019", "https://seasidesignal.com/2019/05/29/the-food-all-around-us/", "assets/news/signal-food-all-around.jpg"],
  ["‘Preserving pollinators’ on the North Coast", "Seaside Signal, May 29, 2019", "https://seasidesignal.com/2019/05/29/preserving-pollinators-on-the-north-coast/", "assets/news/signal-preserving-pollinators.jpg"],
  ["Firehouse committee zeroes in on High Point site", "Seaside Signal, May 22, 2019", "https://seasidesignal.com/2019/05/22/firehouse-committee-zeroes-in-on-high-point-site/", "assets/news/signal-firehouse.jpg"],
  ["Sparking change, one piece of plastic at a time", "Seaside Signal, May 21, 2019", "https://seasidesignal.com/2019/05/21/sparking-change-one-piece-of-plastic-at-a-time/", "assets/news/signal-sparking-change.jpg"]
];

const GAZETTE_PIECES = [
  ["Program seeks to protect puffin population", "Cannon Beach Gazette, March 16, 2019. Gazette URL is 404. Sister reprint on the Seaside Signal, bylined Cara Mico / For Cannon Beach Gazette.", "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/", "assets/news/gazette-puffin.jpg"],
  ["Preparation is the Watchword", "Cannon Beach Gazette, May 3, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Beauty and the Beast at Coaster Theater Spring Camp", "Cannon Beach Gazette, May 2, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Site Plan for Larger Tree Work Required", "Cannon Beach Gazette, April 17, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["City Council Appeal Sent Back to Planning Commission", "Cannon Beach Gazette, April 15, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Big Changes Ahead for Rental Permits", "Cannon Beach Gazette, April 2, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Food for the Soul", "Cannon Beach Gazette, April 2, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Bed and Breakfast or Short Term Rental?", "Cannon Beach Gazette, April 1, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Design Review Board approves two new marijuana shop plans", "Cannon Beach Gazette, March 26, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["No tents in the park", "Cannon Beach Gazette, March 21, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["City seeks clarity on tourism funds", "Cannon Beach Gazette, March 21, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Warren Way reconfiguration ahead", "Cannon Beach Gazette, March 19, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Operations levy rejected for new fire truck", "Cannon Beach Gazette, March 15, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["What’s in store for the new RV park?", "Cannon Beach Gazette, March 12, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Funding sought to analyze potential city hall sites", "Cannon Beach Gazette, March 11, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Love it like a local", "Cannon Beach Gazette, March 11, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Keeping a forest healthy", "Cannon Beach Gazette, March 4, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Savor Cannon Beach", "Cannon Beach Gazette, February 28, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Is comp plan revision ahead?", "Cannon Beach Gazette, February 26, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["City hall location only one of many concerns", "Cannon Beach Gazette, February 20, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["City hall location dizzying for council", "Cannon Beach Gazette, February 8, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Burglaries spike, but overall crime report is 'average'", "Cannon Beach Gazette, February 7, 2019. Title from the published CV. Live Gazette URL not recovered.", ""],
  ["Neal Maine's art of the migratory bird", "Cannon Beach Gazette, February 7, 2019. Title from the published CV. Live Gazette URL not recovered.", ""]
];

const HIPFISH = [
  ["When Albums Were Art", "HipFish Monthly, July 2016 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2016/07/716.pdf", "assets/news/hipfish-716.jpg"],
  ["Of Dust and the River: Tim Hurd", "HipFish Monthly, October 2016 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2016/10/1016.pdf", "assets/news/hipfish-1016.jpg"],
  ["The New NCRD Theater", "HipFish Monthly, January 2017 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2017/01/117.pdf", "assets/news/hipfish-117.jpg"],
  ["Riverbend Players / Cole Porter", "HipFish Monthly, May 2017 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2017/05/517.pdf", "assets/news/hipfish-517.jpg"]
];

const MERCURY = [
  ["And Your Ammo, Too!", "Portland Mercury, February 20, 2013.", "https://www.portlandmercury.com/news/2013/02/20/8531590/and-your-ammo-too"],
  ["A Temporary Armistice", "Portland Mercury, December 5, 2012. Mayor's plan to solve Northwest Portland parking wars.", "https://www.portlandmercury.com/news/2012/12/05/7826150/a-temporary-armistice"]
];

const clickables = [];
let scene, camera, renderer, ship;
let lookYaw = 0;
let lookPitch = -0.12;
let dragging = false;
let lastX = 0;
let lastY = 0;
let keys = {};
let scrollBoost = 0;
let flight = null;
let bubbleCool = 0;
const bubbles = [];
const clock = new THREE.Clock();
const _billboardAt = new THREE.Vector3();
const cam = {
  pos: new THREE.Vector3(0, 15, -72),
  vel: new THREE.Vector3()
};
const bounds = { x: [-320, 380], y: [-52, 120], z: [-280, 420] };

function smoothstep(k) {
  k = THREE.MathUtils.clamp(k, 0, 1);
  return k * k * (3 - 2 * k);
}

function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function lookDir() {
  const cp = Math.cos(lookPitch);
  return new THREE.Vector3(Math.sin(lookYaw) * cp, Math.sin(lookPitch), -Math.cos(lookYaw) * cp);
}

function yawPitchFromPoints(from, to) {
  const d = new THREE.Vector3().subVectors(to, from).normalize();
  return {
    yaw: Math.atan2(d.x, -d.z),
    pitch: Math.asin(THREE.MathUtils.clamp(d.y, -0.92, 0.92))
  };
}

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
  const mat = bothSides(new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  return new THREE.Mesh(new THREE.PlaneGeometry(opts.pw || 8, opts.ph || 2), mat);
}

function bothSides(mat) {
  mat.side = THREE.DoubleSide;
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader) => {
    if (prev) prev(shader);
    shader.fragmentShader = shader.fragmentShader.replace(
      "texture2D( map, vMapUv )",
      "texture2D( map, gl_FrontFacing ? vMapUv : vec2( 1.0 - vMapUv.x, vMapUv.y ) )"
    );
  };
  return mat;
}

function markBillboard(mesh) {
  mesh.userData.billboard = true;
  return mesh;
}

function wrapText(ctx, text, x, y, max, lh) {
  const words = String(text).split(" ");
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
  ctx.font = "600 44px Georgia, serif";
  ctx.textAlign = "left";
  wrapLeft(ctx, title, 48, 72, w - 96, 50, 2);
  ctx.fillStyle = "#e8efe8";
  ctx.font = "30px Georgia, serif";
  wrapLeft(ctx, body, 48, 180, w - 96, 42, 9);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 4.5),
    bothSides(new THREE.MeshBasicMaterial({ map: tex, transparent: true }))
  );
}

function makeClipCard(title, body, tex) {
  const w = 1024, h = 720;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(12,20,24,0.92)";
  ctx.fillRect(0, 0, w, h);
  if (tex && tex.image) {
    const img = tex.image;
    const boxW = w - 16, boxH = 430;
    const ia = img.width / img.height;
    const ba = boxW / boxH;
    let dw, dh;
    if (ia > ba) { dw = boxW; dh = boxW / ia; }
    else { dh = boxH; dw = boxH * ia; }
    const dx = 8 + (boxW - dw) / 2;
    const dy = 8 + (boxH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  ctx.strokeStyle = "rgba(42,168,160,0.75)";
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.fillStyle = "#d4b05a";
  ctx.font = "600 40px Georgia, serif";
  ctx.textAlign = "left";
  wrapLeft(ctx, title, 40, 478, w - 80, 46, 2);
  ctx.fillStyle = "#e8efe8";
  ctx.font = "28px Georgia, serif";
  wrapLeft(ctx, body, 40, 578, w - 80, 36, 3);
  const canvasTex = new THREE.CanvasTexture(c);
  canvasTex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 5.05),
    bothSides(new THREE.MeshBasicMaterial({ map: canvasTex, transparent: true }))
  );
}

function faceArrival(mesh) {
  mesh.rotation.y = Math.PI;
}

function wrapLeft(ctx, text, x, y, max, lh, maxLines) {
  const words = String(text).split(" ");
  let line = "", n = 0;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > max && line) {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lh;
      n += 1;
      if (maxLines && n >= maxLines) return;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
}

function makeJobCard(role, org, dates, body) {
  const w = 1100, h = 700;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(12,20,24,0.88)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(212,176,90,0.7)";
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.fillStyle = "#d4b05a";
  ctx.font = "600 40px Georgia, serif";
  ctx.textAlign = "left";
  wrapLeft(ctx, role, 44, 70, w - 88, 46, 2);
  ctx.fillStyle = "#2aa8a0";
  ctx.font = "28px Georgia, serif";
  wrapLeft(ctx, org, 44, 170, w - 88, 36, 2);
  ctx.fillStyle = "#9bb0b0";
  ctx.font = "26px Georgia, serif";
  ctx.fillText(dates, 44, 250);
  ctx.fillStyle = "#e8efe8";
  ctx.font = "28px Georgia, serif";
  wrapLeft(ctx, body, 44, 310, w - 88, 38, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(7.6, 4.85),
    bothSides(new THREE.MeshBasicMaterial({ map: tex, transparent: true }))
  );
}

function loadTexture(url) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (tex) => {
      if (done) return;
      done = true;
      resolve(tex);
    };
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      finish(tex);
    }, undefined, () => {
      console.warn("texture failed", url);
      finish(null);
    });
    setTimeout(() => {
      if (!done) {
        console.warn("texture timeout", url);
        finish(null);
      }
    }, 20000);
  });
}

function imagePlane(tex, maxW) {
  const img = tex.image;
  const aspect = img.width / img.height;
  const w = aspect >= 1 ? maxW : maxW * aspect;
  const h = aspect >= 1 ? maxW / aspect : maxW;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    bothSides(new THREE.MeshBasicMaterial({ map: tex }))
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
  const n = 4200;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 1600;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 1600;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xcfe8e4, size: 0.6, sizeAttenuation: true, transparent: true, opacity: 0.82
  })));
}

function addWorldGuides() {
  const grid = new THREE.GridHelper(560, 56, 0x1a6f6a, 0x143238);
  grid.position.y = -28;
  scene.add(grid);

  const marks = [
    ["SKY", 0, 108, 0, 22, 4],
    ["GROUND", 0, -36, 0, 18, 3.2],
    ["ART  ·  WEST  −X", -250, 22, 0, 28, 3.4],
    ["RESEARCH  ·  EAST  +X", 360, 16, 0, 32, 3.4],
    ["WRITING  ·  NORTH  +Z", 0, 22, 380, 28, 3.4],
    ["WEBSITES  ·  SOUTH  −Z", 0, -8, -260, 28, 3.4],
    ["CREDENTIALS  ·  ABOVE  +Y", 0, 108, -40, 26, 3.2]
  ];
  marks.forEach(([t, x, y, z, pw, ph]) => {
    const lab = makeLabel(t, {
      w: 1600, h: 280, pw, ph, font: "600 72px Georgia, serif",
      color: "#e8d29a", stroke: "rgba(42,168,160,0.55)", bg: "rgba(10,16,20,0.28)"
    });
    lab.position.set(x, y, z);
    lab.userData.billboard = true;
    scene.add(lab);
  });

  const hubs = [
    [0, 8, 0],
    [-128, 10, 0],
    [140, 4, 0],
    [6, 14, 160],
    [0, 58, -8],
    [14, -10, -148]
  ];
  hubs.slice(1).forEach((h) => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...hubs[0]),
      new THREE.Vector3(...h)
    ]);
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({
      color: teal, transparent: true, opacity: 0.18
    })));
  });
}

function addBeacon(region) {
  if (region.noBeacon) return;
  const mark = region.mark || region.pos;
  const field = region.kind !== "art" && region.id !== "arrival" && !region.quietMark;
  const orbR = field ? 1.25 : 0.42;
  const geo = new THREE.SphereGeometry(orbR, 24, 24);
  const mat = new THREE.MeshBasicMaterial({ color: region.kind === "exploded" ? gold : teal });
  const orb = new THREE.Mesh(geo, mat);
  orb.position.set(...mark);
  orb.userData.regionId = region.id;
  scene.add(orb);
  clickables.push(orb);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(field ? 2.7 : 1.05, field ? 3.15 : 1.22, 48),
    new THREE.MeshBasicMaterial({ color: gold, side: THREE.DoubleSide, transparent: true, opacity: field ? 0.78 : 0.5 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(mark[0], mark[1] - (field ? 3.4 : 1.6), mark[2]);
  scene.add(ring);
  if (field) {
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 4.55, 48),
      new THREE.MeshBasicMaterial({ color: teal, side: THREE.DoubleSide, transparent: true, opacity: 0.32 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.set(mark[0], mark[1] - 3.4, mark[2]);
    scene.add(halo);
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 26, 8),
      new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    shaft.position.set(mark[0], mark[1] + 10, mark[2]);
    scene.add(shaft);
  }
  const title = makeLabel(region.name, {
    pw: field ? 13.2 : 8.4,
    ph: field ? 2.5 : 1.7,
    font: field ? "600 68px Georgia, serif" : "600 56px Georgia, serif"
  });
  title.position.set(mark[0], mark[1] + (field ? 3.8 : 2.2), mark[2]);
  title.userData.regionId = region.id;
  title.userData.billboard = true;
  scene.add(title);
  clickables.push(title);
}

function makeShip() {
  const g = new THREE.Group();
  const goldMat = new THREE.MeshBasicMaterial({ color: gold });
  const tealMat = new THREE.MeshBasicMaterial({ color: teal });
  const dark = new THREE.MeshBasicMaterial({ color: 0x1a6f6a });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.15, 8), goldMat);
  body.rotation.x = Math.PI / 2;
  g.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 8), goldMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -0.78;
  g.add(nose);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), tealMat);
  canopy.position.set(0, 0.14, -0.12);
  canopy.scale.set(0.85, 0.55, 1);
  g.add(canopy);

  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.035, 0.38), goldMat);
  wing.position.set(0, -0.04, 0.08);
  g.add(wing);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.22), goldMat);
  tail.position.set(0, 0.2, 0.48);
  g.add(tail);

  const strut = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.08), dark);
  strut.position.set(0, -0.12, 0.02);
  g.add(strut);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: teal, transparent: true, opacity: 0.7 })
  );
  glow.position.z = 0.68;
  g.add(glow);
  g.userData.glow = glow;
  return g;
}

function makeMedal() {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 28),
    new THREE.MeshBasicMaterial({ color: gold, side: THREE.DoubleSide })
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.98, 1.18, 28),
    new THREE.MeshBasicMaterial({ color: teal, side: THREE.DoubleSide })
  );
  ring.position.z = 0.02;
  g.add(disc, ring);
  return g;
}

function hangArt(tex, title, regionId, pos) {
  const plane = imagePlane(tex, 5.1);
  plane.position.set(...pos);
  plane.userData.regionId = regionId;
  plane.userData.title = title;
  plane.userData.billboard = true;
  scene.add(plane);
  clickables.push(plane);
  const cap = makeLabel(title, { w: 900, h: 160, pw: 4.6, ph: 0.8, font: "500 42px Georgia, serif" });
  cap.position.copy(plane.position);
  cap.position.y -= 3.0;
  cap.userData.billboard = true;
  scene.add(cap);
}

function shootBubble() {
  if (bubbleCool > 0 || bubbles.length > 22) return;
  bubbleCool = 0.16;
  const dir = lookDir();
  const origin = ship
    ? ship.position.clone().addScaledVector(dir, 0.85)
    : cam.pos.clone().addScaledVector(dir, 2.2);
  const color = Math.random() < 0.55 ? teal : gold;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22 + Math.random() * 0.12, 12, 12),
    new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.38, depthWrite: false
    })
  );
  mesh.position.copy(origin);
  scene.add(mesh);
  bubbles.push({
    mesh,
    vel: dir.clone().multiplyScalar(7.2 + Math.random() * 2.4).add(new THREE.Vector3(
      (Math.random() - 0.5) * 1.3,
      0.75 + Math.random() * 1.05,
      (Math.random() - 0.5) * 1.3
    )),
    age: 0,
    life: 2.8 + Math.random() * 1.4,
    wob: Math.random() * Math.PI * 2,
    pop: false
  });
}

function updateBubbles(dt) {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.age += dt;
    b.wob += dt * 3.2;
    if (!b.pop) {
      b.vel.y += dt * 0.55;
      b.vel.multiplyScalar(Math.exp(-dt * 0.35));
      b.mesh.position.addScaledVector(b.vel, dt);
      b.mesh.position.x += Math.sin(b.wob) * dt * 0.55;
      b.mesh.position.y += Math.cos(b.wob * 1.3) * dt * 0.35;
      const t = b.age / b.life;
      b.mesh.material.opacity = 0.4 * (1 - t * t);
      if (b.age >= b.life) b.pop = true;
    } else {
      b.mesh.scale.multiplyScalar(1 + dt * 4.2);
      b.mesh.material.opacity *= Math.exp(-dt * 8);
      if (b.mesh.material.opacity < 0.02) {
        scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        bubbles.splice(i, 1);
      }
    }
  }
}

function updateShip(dt) {
  if (!ship) return;
  const dir = lookDir();
  const target = cam.pos.clone().addScaledVector(dir, 3.55);
  target.y -= 0.88;
  ship.position.lerp(target, 1 - Math.exp(-dt * 14));
  const aim = ship.position.clone().add(dir);
  ship.lookAt(aim);
  const glow = ship.userData.glow;
  if (glow) {
    const pulse = 0.45 + 0.28 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 6.2));
    glow.material.opacity = pulse;
    const boost = Math.min(cam.vel.length() * 0.04, 0.25);
    glow.scale.setScalar(1 + boost);
  }
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
    lab.userData.billboard = true;
    group.add(lab);
  });
  IAU_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    const ang = (i / IAU_CARDS.length) * Math.PI * 1.4 - 0.4;
    m.position.set(Math.cos(ang) * 16, 2 + (i % 3) * 1.4, -10 + Math.sin(ang) * 12);
    m.lookAt(0, 3, 0);
    m.userData.regionId = "iau";
    m.userData.billboard = true;
    group.add(m);
    clickables.push(m);
  });
  scene.add(group);
}

function placeClickCard(mesh, regionId, extra) {
  extra = extra || {};
  mesh.userData.regionId = regionId;
  if (extra.billboard !== false) mesh.userData.billboard = true;
  Object.assign(mesh.userData, extra);
  scene.add(mesh);
  clickables.push(mesh);
}

function hallCard(piece, hrefLabel, tex) {
  const m = tex ? makeClipCard(piece[0], piece[1], tex) : makeCard(piece[0], piece[1]);
  return { mesh: m, extra: {
    title: piece[0],
    body: piece[1],
    href: piece[2],
    linkLabel: hrefLabel
  } };
}

async function loadOptional(url) {
  if (!url) return null;
  try { return await loadTexture(url); }
  catch (err) { return null; }
}

async function populateJournalism() {
  const region = REGIONS.find((r) => r.id === "journalism");
  const ox = region.look[0], oy = region.look[1], oz = region.look[2];

  const intro = makeCard(
    "Tillamook County Pioneer",
    "Assistant editor, 2022–present. The author archive mixes other writers. Sample Cara Mico bylines are the cards in this hall — click any card for the live piece."
  );
  intro.position.set(ox - 14, oy + 2, oz);
  faceArrival(intro);
  placeClickCard(intro, "journalism", {
    title: "Tillamook County Pioneer",
    body: "Assistant editor since June 2022. Live Cara bylines only — the Pioneer author page also lists other writers.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/",
    linkLabel: "Pioneer author archive",
    links: PIONEER_PIECES.map(([t, , u]) => [t, u])
  });

  for (let i = 0; i < PIONEER_PIECES.length; i++) {
    const piece = PIONEER_PIECES[i];
    const tex = await loadOptional(piece[3]);
    const { mesh, extra } = hallCard(piece, "Open this Pioneer piece", tex);
    const col = i % 4;
    const row = Math.floor(i / 4);
    mesh.position.set(ox - 18 + col * 12, oy + 3 - row * 6.8, oz + 16);
    faceArrival(mesh);
    placeClickCard(mesh, "journalism", extra);
  }

  const seasideIntro = makeCard(
    "Seaside Signal — 2019",
    "Fifteen live bylines from the 2019 Signal list. Each card opens the published story."
  );
  seasideIntro.position.set(ox, oy + 8, oz + 48);
  faceArrival(seasideIntro);
  placeClickCard(seasideIntro, "journalism", {
    title: "Seaside Signal, 2019",
    body: "Fifteen verified live stories. Click a card or use the links in this panel.",
    links: SEASIDE_PIECES.map(([t, , u]) => [t, u])
  });

  for (let i = 0; i < SEASIDE_PIECES.length; i++) {
    const piece = SEASIDE_PIECES[i];
    const tex = await loadOptional(piece[3]);
    const { mesh, extra } = hallCard(piece, "Open this Signal story", tex);
    const col = i % 5;
    const row = Math.floor(i / 5);
    mesh.position.set(ox - 24 + col * 12, oy + 3 - row * 6.8, oz + 64);
    faceArrival(mesh);
    placeClickCard(mesh, "journalism", extra);
  }

  for (let i = 0; i < HIPFISH.length; i++) {
    const piece = HIPFISH[i];
    const tex = await loadOptional(piece[3]);
    const { mesh, extra } = hallCard(piece, "Open this HipFish issue PDF", tex);
    mesh.position.set(ox - 16 + (i % 2) * 16, oy + 2 - Math.floor(i / 2) * 6.4, oz + 94);
    faceArrival(mesh);
    placeClickCard(mesh, "journalism", extra);
  }

  for (let i = 0; i < MERCURY.length; i++) {
    const piece = MERCURY[i];
    const tex = await loadOptional(piece[3]);
    const { mesh, extra } = hallCard(piece, "Open this Mercury story", tex);
    mesh.position.set(ox - 10 + i * 16, oy + 2, oz + 114);
    faceArrival(mesh);
    placeClickCard(mesh, "journalism", extra);
  }

  const freelance = makeCard(
    "Freelance newspapers, since 2012",
    "From the Experience page: arts, environment, and emergency preparedness since November 2012. Papers in this room are the CV set — Pioneer, Seaside Signal, Cannon Beach Gazette, HipFish Monthly, and the Portland Mercury."
  );
  freelance.position.set(ox, oy - 4, oz + 130);
  faceArrival(freelance);
  placeClickCard(freelance, "journalism", {
    title: "Freelance journalist, Nov 2012–present",
    body: "Arts, environment, and emergency preparedness. Assistant editor at the Tillamook County Pioneer. Other papers named here are from the published CV only."
  });
}

async function populateGazette() {
  const region = REGIONS.find((r) => r.id === "gazette");
  const ox = region.look[0], oy = region.look[1], oz = region.look[2];
  for (let i = 0; i < GAZETTE_PIECES.length; i++) {
    const piece = GAZETTE_PIECES[i];
    const tex = await loadOptional(piece[3]);
    const { mesh, extra } = hallCard(piece, piece[2] ? "Open the Gazette puffin reprint" : "", tex);
    const col = i % 5;
    const row = Math.floor(i / 5);
    mesh.position.set(ox - 24 + col * 12, oy + 4 - row * 6.8, oz);
    faceArrival(mesh);
    placeClickCard(mesh, "gazette", extra);
  }
}

function populateCredentials() {
  const origin = REGIONS.find((r) => r.id === "credentials").pos;
  const ox = origin[0], oy = origin[1], oz = origin[2];

  JOBS.forEach((job, i) => {
    const m = makeJobCard(job[0], job[1], job[2], job[3]);
    const ang = (i / JOBS.length) * Math.PI * 2;
    const r = 28;
    m.position.set(ox + Math.cos(ang) * r, oy + ((i % 3) - 1) * 5.6, oz - 16 + Math.sin(ang) * r * 0.58);
    m.lookAt(ox, oy, oz - 8);
    placeClickCard(m, "credentials", {
      title: job[0],
      body: job[1] + " · " + job[2] + ". " + job[3],
      href: "https://graphicoregon.com/experience/",
      linkLabel: "Open the Experience page"
    });
  });

  EDUCATION.forEach((ed, i) => {
    const m = makeJobCard(ed[0], ed[1], "Education", ed[2]);
    m.position.set(ox - 18 + i * 12, oy + 12, oz - 6);
    placeClickCard(m, "credentials", {
      title: ed[0],
      body: ed[1] + ". " + ed[2],
      href: "https://graphicoregon.com/experience/",
      linkLabel: "Open the Experience page"
    });
  });

  CERTS.forEach((c, i) => {
    const plaque = makeLabel(c[0] + " — " + c[1], {
      w: 1400, h: 220, pw: 9.2, ph: 1.45, font: "500 40px Georgia, serif",
      stroke: "rgba(42,168,160,0.75)"
    });
    const col = i % 2;
    const row = Math.floor(i / 2);
    plaque.position.set(ox - 12 + col * 14, oy - 14 - row * 2.2, oz - 4);
    placeClickCard(plaque, "credentials", {
      title: c[0],
      body: c[1] + ". From the published CV training list — not a LinkedIn Learning catalog."
    });
  });
}

function populateAwards() {
  const origin = REGIONS.find((r) => r.id === "awards").pos;
  const ox = origin[0], oy = origin[1], oz = origin[2];
  AWARDS.forEach((a, i) => {
    const medal = makeMedal();
    const ang = (i / AWARDS.length) * Math.PI * 2;
    medal.position.set(ox + Math.cos(ang) * 8.5, oy + 1.2, oz + Math.sin(ang) * 8.5);
    medal.userData.regionId = "awards";
    medal.userData.title = a[0];
    medal.userData.body = a[1];
    medal.userData.billboard = true;
    scene.add(medal);
    clickables.push(medal);
    const lab = makeLabel(a[0] + " — " + a[1], {
      w: 1400, h: 200, pw: 8.6, ph: 1.25, font: "500 40px Georgia, serif"
    });
    lab.position.set(medal.position.x, medal.position.y - 2.2, medal.position.z);
    lab.userData.regionId = "awards";
    lab.userData.billboard = true;
    scene.add(lab);
    clickables.push(lab);
  });
}

function populateIloa() {
  const origin = REGIONS.find((r) => r.id === "iloa").pos;
  ILOA_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    const ang = (i / ILOA_CARDS.length) * Math.PI * 1.5 - 0.4;
    m.position.set(origin[0] + Math.cos(ang) * 12, origin[1] + ((i % 2) - 0.5) * 3.2, origin[2] - 8 + Math.sin(ang) * 10);
    m.lookAt(origin[0], origin[1], origin[2]);
    placeClickCard(m, "iloa", {
      title: card[0],
      body: card[1],
      href: "https://graphicoregon.com/astronomical-mapping-an-iau-proposal/",
      linkLabel: "Related: IAU mapping proposal"
    });
  });
}

function populateService() {
  const origin = REGIONS.find((r) => r.id === "service").pos;
  SERVICE.forEach((s, i) => {
    const m = makeJobCard(s[0], s[1], "Service", s[2]);
    const col = i % 3;
    const row = Math.floor(i / 3);
    m.position.set(origin[0] - 12 + col * 12, origin[1] + 3 - row * 6.6, origin[2] - 10);
    placeClickCard(m, "service", {
      title: s[0],
      body: s[1] + ". " + s[2],
      href: "https://graphicoregon.com/experience/",
      linkLabel: "Open the Experience page"
    });
  });
}

function populateTalks() {
  const origin = REGIONS.find((r) => r.id === "talks").pos;
  TALKS.forEach((t, i) => {
    const { mesh, extra } = hallCard(t, t[2] ? "Open the related paper" : "");
    mesh.position.set(origin[0] - 16 + (i % 2) * 16, origin[1] + 2 - Math.floor(i / 2) * 6.6, origin[2] - 8);
    placeClickCard(mesh, "talks", extra);
  });
}

function populateAiTutor() {
  const origin = REGIONS.find((r) => r.id === "aitutor").pos;
  const cards = [
    ["Google ML models", "Developed and edited content for Google’s ML models, focusing on data quality."],
    ["Machine responses", "Refined machine responses to meet Google’s standards."],
    ["Looker", "Used Looker to monitor and optimize content production metrics."]
  ];
  cards.forEach((c, i) => {
    const m = makeCard(c[0], c[1]);
    m.position.set(origin[0] - 10 + i * 10, origin[1] + 1, origin[2] - 8);
    placeClickCard(m, "aitutor", { title: c[0], body: c[1] });
  });
}

function populateContracts() {
  const origin = REGIONS.find((r) => r.id === "contracts").pos;
  WEB_CONTRACTS.forEach((c, i) => {
    const plaque = makeLabel(c[0], {
      w: 1100, h: 200, pw: 7.4, ph: 1.25, font: "500 44px Georgia, serif",
      stroke: "rgba(42,168,160,0.75)"
    });
    plaque.position.set(origin[0] - 16 + (i % 3) * 14, origin[1] + 3 - Math.floor(i / 3) * 3.2, origin[2] - 8);
    placeClickCard(plaque, "contracts", {
      title: c[0],
      body: c[1],
      href: c[2] || undefined,
      linkLabel: c[2] ? "Open named site" : undefined
    });
  });
}

function populateResearchCard(id) {
  const r = REGIONS.find((x) => x.id === id);
  if (!r) return;
  const m = makeCard(r.title, r.body);
  m.position.set(r.pos[0], r.pos[1] + 3.4, r.pos[2] - 8);
  placeClickCard(m, id, {
    title: r.title,
    body: r.body,
    href: r.href,
    linkLabel: r.linkLabel
  });
}

async function explodeResearch(id, figs) {
  const r = REGIONS.find((x) => x.id === id);
  if (!r || !figs.length) return;
  const [lx, ly, lz] = r.look;
  const texs = await Promise.all(figs.map(([u]) => loadTexture(u)));
  texs.forEach((tex, i) => {
    if (!tex) return;
    const plane = imagePlane(tex, 6.2);
    const a = (i / figs.length) * Math.PI * 1.7 - 0.85;
    const rad = 13;
    plane.position.set(
      lx + Math.cos(a) * rad,
      ly + ((i % 3) - 1) * 3.1,
      lz + Math.sin(a) * rad * 0.5
    );
    plane.lookAt(r.pos[0], r.pos[1], r.pos[2]);
    plane.userData.regionId = id;
    plane.userData.title = figs[i][1];
    plane.userData.billboard = true;
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(figs[i][1], { w: 900, h: 160, pw: 5.2, ph: 0.85, font: "500 38px Georgia, serif" });
    cap.position.copy(plane.position);
    cap.position.y -= 3.6;
    cap.lookAt(r.pos[0], r.pos[1], r.pos[2]);
    cap.userData.billboard = true;
    scene.add(cap);
  });
}


const STUDIO_WALL = new THREE.MeshLambertMaterial({ color: 0x101820 });
const STUDIO_FLOOR = new THREE.MeshLambertMaterial({ color: 0x0a1014 });
const STUDIO_CEIL = new THREE.MeshLambertMaterial({ color: 0x070b0e });
const STUDIO_TEAL = new THREE.MeshBasicMaterial({ color: teal });
const STUDIO_GOLD = new THREE.MeshBasicMaterial({ color: gold });
const STUDIO_DARK = new THREE.MeshLambertMaterial({ color: 0x161e24 });

function musBox(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

function musSlab(x, y, z, w, h, d, mat) {
  const m = musBox(w, h, d, mat || STUDIO_WALL);
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

function framedArt(tex, maxW, rotDeg) {
  let map = tex;
  if (rotDeg) {
    map = tex.clone();
    map.center.set(0.5, 0.5);
    map.rotation = (rotDeg * Math.PI) / 180;
    map.needsUpdate = true;
  }
  const img = tex.image;
  let aspect = img.width / img.height;
  if (rotDeg === 90 || rotDeg === -90) aspect = 1 / aspect;
  const w = aspect >= 1 ? maxW : maxW * aspect;
  const h = aspect >= 1 ? maxW / aspect : maxW;
  const g = new THREE.Group();
  const back = musBox(w + 0.22, h + 0.22, 0.08, STUDIO_GOLD);
  back.position.z = -0.06;
  const plate = musBox(w + 0.04, h + 0.04, 0.03, STUDIO_DARK);
  plate.position.z = -0.02;
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    bothSides(new THREE.MeshBasicMaterial({ map }))
  );
  pic.position.z = 0.01;
  g.add(back, plate, pic);
  g.userData.pic = pic;
  return g;
}

function hangOnWall(tex, title, regionId, pos, rotY, rotDeg) {
  if (!tex) return;
  const piece = framedArt(tex, 3.35, rotDeg || 0);
  piece.position.set(...pos);
  piece.rotation.y = rotY;
  piece.userData.regionId = regionId;
  piece.userData.title = title;
  piece.userData.stay = true;
  scene.add(piece);
  clickables.push(piece);
  const cap = makeLabel(title, {
    w: 900, h: 140, pw: 3.4, ph: 0.55,
    font: "500 40px Georgia, serif",
    color: "#e8d29a",
    stroke: "rgba(212,176,90,0.85)",
    bg: "rgba(10,16,20,0.82)"
  });
  cap.position.set(pos[0], pos[1] - 2.15, pos[2]);
  cap.rotation.y = rotY;
  scene.add(cap);
}

function hangHall(works, hall, regionId) {
  const { x0, x1, z0, z1, y, face } = hall;
  const far = [];
  const left = [];
  const right = [];
  works.forEach((w, i) => {
    const slot = i % 5;
    if (slot < 3) far.push(w);
    else if (slot === 3) left.push(w);
    else right.push(w);
  });
  if (face === "+z") {
    placeRow(far, x0 + 4.2, x1 - 4.2, (x) => [x, y, z1 - 0.42], Math.PI, regionId);
    placeRow(left, z0 + 5.5, z1 - 5.5, (z) => [x0 + 0.42, y, z], Math.PI / 2, regionId);
    placeRow(right, z0 + 5.5, z1 - 5.5, (z) => [x1 - 0.42, y, z], -Math.PI / 2, regionId);
  } else if (face === "-z") {
    placeRow(far, x0 + 4.2, x1 - 4.2, (x) => [x, y, z0 + 0.42], 0, regionId);
    placeRow(left, z0 + 5.5, z1 - 5.5, (z) => [x1 - 0.42, y, z], -Math.PI / 2, regionId);
    placeRow(right, z0 + 5.5, z1 - 5.5, (z) => [x0 + 0.42, y, z], Math.PI / 2, regionId);
  } else if (face === "-x") {
    placeRow(far, z0 + 4.2, z1 - 4.2, (z) => [x0 + 0.42, y, z], Math.PI / 2, regionId);
    placeRow(left, x0 + 5.5, x1 - 5.5, (x) => [x, y, z1 - 0.42], Math.PI, regionId);
    placeRow(right, x0 + 5.5, x1 - 5.5, (x) => [x, y, z0 + 0.42], 0, regionId);
  }
}

function placeRow(items, a0, a1, at, rotY, regionId) {
  if (!items.length) return;
  const n = items.length;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? (a0 + a1) / 2 : a0 + ((i + 0.5) / n) * (a1 - a0);
    const [tex, title, rot] = items[i];
    hangOnWall(tex, title, regionId, at(t), rotY, rot || 0);
  }
}

function hallTitle(text, pos, rotY) {
  const lab = makeLabel(text, {
    w: 1400, h: 220, pw: 8.6, ph: 1.3,
    font: "600 64px Georgia, serif",
    color: "#e8d29a",
    stroke: "rgba(42,168,160,0.7)",
    bg: "rgba(10,16,20,0.55)"
  });
  lab.position.set(...pos);
  lab.rotation.y = rotY || 0;
  scene.add(lab);
}

function addDoorway(regionId, pos, rotY, label) {
  const g = new THREE.Group();
  const frame = musBox(5.2, 7.4, 0.28, STUDIO_GOLD);
  const hole = musBox(4.3, 6.6, 0.32, new THREE.MeshBasicMaterial({
    color: 0x071014, transparent: true, opacity: 0.35
  }));
  hole.position.z = 0.04;
  const lintel = makeLabel(label, {
    w: 900, h: 160, pw: 4.4, ph: 0.7,
    font: "600 48px Georgia, serif"
  });
  lintel.position.set(0, 4.15, 0.2);
  g.add(frame, hole, lintel);
  g.position.set(...pos);
  g.rotation.y = rotY || 0;
  g.userData.regionId = regionId;
  scene.add(g);
  clickables.push(g);
  return g;
}

function rimHall(x0, x1, z0, z1, y0, y1) {
  const t = 0.07;
  musSlab((x0 + x1) / 2, y0 + 0.06, z0 + t, x1 - x0, t, t, STUDIO_TEAL);
  musSlab((x0 + x1) / 2, y0 + 0.06, z1 - t, x1 - x0, t, t, STUDIO_TEAL);
  musSlab(x0 + t, y0 + 0.06, (z0 + z1) / 2, t, t, z1 - z0, STUDIO_TEAL);
  musSlab(x1 - t, y0 + 0.06, (z0 + z1) / 2, t, t, z1 - z0, STUDIO_TEAL);
  musSlab((x0 + x1) / 2, y1 - 0.08, z0 + t, x1 - x0, t, t, STUDIO_TEAL);
  musSlab((x0 + x1) / 2, y1 - 0.08, z1 - t, x1 - x0, t, t, STUDIO_TEAL);
}

function enclosedHall(x0, x1, z0, z1, y0, y1, openings) {
  const t = 0.45;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  musSlab(cx, y0, cz, x1 - x0, 0.16, z1 - z0, STUDIO_FLOOR);
  musSlab(cx, y1, cz, x1 - x0, 0.16, z1 - z0, STUDIO_CEIL);
  const doors = openings || [];
  function wallWithDoors(axis, fixed, a0, a1, yMid, h, doorsOn) {
    const gaps = doorsOn
      .filter((d) => d.axis === axis)
      .map((d) => ({ a: d.a, w: d.w || 5.2 }))
      .sort((p, q) => p.a - q.a);
    let cursor = a0;
    const segs = [];
    gaps.forEach((g) => {
      const g0 = g.a - g.w / 2;
      const g1 = g.a + g.w / 2;
      if (g0 > cursor + 0.4) segs.push([cursor, g0]);
      cursor = Math.max(cursor, g1);
    });
    if (cursor < a1 - 0.4) segs.push([cursor, a1]);
    segs.forEach(([s0, s1]) => {
      const mid = (s0 + s1) / 2;
      const len = s1 - s0;
      if (axis === "z") musSlab(fixed, yMid, mid, t, h, len);
      else musSlab(mid, yMid, fixed, len, h, t);
    });
  }
  const yMid = (y0 + y1) / 2;
  const h = y1 - y0;
  wallWithDoors("z", x0, z0, z1, yMid, h, doors.filter((d) => d.side === "x0"));
  wallWithDoors("z", x1, z0, z1, yMid, h, doors.filter((d) => d.side === "x1"));
  wallWithDoors("x", z0, x0, x1, yMid, h, doors.filter((d) => d.side === "z0"));
  wallWithDoors("x", z1, x0, x1, yMid, h, doors.filter((d) => d.side === "z1"));
  rimHall(x0, x1, z0, z1, y0, y1);
}

function addStudioLight(x, y, z, color, intensity, dist) {
  const l = new THREE.PointLight(color, intensity, dist);
  l.position.set(x, y, z);
  scene.add(l);
}

function makeGarmentStand(tex, kind) {
  const g = new THREE.Group();
  const ped = musBox(1.55, 0.26, 1.15, STUDIO_GOLD);
  ped.position.y = 0.13;
  g.add(ped);
  const post = musBox(0.14, 0.95, 0.14, STUDIO_DARK);
  post.position.y = 0.72;
  g.add(post);
  const form = new THREE.Group();
  form.position.y = 2.15;
  const print = bothSides(new THREE.MeshBasicMaterial({ map: tex }));
  if (kind === "skirt") {
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 0.24, 12), STUDIO_DARK);
    waist.position.y = 0.55;
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.42, 1.28, 12), STUDIO_DARK);
    inner.position.y = -0.18;
    const flare = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.46, 1.3, 12, 1, true), print);
    flare.position.y = -0.18;
    form.add(waist, inner, flare);
  } else {
    const tw = kind === "hoodie" ? 1.42 : kind === "dress" ? 1.2 : 1.22;
    const th = kind === "hoodie" ? 1.8 : kind === "dress" ? 2.35 : 1.62;
    const body = musBox(tw, th, 0.32, STUDIO_DARK);
    const front = new THREE.Mesh(new THREE.PlaneGeometry(tw * 0.9, th * 0.9), print);
    front.position.z = 0.17;
    const sleeveW = (kind === "hoodie" || kind === "longsleeve") ? 0.78 : 0.42;
    const sl = musBox(sleeveW, 0.36, 0.26, STUDIO_DARK);
    sl.position.set(-(tw / 2 + sleeveW / 2 - 0.06), th * 0.28, 0);
    const sr = musBox(sleeveW, 0.36, 0.26, STUDIO_DARK);
    sr.position.set(tw / 2 + sleeveW / 2 - 0.06, th * 0.28, 0);
    form.add(body, front, sl, sr);
    if (kind === "hoodie") {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), STUDIO_DARK);
      hood.position.set(0, th / 2 + 0.02, -0.04);
      form.add(hood);
    }
  }
  g.add(form);
  return g;
}

function buildStudioShell() {
  const x0 = -258, x1 = -156, y0 = 0, y1 = 15.2, z0 = -70, z1 = 66;
  musSlab((x0 + x1) / 2, y0 - 0.2, (z0 + z1) / 2, x1 - x0 + 2.4, 0.4, z1 - z0 + 2.4, STUDIO_FLOOR);
  musSlab((x0 + x1) / 2, y1 + 0.35, (z0 + z1) / 2, x1 - x0 + 1.2, 0.7, z1 - z0 + 1.2, STUDIO_DARK);
  musSlab(x0 - 0.3, (y0 + y1) / 2, (z0 + z1) / 2, 0.6, y1 - y0 + 1.2, z1 - z0 + 1.2);
  musSlab((x0 + x1) / 2, (y0 + y1) / 2, z0 - 0.3, x1 - x0 + 1.2, y1 - y0 + 1.2, 0.6);
  musSlab((x0 + x1) / 2, (y0 + y1) / 2, z1 + 0.3, x1 - x0 + 1.2, y1 - y0 + 1.2, 0.6);

  // east facade with portal gap
  const facadeY = (y0 + y1) / 2;
  const facadeH = y1 - y0 + 1.2;
  musSlab(x1 + 0.3, facadeY, -38, 0.7, facadeH, 58);
  musSlab(x1 + 0.3, facadeY, 36, 0.7, facadeH, 54);
  musSlab(x1 + 0.3, 12.4, 0, 0.7, 6.4, 12.4);
  musSlab(x1 + 0.3, 2.0, -7.6, 0.7, 4.0, 3.2);
  musSlab(x1 + 0.3, 2.0, 7.6, 0.7, 4.0, 3.2);

  // cornice and pilasters
  musSlab(x1 + 0.85, y1 + 0.15, 0, 1.4, 0.35, z1 - z0 + 2, STUDIO_GOLD);
  musSlab(x1 + 1.1, 7.4, -8.6, 1.5, 14.8, 1.4, STUDIO_DARK);
  musSlab(x1 + 1.1, 7.4, 8.6, 1.5, 14.8, 1.4, STUDIO_DARK);
  musSlab(x1 + 1.1, 15.1, 0, 1.6, 0.45, 20, STUDIO_GOLD);

  // steps / plaza
  musSlab(-152.2, 0.25, 0, 8.2, 0.5, 16, STUDIO_DARK);
  musSlab(-148.4, 0.08, 0, 6.4, 0.16, 20, STUDIO_FLOOR);
  musSlab(-140, 0.02, 0, 18, 0.08, 28, STUDIO_FLOOR);
  musSlab(-140, 0.07, -14, 18, 0.08, 0.18, STUDIO_TEAL);
  musSlab(-140, 0.07, 14, 18, 0.08, 0.18, STUDIO_TEAL);

  const name = makeLabel("STUDIO", {
    w: 1600, h: 320, pw: 24, ph: 4.2,
    font: "600 140px Georgia, serif",
    color: "#e8d29a",
    stroke: "rgba(42,168,160,0.85)",
    bg: "rgba(10,16,20,0.45)"
  });
  name.position.set(-154.4, 14.4, 0);
  name.rotation.y = Math.PI / 2;
  scene.add(name);

  // small outdoor sculpture garden
  [[-136, 0, 18], [-136, 0, -18], [-144, 0, 22]].forEach((p, i) => {
    musSlab(p[0], 0.45, p[2], 1.4, 0.9, 1.4, STUDIO_GOLD);
    const stone = musBox(0.7 + i * 0.08, 1.6 + (i % 2) * 0.5, 0.55, STUDIO_DARK);
    stone.position.set(p[0], 1.7, p[2]);
    stone.rotation.y = 0.2 * i;
    scene.add(stone);
  });
}

function populateStudioGeometry() {
  buildStudioShell();

  const y0 = 0.08, y1 = 10.4;
  enclosedHall(-188, -156.4, -18, 18, y0, y1, [
    { side: "x1", axis: "z", a: 0, w: 5.6 },
    { side: "x0", axis: "z", a: 0, w: 5.4 },
    { side: "z1", axis: "x", a: -176, w: 5.2 },
    { side: "z0", axis: "x", a: -170, w: 5.2 }
  ]);
  enclosedHall(-210, -162, 18, 64, y0, y1, [
    { side: "z0", axis: "x", a: -176, w: 5.2 }
  ]);
  enclosedHall(-186, -158, -40, -18.2, y0, y1, [
    { side: "z1", axis: "x", a: -170, w: 5.2 },
    { side: "x0", axis: "z", a: -30, w: 4.8 }
  ]);
  enclosedHall(-230, -190, -56, -22, y0, y1, [
    { side: "x1", axis: "z", a: -30, w: 4.8 }
  ]);
  enclosedHall(-190.2, -186, -40, -22, y0, 9.2, [
    { side: "x0", axis: "z", a: -30, w: 4.8 },
    { side: "x1", axis: "z", a: -30, w: 4.8 }
  ]);
  enclosedHall(-224, -188, -6.2, 6.2, y0, 9.2, [
    { side: "x1", axis: "z", a: 0, w: 5.2 },
    { side: "x0", axis: "z", a: 0, w: 5.2 },
    { side: "z1", axis: "x", a: -220, w: 4.6 },
    { side: "z0", axis: "x", a: -220, w: 4.6 }
  ]);
  enclosedHall(-240, -220, 6.2, 18.2, y0, 9.2, [
    { side: "z0", axis: "x", a: -220, w: 4.6 },
    { side: "z1", axis: "x", a: -234, w: 4.8 }
  ]);
  enclosedHall(-256, -224, -16, 16, y0, y1, [
    { side: "x1", axis: "z", a: 0, w: 5.2 }
  ]);
  enclosedHall(-248, -220, 18, 42, y0, y1, [
    { side: "z0", axis: "x", a: -234, w: 4.8 }
  ]);
  enclosedHall(-244, -220, -22.2, -6.2, y0, 9.2, [
    { side: "z1", axis: "x", a: -220, w: 4.6 },
    { side: "z0", axis: "x", a: -236, w: 5.2 }
  ]);
  enclosedHall(-256, -220, -68, -22, y0, y1, [
    { side: "z1", axis: "x", a: -236, w: 5.2 }
  ]);

  addDoorway("lobby", [-155.6, 3.7, 0], Math.PI / 2, "Enter");
  addDoorway("portraits", [-176, 3.7, 18.2], 0, "Portraits");
  addDoorway("shop", [-170, 3.7, -17.8], Math.PI, "Gift shop");
  addDoorway("still-life", [-186.2, 3.7, -30], -Math.PI / 2, "Still life");
  addDoorway("coast", [-223.6, 3.7, 0], -Math.PI / 2, "Coast");
  addDoorway("prints", [-234, 3.7, 18.2], 0, "Prints");
  addDoorway("studio", [-236, 3.7, -21.8], Math.PI, "Studio");

  hallTitle("Portraits & figures", [-186, 8.2, 63.2], Math.PI);
  hallTitle("Still life", [-208, 8.2, -55.2], 0);
  hallTitle("Coast", [-255.2, 8.2, 0], Math.PI / 2);
  hallTitle("Prints", [-234, 8.2, 41.2], Math.PI);
  hallTitle("Studio", [-236, 8.2, -67.2], 0);
  hallTitle("Lobby", [-187.2, 8.4, 0], Math.PI / 2);

  addStudioLight(-176, 8.2, 0, 0x2aa8a0, 18, 42);
  addStudioLight(-186, 8.0, 40, 0xd4b05a, 12, 40);
  addStudioLight(-208, 8.0, -38, 0x2aa8a0, 12, 36);
  addStudioLight(-240, 8.0, 0, 0x2aa8a0, 14, 36);
  addStudioLight(-234, 7.6, 30, 0xd4b05a, 10, 28);
  addStudioLight(-236, 8.0, -44, 0x2aa8a0, 14, 42);
  addStudioLight(-170, 7.6, -28, 0xd4b05a, 12, 28);
  addStudioLight(-150, 14, 0, 0xd4b05a, 16, 50);

  const counter = musBox(1.6, 1.15, 5.2, STUDIO_DARK);
  counter.position.set(-159.1, 0.7, -24.5);
  scene.add(counter);
  const top = musBox(1.7, 0.1, 5.3, STUDIO_GOLD);
  top.position.set(-159.1, 1.3, -24.5);
  scene.add(top);
  const sign = makeLabel("sassmeharder.com", {
    w: 1400, h: 220, pw: 5.6, ph: 0.9,
    font: "600 56px Georgia, serif"
  });
  sign.position.set(-158.2, 2.15, -24.5);
  sign.rotation.y = -Math.PI / 2;
  sign.userData.regionId = "shop";
  sign.userData.title = "sassmeharder.com";
  sign.userData.body = "Shirts with Sass. Live shop — click a garment to open the product.";
  sign.userData.href = "https://sassmeharder.com/";
  sign.userData.linkLabel = "Open sassmeharder.com";
  sign.userData.openUrl = "https://sassmeharder.com/";
  scene.add(sign);
  clickables.push(sign);

  const brand = makeLabel("Shirts with Sass", {
    w: 1100, h: 180, pw: 5.2, ph: 0.75,
    font: "500 44px Georgia, serif",
    stroke: "rgba(42,168,160,0.8)"
  });
  brand.position.set(-170, 8.3, -39.3);
  brand.rotation.y = Math.PI;
  scene.add(brand);
}

async function populateStudioArt() {
  const loadWing = async (list) => {
    const pairs = await Promise.all(list.map(async (item) => {
      const tex = await loadTexture(item[0]);
      return tex ? [tex, item[1], item[2]] : null;
    }));
    return pairs.filter(Boolean);
  };

  hangHall(await loadWing(PORTRAITS), { x0: -210, x1: -162, z0: 18, z1: 64, y: 4.15, face: "+z" }, "portraits");
  hangHall(await loadWing(STILL_LIFE), { x0: -230, x1: -190, z0: -56, z1: -22, y: 4.15, face: "-z" }, "still-life");
  hangHall(await loadWing(COAST), { x0: -256, x1: -224, z0: -16, z1: 16, y: 4.15, face: "-x" }, "coast");
  hangHall(await loadWing(PRINTS), { x0: -248, x1: -220, z0: 18, z1: 42, y: 4.15, face: "+z" }, "prints");
  hangHall(await loadWing(STUDIO), { x0: -256, x1: -220, z0: -68, z1: -22, y: 4.15, face: "-z" }, "studio");

  const shopTex = await Promise.all(SHOP_PRODUCTS.map((p) => loadTexture(p.file)));
  shopTex.forEach((tex, i) => {
    if (!tex) return;
    const p = SHOP_PRODUCTS[i];
    const stand = makeGarmentStand(tex, p.kind);
    if (i < 4) {
      stand.position.set(-181 + i * 5.4, 0.08, -27.2);
      stand.rotation.y = 0;
    } else {
      stand.position.set(-182.5 + (i - 4) * 4.4, 0.08, -36.6);
      stand.rotation.y = 0;
    }
    stand.userData.regionId = "shop";
    stand.userData.title = p.title;
    stand.userData.body = (p.price ? p.price + ". " : "") + "sassmeharder / Shirts with Sass. Click opens the live product.";
    stand.userData.href = p.href;
    stand.userData.linkLabel = "Open this product";
    stand.userData.openUrl = p.href;
    stand.userData.stay = true;
    scene.add(stand);
    clickables.push(stand);
    const tag = makeLabel(p.title, {
      w: 1000, h: 160, pw: 3.6, ph: 0.55,
      font: "500 36px Georgia, serif"
    });
    tag.position.set(stand.position.x, 0.85, stand.position.z + 0.95);
    tag.rotation.y = 0;
    scene.add(tag);
  });
}

function hopList(region) {
  const dest = { pos: region.pos, look: region.look };
  const hops = (region.hops && region.hops.length) ? region.hops.slice() : [dest];
  const end = hops[hops.length - 1];
  const endPos = new THREE.Vector3(...end.pos);
  if (cam.pos.distanceTo(endPos) < 18) return [end];
  if (cam.pos.x < -150 && hops.length > 1) return hops.slice(1);
  return hops;
}

function beginHop(toPos, toLook) {
  const aim = yawPitchFromPoints(toPos, toLook);
  const dist = cam.pos.distanceTo(toPos);
  return {
    fromPos: cam.pos.clone(),
    toPos,
    fromYaw: lookYaw,
    fromPitch: lookPitch,
    toYaw: aim.yaw,
    toPitch: aim.pitch,
    t: 0,
    dur: THREE.MathUtils.clamp(0.85 + dist / 78, 1.15, 3.8)
  };
}


function addPortico(x, y, z, rotY, lintel) {
  const g = new THREE.Group();
  const left = musBox(2.0, 16, 2.0, STUDIO_DARK);
  left.position.set(0, 8, -10);
  const right = musBox(2.0, 16, 2.0, STUDIO_DARK);
  right.position.set(0, 8, 10);
  const beam = musBox(2.2, 1.6, 24, STUDIO_GOLD);
  beam.position.set(0.1, 16.2, 0);
  g.add(left, right, beam);
  const lab = makeLabel(lintel, {
    w: 1400, h: 280, pw: 20, ph: 3.4,
    font: "600 120px Georgia, serif",
    color: "#e8d29a",
    stroke: "rgba(42,168,160,0.85)",
    bg: "rgba(10,16,20,0.4)"
  });
  lab.position.set(1.6, 16.5, 0);
  lab.rotation.y = Math.PI / 2;
  g.add(lab);
  g.position.set(x, y, z);
  g.rotation.y = rotY || 0;
  scene.add(g);
  return g;
}

function addRackWall(x, y, z, rotY, lintel) {
  const g = new THREE.Group();
  const wall = musBox(1.1, 15.6, 22.4, STUDIO_DARK);
  wall.position.set(0, 7.8, 0);
  const beam = musBox(1.6, 1.15, 23.2, STUDIO_GOLD);
  beam.position.set(0.2, 15.9, 0);
  g.add(wall, beam);
  const lab = makeLabel(lintel, {
    w: 1400, h: 240, pw: 16.5, ph: 2.6,
    font: "600 110px Georgia, serif",
    color: "#e8d29a",
    stroke: "rgba(42,168,160,0.8)",
    bg: "rgba(10,16,20,0.4)"
  });
  lab.position.set(1.15, 16.0, 0);
  lab.rotation.y = Math.PI / 2;
  g.add(lab);
  g.position.set(x, y, z);
  g.rotation.y = rotY || 0;
  scene.add(g);
  return g;
}

function addArrivalAnchors() {
  addPortico(-42, 0, -6, 0, "STUDIO");
  addRackWall(46, 0, 18, Math.PI, "RESEARCH");
  addPortico(0, 0, 54, Math.PI / 2, "WRITING");
}

function populateNetartsWall() {
  const wx = 108, wy = -2, wz = 16;
  const board = musBox(28.6, 22.4, 0.35, STUDIO_DARK);
  board.position.set(wx, wy + 1.2, wz - 0.28);
  scene.add(board);
  const rail = musBox(28.8, 0.28, 0.4, STUDIO_GOLD);
  rail.position.set(wx, wy + 12.4, wz - 0.05);
  scene.add(rail);
  const foot = musBox(28.8, 0.22, 0.4, STUDIO_TEAL);
  foot.position.set(wx, wy - 10.2, wz - 0.05);
  scene.add(foot);
  NETARTS_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    m.position.set(wx - 14.6, wy + 9.2 - i * 3.55, wz + 0.12);
    m.scale.set(0.72, 0.72, 1);
    m.rotation.y = 0;
    placeClickCard(m, "netarts", { billboard: false, title: card[0], body: card[1] });
  });
}

async function populateNetartsMaps() {
  const wx = 108, wy = -2, wz = 16;
  const mapTex = await Promise.all(MAPS.map(([u]) => loadTexture(u)));
  mapTex.forEach((tex, i) => {
    if (!tex) return;
    const plane = imagePlane(tex, 6.2);
    const col = i % 3;
    const row = Math.floor(i / 3);
    plane.position.set(wx - 1.2 + col * 7.6, wy + 6.4 - row * 5.7, wz + 0.12);
    plane.rotation.y = 0;
    plane.userData.regionId = "netarts";
    plane.userData.title = MAPS[i][1];
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(MAPS[i][1], { w: 900, h: 130, pw: 6.0, ph: 0.62, font: "500 34px Georgia, serif" });
    cap.position.set(plane.position.x, plane.position.y - 2.7, wz + 0.16);
    cap.rotation.y = 0;
    scene.add(cap);
  });
}

function populateWebPlaques() {
  const webOrigin = REGIONS.find((r) => r.id === "websites").pos;
  WEB_NAMES.forEach((name, i) => {
    const plaque = makeLabel(name, { w: 900, h: 180, pw: 6.4, ph: 1.15, font: "500 44px Georgia, serif", stroke: "rgba(42,168,160,0.75)" });
    const col = i % 3;
    const row = Math.floor(i / 3);
    plaque.position.set(webOrigin[0] - 16 + col * 13, webOrigin[1] - 10 - row * 2.0, webOrigin[2] - 4);
    plaque.userData.regionId = "websites";
    plaque.userData.billboard = true;
    scene.add(plaque);
    clickables.push(plaque);
  });
  const moonWidget = makeCard(
    "Moon-phase widget",
    "A client website object — a moon-phase display built for a commissioned site. Those photographs are not studio art and are not hung in the west halls."
  );
  moonWidget.position.set(webOrigin[0] + 18, webOrigin[1] + 2, webOrigin[2] - 8);
  placeClickCard(moonWidget, "websites", {
    title: "Moon-phase widget",
    body: "A moon-phase widget made as a website/client object. The phase photographs were for that widget, not Fine Art."
  });
}

async function populateWebShots() {
  const webOrigin = REGIONS.find((r) => r.id === "websites").pos;
  const webTex = await Promise.all(WEBSHOTS.map((u) => loadTexture(u)));
  webTex.forEach((tex, i) => {
    if (!tex) return;
    const plane = imagePlane(tex, 7.2);
    const col = i % 3;
    const row = Math.floor(i / 3);
    plane.position.set(webOrigin[0] - 16 + col * 13, webOrigin[1] + 5 - row * 7.2, webOrigin[2] - 16);
    plane.userData.regionId = "websites";
    plane.userData.title = "Website gallery";
    plane.userData.billboard = true;
    scene.add(plane);
    clickables.push(plane);
  });
}

function populateImmediate() {
  REGIONS.forEach(addBeacon);
  addWorldGuides();
  constellation([98, 20, -50]);
  addArrivalAnchors();
  populateNetartsWall();
  populateStudioGeometry();
  populateWebPlaques();
  populateCredentials();
  populateAwards();
  populateIloa();
  populateService();
  populateTalks();
  populateAiTutor();
  populateContracts();
  ["willamette-culvert", "willamette-plan", "hells-canyon", "oweb", "john-day", "santiam", "siuslaw-headwater", "big-elk"].forEach(populateResearchCard);

  const arrival = makeLabel("Art west  ·  Research east  ·  Writing north", {
    w: 1800, h: 200, pw: 28, ph: 2.2, font: "500 52px Georgia, serif"
  });
  arrival.position.set(0, 7.2, 6);
  arrival.userData.billboard = true;
  scene.add(arrival);

  ship = makeShip();
  scene.add(ship);
}

async function populateDeferred() {
  await populateNetartsMaps();
  await populateStudioArt();
  await populateWebShots();
  await populateJournalism();
  await populateGazette();
  for (const id of Object.keys(RESEARCH_FIGS)) {
    await explodeResearch(id, RESEARCH_FIGS[id]);
  }
}

function nearestRegion(p) {
  let best = REGIONS[0];
  let d = 1e9;
  for (const r of REGIONS) {
    const dd = p.distanceTo(new THREE.Vector3(...r.pos));
    if (dd < d) { d = dd; best = r; }
  }
  return best;
}

function showRegion(region, extra) {
  extra = extra || {};
  document.getElementById("region-name").textContent = region.name;
  const axis = document.getElementById("region-axis");
  if (axis) axis.textContent = region.axis || "";
  const panel = document.getElementById("panel");
  panel.hidden = false;
  document.getElementById("panel-meta").textContent = region.meta;
  document.getElementById("panel-title").textContent = extra.title || region.title;
  document.getElementById("panel-body").textContent = extra.body || region.body;
  const box = document.getElementById("panel-links");
  box.innerHTML = "";
  const links = extra.links ? extra.links.slice() : [];
  const href = extra.href || region.href;
  const label = extra.linkLabel || region.linkLabel || "Open source page";
  if (href && !links.some((pair) => pair[1] === href)) links.unshift([label, href]);
  links.forEach(([t, u]) => {
    if (!u) return;
    const a = document.createElement("a");
    a.href = u;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = t;
    box.appendChild(a);
  });
  document.querySelectorAll("#destinations button").forEach((b) => {
    b.classList.toggle("active", b.dataset.id === region.id);
  });
}

function flyTo(region, extra) {
  const hops = hopList(region).map((h) => ({
    pos: new THREE.Vector3(...h.pos),
    look: new THREE.Vector3(...h.look)
  }));
  const first = hops[0];
  flight = beginHop(first.pos, first.look);
  flight.queue = hops.slice(1);
  cam.vel.set(0, 0, 0);
  scrollBoost = 0;
  showRegion(region, extra);
}

function setupNav() {
  const nav = document.getElementById("destinations");
  NAV_GROUPS.forEach((group) => {
    const h = document.createElement("div");
    h.className = "group";
    h.textContent = group.label;
    nav.appendChild(h);
    group.ids.forEach((id) => {
      const r = REGIONS.find((x) => x.id === id);
      if (!r) return;
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.id = r.id;
      b.textContent = r.name;
      b.addEventListener("click", () => flyTo(r));
      nav.appendChild(b);
    });
  });
}

function pickAt(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  const ray = new THREE.Raycaster();
  ray.setFromCamera({ x, y }, camera);
  const hits = ray.intersectObjects(clickables, true);
  if (!hits.length) return null;
  let obj = hits[0].object;
  while (obj && !obj.userData.regionId && obj.parent) obj = obj.parent;
  return obj && obj.userData.regionId ? obj : null;
}

function onPointer(e) {
  const obj = pickAt(e);
  if (!obj) {
    shootBubble();
    return;
  }
  if (obj.userData.openUrl) {
    window.open(obj.userData.openUrl, "_blank", "noopener");
  }
  const region = REGIONS.find((r) => r.id === obj.userData.regionId);
  if (!region) return;
  const extra = {
    title: obj.userData.title,
    body: obj.userData.body,
    href: obj.userData.href,
    linkLabel: obj.userData.linkLabel,
    links: obj.userData.links
  };
  if (obj.userData.stay && cam.pos.distanceTo(new THREE.Vector3(...region.pos)) < 36) {
    showRegion(region, extra);
    return;
  }
  flyTo(region, extra);
}

function bindInput() {
  const el = renderer.domElement;
  const wheelIgnore = (t) => t && t.closest && t.closest("#destinations, #panel, a, button, input, textarea, select");
  window.addEventListener("wheel", (e) => {
    if (wheelIgnore(e.target)) return;
    e.preventDefault();
    if (flight) flight = null;
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;
    if (e.deltaMode === 2) dy *= 400;
    dy = THREE.MathUtils.clamp(dy, -140, 140);
    scrollBoost += -dy * 0.022;
    scrollBoost = THREE.MathUtils.clamp(scrollBoost, -10, 10);
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
    if (flight) flight = null;
    lookYaw -= (e.clientX - lastX) * 0.0034;
    lookPitch -= (e.clientY - lastY) * 0.0026;
    lookPitch = THREE.MathUtils.clamp(lookPitch, -1.15, 1.15);
    lastX = e.clientX;
    lastY = e.clientY;
  });
  el.addEventListener("pointerup", (e) => {
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    dragging = false;
    if (Math.hypot(dx, dy) < 7) onPointer(e);
  });
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (k === "f") {
      e.preventDefault();
      shootBubble();
    }
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "q", "e"].includes(k) || e.key === " ") {
      if (["ArrowUp", "ArrowDown", " ", "q", "e", "Q", "E"].includes(e.key)) e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (bubbleCool > 0) bubbleCool = Math.max(0, bubbleCool - dt);

  if (flight) {
    flight.t += dt;
    const s = smoothstep(flight.t / flight.dur);
    cam.pos.lerpVectors(flight.fromPos, flight.toPos, s);
    lookYaw = lerpAngle(flight.fromYaw, flight.toYaw, s);
    lookPitch = flight.fromPitch + (flight.toPitch - flight.fromPitch) * s;
    if (flight.t >= flight.dur) {
      if (flight.queue && flight.queue.length) {
        const next = flight.queue.shift();
        const rest = flight.queue;
        flight = beginHop(next.pos, next.look);
        flight.queue = rest;
      } else flight = null;
    }
  } else {
    const dir = lookDir();
    const speed = keys.shift ? 62 : 34;
    if (keys.w || keys.arrowup) cam.vel.addScaledVector(dir, speed * dt);
    if (keys.s || keys.arrowdown) cam.vel.addScaledVector(dir, -speed * dt);
    if (keys.a || keys.arrowleft) lookYaw += dt * 0.95;
    if (keys.d || keys.arrowright) lookYaw -= dt * 0.95;
    if (keys.q) cam.vel.y -= speed * 0.75 * dt;
    if (keys.e || keys[" "]) cam.vel.y += speed * 0.75 * dt;
    if (scrollBoost) {
      cam.vel.addScaledVector(dir, scrollBoost * dt * 24);
      scrollBoost *= Math.exp(-dt * 4.6);
      if (Math.abs(scrollBoost) < 0.04) scrollBoost = 0;
    }
    cam.vel.multiplyScalar(Math.exp(-dt * 2.15));
    cam.pos.addScaledVector(cam.vel, 1);
    cam.pos.x = THREE.MathUtils.clamp(cam.pos.x, bounds.x[0], bounds.x[1]);
    cam.pos.y = THREE.MathUtils.clamp(cam.pos.y, bounds.y[0], bounds.y[1]);
    cam.pos.z = THREE.MathUtils.clamp(cam.pos.z, bounds.z[0], bounds.z[1]);
  }

  const aim = lookDir();
  camera.position.copy(cam.pos);
  camera.lookAt(cam.pos.x + aim.x * 20, cam.pos.y + aim.y * 20, cam.pos.z + aim.z * 20);

  updateShip(dt);
  updateBubbles(dt);

  scene.traverse((obj) => {
    if (obj.userData && obj.userData.billboard) {
      obj.getWorldPosition(_billboardAt);
      obj.lookAt(camera.position.x, _billboardAt.y, camera.position.z);
    }
  });

  const region = nearestRegion(cam.pos);
  document.getElementById("region-name").textContent = region.name;
  const axis = document.getElementById("region-axis");
  if (axis) axis.textContent = region.axis || "";
  renderer.render(scene, camera);
}

async function main() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(ink);
  scene.fog = new THREE.FogExp2(0x0a1216, 0.00105);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 2000);
  camera.position.copy(cam.pos);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene.add(new THREE.AmbientLight(0x6f8a88, 0.95));
  const key = new THREE.PointLight(0x2aa8a0, 22, 140);
  key.position.set(8, 22, 16);
  scene.add(key);
  const rim = new THREE.PointLight(0xd4b05a, 16, 180);
  rim.position.set(-40, 28, -20);
  scene.add(rim);
  const east = new THREE.PointLight(0x2aa8a0, 20, 340);
  east.position.set(220, 8, 10);
  scene.add(east);
  const far = new THREE.PointLight(0xd4b05a, 14, 260);
  far.position.set(-150, 22, 0);
  scene.add(far);

  addStars();
  setupNav();
  populateImmediate();
  bindInput();
  const start = yawPitchFromPoints(cam.pos, new THREE.Vector3(...REGIONS[0].look));
  lookYaw = start.yaw;
  lookPitch = start.pitch;
  showRegion(REGIONS[0]);
  document.getElementById("loader").classList.add("hide");
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  tick();
  populateDeferred().catch((err) => console.warn(err));
}

main().catch((err) => {
  console.error(err);
  document.getElementById("loader").querySelector("p").textContent = "Unable to load the gallery. Refresh to try again.";
});
