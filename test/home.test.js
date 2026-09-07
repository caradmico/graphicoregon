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

assert.ok(/website design &amp; systems/i.test(html), "header names the offer");
assert.ok(html.includes('href="#contact"'), "header contact jumps to contact");
assert.ok(html.includes("Business is hard. Websites shouldn’t be."), "tagline hero");
assert.ok(/Email Graphic Oregon/.test(html), "firm email CTA");
assert.ok(html.includes('href="tel:+15032778757"'), "firm call CTA");
assert.ok(!/Email Cara|\bCara\b/.test(html.replace(/caradmico@gmail\.com/g, "")), "no personal name on the door");

const skillsIdx = html.indexOf('id="skills-title"');
const workIdx = html.indexOf('id="work-title"');
assert.ok(skillsIdx > -1 && skillsIdx < workIdx, "skills sit near the top, before selected work");
assert.ok(/<h2 id="skills-title">Skills<\/h2>/.test(html), "skills heading is explicit");

const ladder = html.slice(html.indexOf('class="ladder"'), html.indexOf('class="promise"'));
assert.ok(/<span class="step">1<\/span>[\s\S]*Branding/.test(ladder), "ladder 1 Branding");
assert.ok(/<span class="step">2<\/span>[\s\S]*Market research/.test(ladder), "ladder 2 Market research");
assert.ok(/<span class="step">3<\/span>[\s\S]*Timeless collateral/.test(ladder), "ladder 3 Timeless collateral");
assert.ok(html.includes("Fast · affordable · easy — on any platform"), "promise line");

assert.ok(!/href=["']creek\/["']/.test(html), "do not sell creek on the stand-in");
assert.ok(!/Hair and river|3D explore/i.test(html), "creek is not finished-craft copy");
assert.ok(fs.existsSync(path.join(root, "creek", "index.html")), "creek KEEP stays on disk");
assert.ok(html.includes("https://caradmico.github.io/company-soup/brands/grant-desk/"), "Grant Desk live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/businesses/fine-art/"), "Fine Art live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/businesses/watershed/"), "Watershed/Demeter live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/brands/coast-desk/"), "Coast Desk live URL");

const selling = html.slice(0, html.indexOf('class="colophon"'));
assert.ok(!/Softstyle|Autonomy|Links/.test(selling), "Softstyle / Autonomy / Links stay off the selling face");
assert.ok(html.includes("https://caradmico.github.io/company-soup/ops/autonomy/"), "Autonomy stays reachable in the footer");
assert.ok(html.includes("https://caradmico.github.io/company-soup/ops/links/"), "Links stays reachable in the footer");
assert.ok(html.includes("https://sassmeharder.com/product/31685244"), "Softstyle KEEP is footer-only");

assert.ok((html.match(/<strong>Sassmeharder<\/strong>/g) || []).length === 1, "Sassmeharder is one tile only");
assert.ok((html.match(/href="https:\/\/sassmeharder\.com\/"/g) || []).length === 1, "shop root is the one Sass href");
assert.ok(/managed \/ paid-run/i.test(html), "Sassmeharder labeled as managed / paid-run");
assert.ok(!/Printify|how-to|POD tutorial/i.test(html), "not a Printify how-to");
assert.ok(!/No invented clients/i.test(html), "no disclaimer tone");
assert.ok(!/handoff and teach|Email Cara/i.test(html), "VOID copy is gone");

["Offshore Grill", "Hueca", "Pioneer Podcast", "Weather Report", "Farm to Table", "AI Space"].forEach((name) => {
  assert.ok(html.includes(name), "named work: " + name);
});
[
  "assets/work/offshore-grill.jpg",
  "assets/work/hueca-omeyocan.jpg",
  "assets/work/pioneer-podcast.jpg",
  "assets/work/weather-report.jpg",
  "assets/work/farm-to-table.jpg",
  "assets/work/ai-space.jpg"
].forEach((src) => {
  assert.ok(html.includes(src), "screenshot " + src);
  assert.ok(fs.existsSync(path.join(root, src)), src + " is on disk");
});

["WordPress", "Webflow", "Node.js", "Python", "C", "C++", "Three.js"].forEach((stack) => {
  assert.ok(html.includes(stack), "stack chip " + stack);
});

assert.ok(html.includes("mailto:caradmico@gmail.com"), "email is the existing contact");
assert.ok(html.includes("503-277-8757"), "phone is the existing number");
assert.ok(!/Main Street|Portland, OR \d|Bluehost|Elementor/i.test(html), "no invented street or WP speak");

assert.ok(css.includes("--ink: #1a2428"), "warm ink token");
assert.ok(css.includes("--paper: #faf6ef"), "warm paper token");
assert.ok(css.includes("--signal: #0d7a6f"), "living teal token");
assert.ok(css.includes("--sun: #e8a317"), "sun token");
assert.ok(css.includes("--sand: #edd9c0"), "sand token");
assert.ok(css.includes("--coral: #d4654a"), "coral token");
assert.ok(css.includes("--line: #e0d4c4"), "line token");
assert.ok(css.includes("--mute: #6a5f55"), "mute token");
assert.ok(css.includes("--card: #fffdf8"), "card token");
assert.ok(!/--paper: #f4f6f8|--ink: #152028|--glow: #c9a227/.test(css), "VOID pale tokens are gone");
assert.ok(css.includes('"Segoe UI"'), "GO type");
assert.ok(css.includes("min-height: 48px"), "large tap targets");

assert.ok(!/jarvis|commander/i.test(face), "home stays off canvas voice");
assert.ok(!fs.existsSync(path.join(root, "creek", "home.css")), "do not drop stand-in CSS into creek/");

console.log("home: warm firm lander, tagline, ladder, one Sass — all assertions passed");
