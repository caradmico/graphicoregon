const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "home.css"), "utf8");
const face = html + css;

assert.ok(html.includes('href="home.css"'), "lander loads home.css");
assert.ok(!/src=["'][^"']*(three(\.min)?\.js|figures\.js|roster\.js|faces\.js|look\.js|field-nav\.js)/i.test(html), "home does not load the field");
assert.ok(!/href=["']chrome\.css["']/.test(html), "home does not load field chrome");
assert.ok(!/<canvas/i.test(html), "home is not a Three canvas");
assert.ok(!/<video/i.test(html), "no video embeds");

assert.ok(/website design &amp; systems/i.test(html), "header names the offer");
assert.ok(html.includes('href="#contact"'), "header contact jumps to contact");
assert.ok(html.includes("Business is hard. Websites shouldn’t be."), "tagline hero");
assert.ok(!/Email Cara|\bCara\b/.test(html.replace(/caradmico@gmail\.com/g, "")), "no personal name on the door");

assert.ok(/<h3>Branding<\/h3>/.test(html), "Branding is a header over an ethos box");
assert.ok(/<h3>Market research<\/h3>/.test(html), "Market research is a header over an ethos box");
assert.ok(/<h3>Timeless collateral<\/h3>/.test(html), "Timeless collateral is a header over an ethos box");
assert.ok(html.includes("class=\"ethos-box\""), "skills sit in ethos text boxes");
assert.ok(!/class="ladder"|class="skills"|class="chips"|class="step"/.test(html), "no empty ladder or chip chrome");

const ethosIdx = html.indexOf('class="ethos"');
const workIdx = html.indexOf('id="work-title"');
assert.ok(ethosIdx > -1 && ethosIdx < workIdx, "ethos sits before selected work");

assert.ok(!/href=["']creek\/["']/.test(html), "do not sell creek on the stand-in");
assert.ok(!/Hair and river|3D explore/i.test(html), "creek is not finished-craft copy");
assert.ok(fs.existsSync(path.join(root, "creek", "index.html")), "creek KEEP stays on disk");

assert.ok(!/Softstyle|Autonomy|Links/.test(html), "Softstyle / Autonomy / Links stay off the face");
assert.ok(!/Weather Report|weather-report\.jpg/i.test(html), "Weather Report is gone");
assert.ok(!/ai-space\.jpg|AI Space/i.test(html), "AI Space dropped — not a website screenshot");
assert.ok(!/Recent made site/i.test(html), "Gold Silver is not captioned Recent made site");
assert.ok(!/<video\b/i.test(html), "no video elements");
assert.ok(!/<iframe\b/i.test(html), "no iframes");
assert.ok(!/youtube|vimeo|\.mp4|\.webm/i.test(html), "no video hosts or files");
assert.ok((html.match(/<strong>Sassmeharder<\/strong>/g) || []).length === 1, "Sassmeharder is one storefront tile");
assert.ok(!/No invented clients/i.test(html), "no disclaimer tone");
assert.ok(!/handoff and teach|Email Cara/i.test(html), "VOID copy is gone");

const tiles = html.match(/class="tile"/g) || [];
assert.ok(tiles.length >= 18, "screenshots-only strip has the original set plus fresh soup/Pages shots");
assert.ok(html.includes("class=\"strip\""), "tiles live in a hover-scroll strip");

const names = [
  "Pete Anderson",
  "Cougar Ridge",
  "Gold Silver",
  "Offshore Grill",
  "Hueca Omeyocan",
  "Farm to Table",
  "Pioneer Podcast",
  "Coast Broadcasting",
  "North Tillamook Library",
  "Manzanita Beach Company",
  "Housable",
  "Color Outside the Lines",
  "Stories",
  "Grant Desk",
  "Fine Art",
  "Watershed",
  "Coast Desk",
  "NCCWP",
  "Sassmeharder"
];
names.forEach((name) => {
  assert.ok(html.includes(name), "named work: " + name);
});

const titleOrder = [...html.matchAll(/class="tile"[\s\S]*?<strong>([^<]+)<\/strong>/g)].map((m) => m[1]);
assert.deepStrictEqual(titleOrder, names, "tiles stay in the selling order");

[
  "assets/work/pete-anderson.jpg",
  "assets/work/cougar-ridge.jpg",
  "assets/work/gold-silver.jpg",
  "assets/work/offshore-grill.jpg",
  "assets/work/hueca-omeyocan.jpg",
  "assets/work/farm-to-table.jpg",
  "assets/work/pioneer-podcast.jpg",
  "assets/work/coast-broadcasting.jpg",
  "assets/work/north-tillamook-library.jpg",
  "assets/work/manzanita-beach.jpg",
  "assets/work/housable.jpg",
  "assets/work/color-outside-the-lines.jpg",
  "assets/work/talent-features.jpg",
  "assets/work/grant-desk.jpg",
  "assets/work/fine-art.jpg",
  "assets/work/watershed.jpg",
  "assets/work/coast-desk.jpg",
  "assets/work/nccwp.jpg",
  "assets/work/sassmeharder.jpg"
].forEach((src) => {
  assert.ok(html.includes(src), "screenshot " + src);
  assert.ok(fs.existsSync(path.join(root, src)), src + " is on disk");
});

assert.ok(html.includes("Get in touch"), "footer is Get in touch");
assert.ok(html.includes("mailto:caradmico@gmail.com"), "email is the existing contact");
assert.ok(html.includes("503-277-8757"), "phone is the existing number");
assert.ok(!/Main Street|Portland, OR \d|Bluehost|Elementor/i.test(html), "no invented street or WP speak");

assert.ok(css.includes("--ground: #101618"), "dark ground token");
assert.ok(css.includes("--teal: #2aa8a0"), "warm teal token");
assert.ok(css.includes("--sun: #e8a317"), "sun token");
assert.ok(css.includes("--coral: #d4654a"), "coral token");
assert.ok(!/--paper: #faf6ef|--paper: #f4f6f8|--ink: #152028|--glow: #c9a227/.test(css), "pale paper tokens are gone");
assert.ok(!/border-radius:\s*(999px|50%|14px|16px)/.test(css), "no pill or soft-chip radii");
assert.ok(css.includes("overflow-x: auto"), "strip scrolls sideways");
assert.ok(css.includes("flex: 0 0 9.4rem") || css.includes("flex-basis: 9.4rem"), "phone tiles stay small");
assert.ok(css.includes('"Segoe UI"'), "GO type");

assert.ok(!/jarvis|commander/i.test(face), "home stays off canvas voice");
assert.ok(!fs.existsSync(path.join(root, "creek", "home.css")), "do not drop stand-in CSS into creek/");

console.log("home: dark architectural lander, ethos boxes, screenshots-only strip — all assertions passed");
