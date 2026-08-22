/* Graphic Oregon — wanderable 3D portfolio */

const ink = 0x0a1014;
const teal = 0x2aa8a0;
const gold = 0xd4b05a;

const REGIONS = [
  {
    id: "arrival",
    name: "Arrival",
    kind: "intro",
    axis: "Origin · 0, 0, 0",
    pos: [0, 12, 32],
    look: [0, 8, 0],
    meta: "Graphic Oregon",
    title: "Technical design solutions",
    body: "A small craft marks your place. Art is west. Research is east. Writing is ahead. Credentials rise above. Website work sits south and lower.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  },
  {
    id: "art",
    name: "Fine Art",
    kind: "art",
    axis: "West · −X loft",
    pos: [-128, 30, 8],
    look: [-150, 28, -4],
    meta: "Oil · acrylic · ink · digital · charcoal",
    title: "Fine art and illustration",
    body: "A working studio practice — figures, portraits, still lifes, coast studies, and prints. Open to commissions. Moon-phase studies hang further west; extra still lifes sit in the south wing.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "moons",
    name: "Moon Phases",
    kind: "art",
    axis: "West · −X, further loft",
    pos: [-198, 38, -72],
    look: [-214, 36, -88],
    meta: "Fine art · 2025 studio set",
    title: "Moon-phase set",
    body: "Eight public moon-phase studies from the Graphic Oregon studio library (June and July 2025 uploads): new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, last quarter, waning crescent.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
  },
  {
    id: "studies",
    name: "Studio Studies",
    kind: "art",
    axis: "West · −X, south wing",
    pos: [-168, 18, 78],
    look: [-184, 16, 62],
    meta: "Still life · portrait · unfinished",
    title: "Further studio studies",
    body: "Additional public works from the Fine Art page: extra still lifes, another oil portrait, and an unfinished study. Titles follow the studio filenames.",
    href: "https://graphicoregon.com/sample-page/",
    linkLabel: "Open the studio page"
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
    kind: "research",
    axis: "East · +X",
    pos: [138, 12, 42],
    look: [152, 10, 28],
    meta: "Research · 2024",
    title: "Open-Source Nanoactuator Design",
    body: "A cost-effective nanoactuator built from hard-disk-drive mechanics, measured with a Michelson interferometer. Off-the-shelf parts and a low-cost optical table are used to open nanometer-scale positioning to more labs.",
    href: "https://graphicoregon.com/open-source-nanoactuator-design-utilizing-hard-disk-drive-components-precision-displacement-measurement-with-a-michelson-interferometer/",
    linkLabel: "Open the nanoactuator paper"
  },
  {
    id: "eval",
    name: "Program Evaluation",
    kind: "research",
    axis: "East · +X",
    pos: [168, 9, 8],
    look: [184, 8, -6],
    meta: "Research · inclusive arts",
    title: "Program Evaluation Methods",
    body: "Evaluation methods for inclusive art programs — a practical guide for measuring participation, equity, and outcomes.",
    href: "https://graphicoregon.com/program-evaluation-methods/",
    linkLabel: "Open the evaluation guide"
  },
  {
    id: "lane",
    name: "Lane Arts Asset Map",
    kind: "research",
    axis: "East · +X",
    pos: [128, 14, -62],
    look: [142, 12, -78],
    meta: "Research · Lane Arts Council",
    title: "Lane Arts Council Arts Asset Map User Guide",
    body: "A user guide to the Lane Arts Council arts asset map, written while coordinating arts equity research in Lane County.",
    href: "https://graphicoregon.com/lane-arts-council-arts-asset-map-user-guide/",
    linkLabel: "Open the asset map guide"
  },
  {
    id: "netarts",
    name: "Netarts Bay Watershed",
    kind: "exploded",
    axis: "East · +X, ground −Y",
    pos: [108, -8, 22],
    look: [108, -10, 2],
    meta: "Research · Demeter Design, 2008",
    title: "Netarts Bay Watershed Habitat Assessment",
    body: "Prepared for the Tillamook Estuaries Partnership. A ~17,000-acre North Coast watershed and ~2,000-acre saline estuary. Poorly sorted spawning gravels are the primary limiter for Chum; summer rearing is an equal limiter for Coho. Maps and findings hang in this region — not an embedded report.",
    href: "https://graphicoregon.com/netarts-bay-watershed-habitat-assessment/",
    linkLabel: "Open the Netarts assessment"
  },
  {
    id: "nehalem",
    name: "East Fork Nehalem",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [158, -14, -22],
    look: [172, -14, -36],
    meta: "Research · habitat assessment",
    title: "East Fork Nehalem Watershed Assessment",
    body: "Watershed assessment for the East Fork Nehalem — habitat, sediment, and restoration context on Oregon’s North Coast.",
    href: "https://graphicoregon.com/east-fork-nehalem-watershed-assessment/",
    linkLabel: "Open the Nehalem assessment"
  },
  {
    id: "tillamook-bay",
    name: "Tillamook Bay Restoration",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [186, -12, 32],
    look: [200, -12, 18],
    meta: "Research · restoration plan",
    title: "Tillamook Bay Watershed Habitat Restoration Plan",
    body: "Habitat restoration planning for the Tillamook Bay watershed, including computational ecological restoration priorities.",
    href: "https://graphicoregon.com/tillamook-bay-watershed-habitat-restoration-plan/",
    linkLabel: "Open the restoration plan"
  },
  {
    id: "nestucca",
    name: "Upper Nestucca",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [148, -16, 68],
    look: [162, -16, 54],
    meta: "Research · sediment and habitat",
    title: "Upper Nestucca Sediment and Habitat Study",
    body: "Sediment and habitat study for the Upper Nestucca, part of a coastal assessment series for land managers and restoration partners.",
    href: "https://graphicoregon.com/upper-nestucca-sediment-and-habitat-study/",
    linkLabel: "Open the Nestucca study"
  },
  {
    id: "siuslaw",
    name: "North Fork Siuslaw",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [202, -14, -6],
    look: [216, -14, -20],
    meta: "Research · sediment and habitat",
    title: "North Fork Siuslaw Sediment and Habitat Assessment",
    body: "Sediment and habitat assessment for the North Fork Siuslaw watershed. MidCoast Watershed Council, 2009. Distinct from the 2009 headwater and road-condition assessment further out.",
    href: "https://graphicoregon.com/north-fork-siuslaw-sediment-and-habitat-assessment/",
    linkLabel: "Open the Siuslaw assessment"
  },
  {
    id: "tillamook-river",
    name: "Tillamook River",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [172, -18, -52],
    look: [186, -18, -66],
    meta: "Research · limiting factors",
    title: "Tillamook River Limiting Factors Assessment",
    body: "Limiting-factors assessment for salmonid habitat in the Tillamook River basin.",
    href: "https://graphicoregon.com/tillamook-river-limiting-factors-assessment/",
    linkLabel: "Open the Tillamook River assessment"
  },
  {
    id: "necanicum",
    name: "Necanicum Habitat Mapping",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [196, -10, 72],
    look: [210, -10, 58],
    meta: "Research · habitat mapping",
    title: "Necanicum Habitat Mapping",
    body: "Habitat mapping for the Necanicum watershed, published as a map package for restoration and land-use work.",
    href: "https://graphicoregon.com/necanicum-habitat-mapping/",
    linkLabel: "Open the Necanicum maps"
  },
  {
    id: "nhmp",
    name: "Hazard Mitigation Plan",
    kind: "research",
    axis: "East · +X, ground −Y",
    pos: [142, -6, -92],
    look: [156, -6, -106],
    meta: "Research · Tillamook County",
    title: "Tillamook County Natural Hazard Mitigation Plan",
    body: "Natural hazard mitigation planning for Tillamook County — mapping risk so communities can prepare.",
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
    pos: [6, 14, 160],
    look: [6, 11, 222],
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
    pos: [10, 12, 308],
    look: [10, 10, 328],
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
    body: "Recology Artist Residency, Astoria Visual Arts Alliance, 2018. Arts Research Travel Grant, University of Oregon, 2017. Studio Art Scholarship, Otis College of Art and Design, 2002. Studio Art Scholarship, Pratt, 2002 (declined).",
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
    body: "HTML/CSS, responsive applications, and long-term site management. Named work from the Graphic Oregon studio list. Screenshots from the studio gallery hang here. Named contract domains sit further south.",
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
  { label: "Art · west −X", ids: ["art", "moons", "studies"] },
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

const MOON_ART = [
  ["assets/art/new-moon.jpg", "New moon"],
  ["assets/art/waxing-crescent.jpg", "Waxing crescent"],
  ["assets/art/first-quarter-moon.jpg", "First quarter"],
  ["assets/art/waxing-gibbous.jpg", "Waxing gibbous"],
  ["assets/art/full-moon.jpg", "Full moon"],
  ["assets/art/waning-gibbous.jpg", "Waning gibbous"],
  ["assets/art/last-quarter.jpg", "Last quarter"],
  ["assets/art/waning-crescent.jpg", "Waning crescent"]
];

const STUDY_ART = [
  ["assets/art/female-portrait-oil-4.jpg", "Portrait, oil"],
  ["assets/art/still-life-pencil.jpg", "Still life, pencil"],
  ["assets/art/still-life-charcoal-3.jpg", "Still life, charcoal"],
  ["assets/art/still-life-charcoal-4.jpg", "Still life, charcoal"],
  ["assets/art/still-life-1.jpg", "Still life"],
  ["assets/art/unfinished.jpg", "Unfinished"]
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
  ["Studio Art Scholarship", "Otis College of Art and Design, 2002"],
  ["Studio Art Scholarship", "Pratt, 2002 (declined)"]
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
  ["Author archive", "Cara Mico, assistant editor. The Pioneer author page mixes other writers — sample Cara bylines hang beside this card.", "https://www.tillamookcountypioneer.net/author/assistant-editor/"],
  ["A New View: Space", "By Cara Mico. Hubble, JWST, and whether colonization is realistic.", "https://www.tillamookcountypioneer.net/a-new-view-space/"],
  ["Space Just Got a Little Closer", "By Cara Mico, Assistant Editor. A Pioneer science piece on nearer space.", "https://www.tillamookcountypioneer.net/space-just-got-a-little-closer/"],
  ["The Return of Sea Otters to Haystack Rock", "By Cara Mico. Sea otters returning to Haystack Rock.", "https://www.tillamookcountypioneer.net/the-return-of-sea-otters-to-haystack-rock/"],
  ["Understanding AI Language Models", "By Cara Mico. An introductory guide to AI language models.", "https://www.tillamookcountypioneer.net/understanding-ai-language-models-an-introductory-guide/"],
  ["Climate Change on the Oregon Coast", "By Cara Mico. A three-part series on climate change on the Oregon coast.", "https://www.tillamookcountypioneer.net/climate-change-on-the-oregon-coast-3-part-series/"],
  ["Near Space Corporation in Tillamook", "By Cara Mico, Assistant Editor. Near Space Corporation test flights out of Tillamook.", "https://www.tillamookcountypioneer.net/near-space-corporation-in-tillamook-bringing-humans-closer-to-the-void/"],
  ["On the Future of Artificial Intelligence", "By Cara Mico, Assistant Editor. How AI can help humanity.", "https://www.tillamookcountypioneer.net/on-the-future-of-artificial-intelligence-and-how-it-can-help-humanity/"],
  ["Spy vs. Spy — Balloon War", "By Cara Mico, Assistant Editor. Balloon incidents and sky news.", "https://www.tillamookcountypioneer.net/spy-vs-spy-balloon-war/"],
  ["The Data of Immigration", "By Cara Mico, Assistant Editor. A data look at immigration.", "https://www.tillamookcountypioneer.net/the-data-of-immigration/"],
  ["Homelessness in Tillamook County and on the West Coast", "By Cara Mico, Assistant Editor. How Tillamook County diverges from larger West Coast cities.", "https://www.tillamookcountypioneer.net/homelessness-in-tillamook-county-and-on-the-west-coast/"],
  ["A Hidden Gem: The Minor Peak of Saddle Mountain", "Posted by Cara Mico, Assistant Editor. The minor peak of Saddle Mountain in Oregon’s coastal range.", "https://www.tillamookcountypioneer.net/a-hidden-gem-the-minor-peak-of-saddle-mountain/"]
];

const SEASIDE_PIECES = [
  ["Hum and Swish", "Seaside Signal, September 21, 2019", "https://seasidesignal.com/2019/09/21/hum-and-swish/"],
  ["Cleaning up on the diamond", "Seaside Signal, September 18, 2019", "https://seasidesignal.com/2019/09/18/cleaning-up-on-the-diamond/"],
  ["Preparedness forum invites community involvement", "Seaside Signal, September 10, 2019", "https://seasidesignal.com/2019/09/10/preparedness-forum-invites-community-involvement/"],
  ["Pickleball headed to Gearhart", "Seaside Signal, August 27, 2019", "https://seasidesignal.com/2019/08/27/pickleball-headed-to-gearhart/"],
  ["Jeepers creepers, birding event at Circle Creek", "Seaside Signal, August 13, 2019", "https://seasidesignal.com/2019/08/13/jeepers-creepers-birding-event-at-circle-creek/"],
  ["Social justice motivates artist May Wallace", "Seaside Signal, August 2, 2019", "https://seasidesignal.com/2019/08/02/social-justice-motivates-artist-may-wallace/"],
  ["NCLC volunteers go deep into the weeds", "Seaside Signal, August 1, 2019", "https://seasidesignal.com/2019/08/01/nclc-volunteers-go-deep-into-the-weeds/"],
  ["Fresh picked! Farmers Market in Seaside", "Seaside Signal, July 25, 2019", "https://seasidesignal.com/2019/07/25/fresh-picked-farmers-market-in-seaside/"],
  ["Making ‘scents’ at Beach Books", "Seaside Signal, July 9, 2019", "https://seasidesignal.com/2019/07/09/making-scents-at-beach-books/"],
  ["Hypertufa workshop promotes local species", "Seaside Signal, July 1, 2019", "https://seasidesignal.com/2019/07/01/hypertufa-workshop-promotes-local-species/"],
  ["Ode to the Tides", "Seaside Signal, June 19, 2019", "https://seasidesignal.com/2019/06/19/ode-to-the-tides/"],
  ["The food all around us", "Seaside Signal, May 29, 2019", "https://seasidesignal.com/2019/05/29/the-food-all-around-us/"],
  ["‘Preserving pollinators’ on the North Coast", "Seaside Signal, May 29, 2019", "https://seasidesignal.com/2019/05/29/preserving-pollinators-on-the-north-coast/"],
  ["Firehouse committee zeroes in on High Point site", "Seaside Signal, May 22, 2019", "https://seasidesignal.com/2019/05/22/firehouse-committee-zeroes-in-on-high-point-site/"],
  ["Sparking change, one piece of plastic at a time", "Seaside Signal, May 21, 2019", "https://seasidesignal.com/2019/05/21/sparking-change-one-piece-of-plastic-at-a-time/"]
];

const GAZETTE_PIECES = [
  ["Program seeks to protect puffin population", "Cannon Beach Gazette, March 16, 2019. Gazette URL is 404. Sister reprint on the Seaside Signal, bylined Cara Mico / For Cannon Beach Gazette.", "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/"],
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
  ["When Albums Were Art", "HipFish Monthly, July 2016 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2016/07/716.pdf"],
  ["Of Dust and the River: Tim Hurd", "HipFish Monthly, October 2016 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2016/10/1016.pdf"],
  ["The New NCRD Theater", "HipFish Monthly, January 2017 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2017/01/117.pdf"],
  ["Riverbend Players / Cole Porter", "HipFish Monthly, May 2017 issue PDF.", "https://www.hipfishmonthly.com/wp-content/uploads/2017/05/517.pdf"]
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
const cam = {
  pos: new THREE.Vector3(0, 12, 32),
  vel: new THREE.Vector3()
};
const bounds = { x: [-280, 380], y: [-52, 120], z: [-280, 400] };

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
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  return new THREE.Mesh(new THREE.PlaneGeometry(opts.pw || 8, opts.ph || 2), mat);
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
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
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
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
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
    ["ART  ·  WEST  −X", -250, 36, 0, 28, 3.4],
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
    [-128, 30, 8],
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
  const geo = new THREE.SphereGeometry(0.42, 24, 24);
  const mat = new THREE.MeshBasicMaterial({ color: region.kind === "exploded" ? gold : teal });
  const orb = new THREE.Mesh(geo, mat);
  orb.position.set(...region.pos);
  orb.userData.regionId = region.id;
  scene.add(orb);
  clickables.push(orb);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.2, 1.38, 48),
    new THREE.MeshBasicMaterial({ color: gold, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(region.pos[0], region.pos[1] - 1.8, region.pos[2]);
  scene.add(ring);
  const title = makeLabel(region.name, { pw: 8.4, ph: 1.7, font: "600 56px Georgia, serif" });
  title.position.set(region.pos[0], region.pos[1] + 2.4, region.pos[2]);
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
  scene.add(plane);
  clickables.push(plane);
  const cap = makeLabel(title, { w: 900, h: 160, pw: 4.6, ph: 0.8, font: "500 42px Georgia, serif" });
  cap.position.copy(plane.position);
  cap.position.y -= 3.0;
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

function placeClickCard(mesh, regionId, extra) {
  mesh.userData.regionId = regionId;
  Object.assign(mesh.userData, extra || {});
  scene.add(mesh);
  clickables.push(mesh);
}

function hallCard(piece, hrefLabel) {
  const m = makeCard(piece[0], piece[1]);
  return { mesh: m, extra: {
    title: piece[0],
    body: piece[1],
    href: piece[2],
    linkLabel: hrefLabel
  } };
}

function populateJournalism() {
  const origin = REGIONS.find((r) => r.id === "journalism").pos;
  const ox = origin[0], oy = origin[1], oz = origin[2];

  const intro = makeCard(
    "Tillamook County Pioneer",
    "Assistant editor, 2022–present. The author archive mixes other writers. Sample Cara Mico bylines are the cards in this hall — click any card for the live piece."
  );
  intro.position.set(ox - 14, oy + 2, oz + 16);
  placeClickCard(intro, "journalism", {
    title: "Tillamook County Pioneer",
    body: "Assistant editor since June 2022. Live Cara bylines only — the Pioneer author page also lists other writers.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/",
    linkLabel: "Pioneer author archive",
    links: PIONEER_PIECES.map(([t, , u]) => [t, u])
  });

  PIONEER_PIECES.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this Pioneer piece");
    const col = i % 4;
    const row = Math.floor(i / 4);
    mesh.position.set(ox - 18 + col * 12, oy + 3 - row * 6.8, oz + 32);
    placeClickCard(mesh, "journalism", extra);
  });

  const seasideIntro = makeCard(
    "Seaside Signal — 2019",
    "Fifteen live bylines from the 2019 Signal list. Each card opens the published story."
  );
  seasideIntro.position.set(ox, oy + 8, oz + 62);
  placeClickCard(seasideIntro, "journalism", {
    title: "Seaside Signal, 2019",
    body: "Fifteen verified live stories. Click a card or use the links in this panel.",
    links: SEASIDE_PIECES.map(([t, , u]) => [t, u])
  });

  SEASIDE_PIECES.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this Signal story");
    const col = i % 5;
    const row = Math.floor(i / 5);
    mesh.position.set(ox - 24 + col * 12, oy + 3 - row * 6.8, oz + 78);
    placeClickCard(mesh, "journalism", extra);
  });

  HIPFISH.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this HipFish issue PDF");
    mesh.position.set(ox - 16 + (i % 2) * 16, oy + 2 - Math.floor(i / 2) * 6.4, oz + 108);
    placeClickCard(mesh, "journalism", extra);
  });

  MERCURY.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this Mercury story");
    mesh.position.set(ox - 10 + i * 16, oy + 2, oz + 128);
    placeClickCard(mesh, "journalism", extra);
  });

  const freelance = makeCard(
    "Freelance newspapers, since 2012",
    "From the Experience page: arts, environment, and emergency preparedness since November 2012. Papers in this room are the CV set — Pioneer, Seaside Signal, Cannon Beach Gazette, HipFish Monthly, and the Portland Mercury."
  );
  freelance.position.set(ox, oy - 4, oz + 144);
  placeClickCard(freelance, "journalism", {
    title: "Freelance journalist, Nov 2012–present",
    body: "Arts, environment, and emergency preparedness. Assistant editor at the Tillamook County Pioneer. Other papers named here are from the published CV only."
  });
}

function populateGazette() {
  const origin = REGIONS.find((r) => r.id === "gazette").pos;
  const ox = origin[0], oy = origin[1], oz = origin[2];
  GAZETTE_PIECES.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, piece[2] ? "Open the Gazette puffin reprint" : "");
    const col = i % 5;
    const row = Math.floor(i / 5);
    mesh.position.set(ox - 24 + col * 12, oy + 4 - row * 6.8, oz + 14);
    placeClickCard(mesh, "gazette", extra);
  });
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

async function populate() {
  REGIONS.forEach(addBeacon);
  addWorldGuides();
  constellation([98, 20, -50]);

  const netarts = REGIONS.find((r) => r.id === "netarts");
  const [nx, ny, nz] = netarts.pos;
  NETARTS_CARDS.forEach((card, i) => {
    const m = makeCard(card[0], card[1]);
    const col = i % 3;
    const row = Math.floor(i / 3);
    m.position.set(nx - 12 + col * 9.5, ny + 2 - row * 6, nz - 10);
    placeClickCard(m, "netarts");
  });

  const mapTex = await Promise.all(MAPS.map(([u]) => loadTexture(u)));
  mapTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 6.8);
    const a = (i / MAPS.length) * Math.PI * 2;
    const r = 20;
    plane.position.set(nx + Math.cos(a) * r, ny - 4 + Math.sin(i) * 2.4, nz - 18 + Math.sin(a) * r * 0.6);
    plane.lookAt(nx, ny, nz - 6);
    plane.userData.regionId = "netarts";
    plane.userData.title = MAPS[i][1];
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(MAPS[i][1], { w: 900, h: 160, pw: 5.2, ph: 0.9, font: "500 40px Georgia, serif" });
    cap.position.copy(plane.position);
    cap.position.y -= 3.8;
    cap.lookAt(nx, ny, nz - 6);
    scene.add(cap);
  });

  const artOrigin = REGIONS.find((r) => r.id === "art").pos;
  const artTex = await Promise.all(ARTWORKS.map(([u]) => loadTexture(u)));
  artTex.forEach((tex, i) => {
    const cols = 5;
    const col = i % cols;
    const row = Math.floor(i / cols);
    hangArt(tex, ARTWORKS[i][1], "art", [
      artOrigin[0] - 24 + col * 10.4,
      artOrigin[1] + 10 - row * 8.6,
      artOrigin[2] - 18 - (row % 2) * 5
    ]);
  });

  const moonOrigin = REGIONS.find((r) => r.id === "moons").pos;
  const moonTex = await Promise.all(MOON_ART.map(([u]) => loadTexture(u)));
  moonTex.forEach((tex, i) => {
    const ang = (i / MOON_ART.length) * Math.PI * 2;
    hangArt(tex, MOON_ART[i][1], "moons", [
      moonOrigin[0] + Math.cos(ang) * 16,
      moonOrigin[1] + Math.sin(i) * 1.6,
      moonOrigin[2] - 8 + Math.sin(ang) * 16
    ]);
  });

  const studyOrigin = REGIONS.find((r) => r.id === "studies").pos;
  const studyTex = await Promise.all(STUDY_ART.map(([u]) => loadTexture(u)));
  studyTex.forEach((tex, i) => {
    hangArt(tex, STUDY_ART[i][1], "studies", [
      studyOrigin[0] - 16 + (i % 3) * 12,
      studyOrigin[1] + 4 - Math.floor(i / 3) * 8.2,
      studyOrigin[2] - 12
    ]);
  });

  const webOrigin = REGIONS.find((r) => r.id === "websites").pos;
  const webTex = await Promise.all(WEBSHOTS.map((u) => loadTexture(u)));
  webTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 7.2);
    const col = i % 3;
    const row = Math.floor(i / 3);
    plane.position.set(webOrigin[0] - 16 + col * 13, webOrigin[1] + 5 - row * 7.2, webOrigin[2] - 16);
    plane.userData.regionId = "websites";
    plane.userData.title = "Website gallery";
    scene.add(plane);
    clickables.push(plane);
  });
  WEB_NAMES.forEach((name, i) => {
    const plaque = makeLabel(name, { w: 900, h: 180, pw: 6.4, ph: 1.15, font: "500 44px Georgia, serif", stroke: "rgba(42,168,160,0.75)" });
    const col = i % 3;
    const row = Math.floor(i / 3);
    plaque.position.set(webOrigin[0] - 16 + col * 13, webOrigin[1] - 10 - row * 2.0, webOrigin[2] - 4);
    plaque.userData.regionId = "websites";
    scene.add(plaque);
    clickables.push(plaque);
  });

  populateJournalism();
  populateGazette();
  populateCredentials();
  populateAwards();
  populateIloa();
  populateService();
  populateTalks();
  populateAiTutor();
  populateContracts();

  ["willamette-culvert", "willamette-plan", "hells-canyon", "oweb", "john-day", "santiam", "siuslaw-headwater", "big-elk"].forEach(populateResearchCard);

  const arrival = makeLabel("Art west  ·  Research east  ·  Writing north  ·  Credentials above", {
    w: 1800, h: 220, pw: 22, ph: 2.4, font: "500 48px Georgia, serif"
  });
  arrival.position.set(0, 2.4, 4);
  scene.add(arrival);

  ship = makeShip();
  scene.add(ship);
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
  const toPos = new THREE.Vector3(...region.pos);
  const toLook = new THREE.Vector3(...region.look);
  const aim = yawPitchFromPoints(toPos, toLook);
  const dist = cam.pos.distanceTo(toPos);
  flight = {
    fromPos: cam.pos.clone(),
    toPos,
    fromYaw: lookYaw,
    fromPitch: lookPitch,
    toYaw: aim.yaw,
    toPitch: aim.pitch,
    t: 0,
    dur: THREE.MathUtils.clamp(1.15 + dist / 68, 1.7, 5.2)
  };
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
  const region = REGIONS.find((r) => r.id === obj.userData.regionId);
  if (!region) return;
  flyTo(region, {
    title: obj.userData.title,
    body: obj.userData.body,
    href: obj.userData.href,
    linkLabel: obj.userData.linkLabel,
    links: obj.userData.links
  });
}

function bindInput() {
  const el = renderer.domElement;
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (flight) flight = null;
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;
    if (e.deltaMode === 2) dy *= 400;
    dy = THREE.MathUtils.clamp(dy, -18, 18);
    scrollBoost += -dy * 0.0035;
    scrollBoost = THREE.MathUtils.clamp(scrollBoost, -2.2, 2.2);
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
    if (flight.t >= flight.dur) flight = null;
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
      cam.vel.addScaledVector(dir, scrollBoost * dt * 5);
      scrollBoost *= Math.exp(-dt * 6.4);
      if (Math.abs(scrollBoost) < 0.012) scrollBoost = 0;
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
    if (obj.userData && obj.userData.billboard) obj.lookAt(camera.position);
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
  scene.fog = new THREE.FogExp2(0x0a1216, 0.0018);
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
  camera.position.copy(cam.pos);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene.add(new THREE.AmbientLight(0x6f8a88, 0.95));
  const key = new THREE.PointLight(0x2aa8a0, 22, 140);
  key.position.set(8, 22, 16);
  scene.add(key);
  const rim = new THREE.PointLight(0xd4b05a, 16, 180);
  rim.position.set(-40, 28, -20);
  scene.add(rim);
  const east = new THREE.PointLight(0x2aa8a0, 14, 260);
  east.position.set(220, 8, 10);
  scene.add(east);
  const far = new THREE.PointLight(0xd4b05a, 10, 220);
  far.position.set(-180, 24, -40);
  scene.add(far);

  addStars();
  setupNav();
  await populate();
  bindInput();
  const start = yawPitchFromPoints(cam.pos, new THREE.Vector3(0, 8, 0));
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
}

main().catch((err) => {
  console.error(err);
  document.getElementById("loader").querySelector("p").textContent = "Unable to load the gallery. Refresh to try again.";
});
