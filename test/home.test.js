const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "home.css"), "utf8");

assert.ok(html.includes('href="home.css"'), "stand-in loads home.css");
assert.ok(!/src=["'][^"']*(three(\.min)?\.js|figures\.js|roster\.js|faces\.js|look\.js|field-nav\.js)/i.test(html), "home does not load the field");
assert.ok(!/href=["']chrome\.css["']/.test(html), "home does not load field chrome");
assert.ok(!/<canvas/i.test(html), "home is not a Three canvas");

assert.ok(/website design &amp; systems/i.test(html), "header names the offer");
assert.ok(html.includes('href="#contact"'), "header contact jumps to contact");
assert.ok(/handoff and teach/i.test(html), "hero names handoff and teach");

assert.ok(!/href=["']creek\/["']/.test(html), "do not sell creek on the stand-in");
assert.ok(!/Hair and river|3D explore/i.test(html), "creek is not finished-craft copy");
assert.ok(fs.existsSync(path.join(root, "creek", "index.html")), "creek KEEP stays on disk");
assert.ok(html.includes("https://caradmico.github.io/company-soup/brands/grant-desk/"), "Grant Desk live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/businesses/fine-art/"), "Fine Art live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/businesses/watershed/"), "Watershed/Demeter live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/brands/coast-desk/"), "Coast Desk live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/ops/autonomy/"), "Autonomy live URL");
assert.ok(html.includes("https://caradmico.github.io/company-soup/ops/links/"), "Links live URL");
assert.ok(html.includes("https://sassmeharder.com/"), "Sassmeharder live URL");
assert.ok(html.includes("Sassmeharder"), "Sassmeharder tile name");
assert.ok(/managed \/ paid-run/i.test(html), "Sassmeharder labeled as managed / paid-run");
assert.ok(!/Printify|how-to|POD tutorial/i.test(html), "not a Printify how-to");

["Offshore Grill", "Hueca Omeyocan", "Tillamook County Pioneer Podcast", "Tillamook County Weather Report", "Farm to Table", "AI Space"].forEach((name) => {
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

assert.ok(css.includes("--ink: #152028"), "GO ink token");
assert.ok(css.includes("--paper: #f4f6f8"), "GO paper token");
assert.ok(css.includes("--signal: #0e6b7a"), "GO signal token");
assert.ok(css.includes("--sand: #e8e2d6"), "GO sand token");
assert.ok(css.includes("--line: #cfd6dc"), "GO line token");
assert.ok(css.includes("--mute: #5c6872"), "GO mute token");
assert.ok(css.includes("--card: #ffffff"), "GO card token");
assert.ok(css.includes("--glow: #c9a227"), "GO glow token");
assert.ok(css.includes('"Segoe UI"'), "GO type");

assert.ok(!/jarvis|commander/i.test(html + css), "home stays off canvas voice");
assert.ok(!fs.existsSync(path.join(root, "creek", "home.css")), "do not drop stand-in CSS into creek/");

console.log("home: stand-in door, portfolio, stacks, contact — all assertions passed");
