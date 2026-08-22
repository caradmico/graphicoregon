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
    body: "Graphic Oregon blends creative design, scientific research, geospatial mapping, and IT expertise. Art is west. Research is east. Writing is ahead. Credentials rise above. Website work sits south and lower.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  },
  {
    id: "art",
    name: "Fine Art",
    kind: "art",
    axis: "West · −X loft",
    pos: [-118, 30, 6],
    look: [-138, 28, -2],
    meta: "Oil · acrylic · ink · digital · charcoal",
    title: "Fine art and illustration",
    body: "A working studio practice — figures, portraits, still lifes, coast studies, and prints. Open to commissions.",
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
    body: "Sediment and habitat assessment for the North Fork Siuslaw watershed.",
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
    id: "journalism",
    name: "Journalism & Writing",
    kind: "write",
    axis: "North · +Z",
    pos: [6, 14, 148],
    look: [6, 11, 210],
    meta: "Writing · 2012–present",
    title: "Journalism and editing",
    body: "Assistant editor at the Tillamook County Pioneer, with live Cara Mico bylines in this hall. Earlier work: Seaside Signal (fifteen 2019 stories), Cannon Beach Gazette (puffin reprint), HipFish Monthly issue PDFs, and two Portland Mercury pieces. Freelance newspaper work since November 2012. Click a card to open the published story.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/",
    linkLabel: "Pioneer author archive"
  },
  {
    id: "credentials",
    name: "Qualifications",
    kind: "creds",
    axis: "Above · +Y",
    pos: [0, 56, -8],
    look: [0, 52, -28],
    meta: "Experience · education · training",
    title: "Qualifications and credentials",
    body: "Roles from Graphic Oregon’s Experience page, with education and the training list from the published CV. Certifications named here are the ones on that record — not a LinkedIn Learning inventory.",
    href: "https://graphicoregon.com/experience/",
    linkLabel: "Open the Experience page"
  },
  {
    id: "websites",
    name: "Website Design",
    kind: "web",
    axis: "South · −Z, lower",
    pos: [14, -10, -138],
    look: [14, -10, -158],
    meta: "Website design and management",
    title: "Website work",
    body: "HTML/CSS, responsive applications, and long-term site management. Named work from the Graphic Oregon studio: Tillamook County Pioneer, Color Outside the Lines, Pete Anderson Realty, Oceanside Cougar Ridge, Gold and Silver Market Update, Big Wave Cafe, Offshore Grill, Smiley Salmon, Manzanita Beach Company, Coast Broadcasting, Brag Props, and House.Me App. Screenshots from the studio gallery hang here.",
    href: "https://graphicoregon.com/",
    linkLabel: "Open graphicoregon.com"
  }
];

const NAV_GROUPS = [
  { label: "Arrival", ids: ["arrival"] },
  { label: "Art · west −X", ids: ["art"] },
  { label: "Research · east +X", ids: ["iau", "nano", "eval", "lane", "netarts", "nehalem", "tillamook-bay", "nestucca", "siuslaw", "tillamook-river", "necanicum", "nhmp"] },
  { label: "Writing · north +Z", ids: ["journalism"] },
  { label: "Credentials · above +Y", ids: ["credentials"] },
  { label: "Websites · south −Z", ids: ["websites"] }
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
  ["Biological Research Consultant", "Demeter Design / Graphic Oregon", "Since 2006", "Data collection, analysis, and project management for environmental research."]
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

const PIONEER_PIECES = [
  ["Author archive", "Cara Mico, assistant editor. The Pioneer author page mixes other writers — sample Cara bylines hang beside this card.", "https://www.tillamookcountypioneer.net/author/assistant-editor/"],
  ["A New View: Space", "By Cara Mico. Hubble, JWST, and whether colonization is realistic.", "https://www.tillamookcountypioneer.net/a-new-view-space/"],
  ["Space Just Got a Little Closer", "By Cara Mico. A Pioneer science piece on nearer space.", "https://www.tillamookcountypioneer.net/space-just-got-a-little-closer/"],
  ["The Return of Sea Otters to Haystack Rock", "By Cara Mico. Sea otters returning to Haystack Rock.", "https://www.tillamookcountypioneer.net/the-return-of-sea-otters-to-haystack-rock/"],
  ["Understanding AI Language Models", "By Cara Mico. An introductory guide to AI language models.", "https://www.tillamookcountypioneer.net/understanding-ai-language-models-an-introductory-guide/"],
  ["Climate Change on the Oregon Coast", "By Cara Mico. A three-part series on climate change on the Oregon coast.", "https://www.tillamookcountypioneer.net/climate-change-on-the-oregon-coast-3-part-series/"]
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
  ["Program seeks to protect puffin population", "Cannon Beach Gazette, March 16, 2019. The Gazette URL is 404; this is the sister reprint on the Seaside Signal, bylined Cara Mico / For Cannon Beach Gazette.", "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/"]
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
let scene, camera, renderer;
let lookYaw = 0;
let lookPitch = -0.12;
let dragging = false;
let lastX = 0;
let lastY = 0;
let keys = {};
let scrollBoost = 0;
let flight = null;
const clock = new THREE.Clock();
const cam = {
  pos: new THREE.Vector3(0, 12, 32),
  vel: new THREE.Vector3()
};
const bounds = { x: [-220, 250], y: [-40, 88], z: [-210, 280] };

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
    pos[i * 3] = (Math.random() - 0.5) * 1400;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 700;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 1400;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xcfe8e4, size: 0.6, sizeAttenuation: true, transparent: true, opacity: 0.82
  })));
}

function addWorldGuides() {
  const grid = new THREE.GridHelper(420, 42, 0x1a6f6a, 0x143238);
  grid.position.y = -24;
  scene.add(grid);

  const marks = [
    ["SKY", 0, 78, 0, 22, 4],
    ["GROUND", 0, -30, 0, 18, 3.2],
    ["ART  ·  WEST  −X", -200, 34, 0, 28, 3.4],
    ["RESEARCH  ·  EAST  +X", 248, 16, 0, 32, 3.4],
    ["WRITING  ·  NORTH  +Z", 0, 22, 268, 28, 3.4],
    ["WEBSITES  ·  SOUTH  −Z", 0, -4, -208, 28, 3.4],
    ["CREDENTIALS  ·  ABOVE  +Y", 0, 78, -36, 26, 3.2]
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
    [-118, 28, 6],
    [140, 4, 0],
    [6, 12, 148],
    [0, 52, -8],
    [14, -10, -138]
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
  intro.position.set(ox - 12, oy + 2, oz + 14);
  placeClickCard(intro, "journalism", {
    title: "Tillamook County Pioneer",
    body: "Assistant editor since June 2022. Live Cara bylines only — the Pioneer author page also lists other writers.",
    href: "https://www.tillamookcountypioneer.net/author/assistant-editor/",
    linkLabel: "Pioneer author archive",
    links: PIONEER_PIECES.map(([t, , u]) => [t, u])
  });

  PIONEER_PIECES.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this Pioneer piece");
    const col = i % 3;
    const row = Math.floor(i / 3);
    mesh.position.set(ox - 14 + col * 11, oy + 3 - row * 6.4, oz + 28);
    placeClickCard(mesh, "journalism", extra);
  });

  const seasideIntro = makeCard(
    "Seaside Signal — 2019",
    "Fifteen live bylines from the 2019 Signal list. Each card opens the published story."
  );
  seasideIntro.position.set(ox, oy + 8, oz + 52);
  placeClickCard(seasideIntro, "journalism", {
    title: "Seaside Signal, 2019",
    body: "Fifteen verified live stories. Click a card or use the links in this panel.",
    links: SEASIDE_PIECES.map(([t, , u]) => [t, u])
  });

  SEASIDE_PIECES.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this Signal story");
    const col = i % 5;
    const row = Math.floor(i / 5);
    mesh.position.set(ox - 22 + col * 11, oy + 3 - row * 6.6, oz + 66);
    placeClickCard(mesh, "journalism", extra);
  });

  const gazette = makeCard(
    "Cannon Beach Gazette — puffins",
    "Program seeks to protect puffin population, March 16, 2019. Labeled Cannon Beach Gazette. The Gazette page is 404; this opens the Seaside Signal sister reprint, bylined Cara Mico / For Cannon Beach Gazette."
  );
  gazette.position.set(ox, oy + 2, oz + 92);
  placeClickCard(gazette, "journalism", {
    title: "Cannon Beach Gazette: puffin population",
    body: "March 16, 2019. Gazette URL is 404. Sister reprint on the Seaside Signal, bylined Cara Mico / For Cannon Beach Gazette.",
    href: "https://seasidesignal.com/2019/03/16/program-seeks-to-protect-puffin-population/",
    linkLabel: "Open the Gazette puffin reprint"
  });

  HIPFISH.forEach((piece, i) => {
    const { mesh, extra } = hallCard(piece, "Open this HipFish issue PDF");
    mesh.position.set(ox - 16 + (i % 2) * 16, oy + 2 - Math.floor(i / 2) * 6.4, oz + 110);
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
  freelance.position.set(ox, oy - 4, oz + 142);
  placeClickCard(freelance, "journalism", {
    title: "Freelance journalist, Nov 2012–present",
    body: "Arts, environment, and emergency preparedness. Assistant editor at the Tillamook County Pioneer. Other papers named here are from the published CV only."
  });
}

function populateCredentials() {
  const origin = REGIONS.find((r) => r.id === "credentials").pos;
  const ox = origin[0], oy = origin[1], oz = origin[2];

  JOBS.forEach((job, i) => {
    const m = makeJobCard(job[0], job[1], job[2], job[3]);
    const ang = (i / JOBS.length) * Math.PI * 2;
    const r = 22;
    m.position.set(ox + Math.cos(ang) * r, oy + ((i % 3) - 1) * 5.4, oz - 16 + Math.sin(ang) * r * 0.55);
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
    m.position.set(ox - 16 + i * 11, oy + 10, oz - 6);
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
    plaque.position.set(ox - 10 + col * 12, oy - 12 - row * 2.1, oz - 4);
    placeClickCard(plaque, "credentials", {
      title: c[0],
      body: c[1] + ". From the published CV training list — not a LinkedIn Learning catalog."
    });
  });

  AWARDS.forEach((a, i) => {
    const plaque = makeLabel(a[0] + " — " + a[1], {
      w: 1400, h: 200, pw: 9.4, ph: 1.35, font: "500 40px Georgia, serif"
    });
    plaque.position.set(ox - 16 + i * 11, oy + 14.5, oz - 2);
    placeClickCard(plaque, "credentials", {
      title: a[0],
      body: a[1]
    });
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
    const plane = imagePlane(tex, 5.1);
    const cols = 6;
    const col = i % cols;
    const row = Math.floor(i / cols);
    plane.position.set(artOrigin[0] - 22 + col * 8.2, artOrigin[1] + 8 - row * 7.4, artOrigin[2] - 16 - (row % 2) * 4);
    plane.userData.regionId = "art";
    plane.userData.title = ARTWORKS[i][1];
    scene.add(plane);
    clickables.push(plane);
    const cap = makeLabel(ARTWORKS[i][1], { w: 900, h: 160, pw: 4.6, ph: 0.8, font: "500 42px Georgia, serif" });
    cap.position.copy(plane.position);
    cap.position.y -= 3.0;
    scene.add(cap);
  });

  const webOrigin = REGIONS.find((r) => r.id === "websites").pos;
  const webTex = await Promise.all(WEBSHOTS.map((u) => loadTexture(u)));
  webTex.forEach((tex, i) => {
    const plane = imagePlane(tex, 7.2);
    const col = i % 3;
    const row = Math.floor(i / 3);
    plane.position.set(webOrigin[0] - 14 + col * 11, webOrigin[1] + 4 - row * 6.4, webOrigin[2] - 14);
    plane.userData.regionId = "websites";
    plane.userData.title = "Website gallery";
    scene.add(plane);
    clickables.push(plane);
  });
  WEB_NAMES.forEach((name, i) => {
    const plaque = makeLabel(name, { w: 900, h: 180, pw: 6.4, ph: 1.15, font: "500 44px Georgia, serif", stroke: "rgba(42,168,160,0.75)" });
    const col = i % 3;
    const row = Math.floor(i / 3);
    plaque.position.set(webOrigin[0] - 14 + col * 11, webOrigin[1] - 8 - row * 1.7, webOrigin[2] - 4);
    plaque.userData.regionId = "websites";
    scene.add(plaque);
    clickables.push(plaque);
  });

  populateJournalism();
  populateCredentials();

  const arrival = makeLabel("Art west  ·  Research east  ·  Writing north  ·  Credentials above", {
    w: 1800, h: 220, pw: 22, ph: 2.4, font: "500 48px Georgia, serif"
  });
  arrival.position.set(0, 2.4, 4);
  scene.add(arrival);
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
    keys[e.key.toLowerCase()] = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "q", "e"].includes(e.key.toLowerCase()) || e.key === " ") {
      if (["ArrowUp", "ArrowDown", " ", "q", "e", "Q", "E"].includes(e.key)) e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);

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
  scene.fog = new THREE.FogExp2(0x0a1216, 0.0024);
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1600);
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
  const east = new THREE.PointLight(0x2aa8a0, 14, 220);
  east.position.set(150, 8, 10);
  scene.add(east);

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
