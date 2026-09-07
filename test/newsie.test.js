const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "figures.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "chrome.css"), "utf8");
const newsie = app.slice(app.indexOf("function buildNewsie"), app.indexOf("function fir"));

assert.ok(newsie.includes("function buildNewsie"), "newsie stays on the field");
assert.ok(newsie.includes("PlaneGeometry"), "the offered sheet is a page, not a box");
assert.ok(newsie.includes("paintOfferedSheet"), "the in-hand sheet is drawn, not a gray slab");
assert.ok(!/assets\/news\//.test(newsie), "do not stream the news folder onto the kid");
assert.ok(newsie.includes("paper: true"), "clicking the kid or the sheet still opens the paper");
assert.ok(app.includes("newsieHold"), "a cheap offer hold is wired");
assert.ok(!/new THREE\.PointLight/.test(app), "no extra PointLights");

assert.ok(fs.existsSync(path.join(root, "assets/news/pioneer-archive.jpg")), "Pioneer photo stays on disk");
assert.ok(!/jarvis|commander|experiment|v0/i.test(html), "canvas copy stays quiet");
assert.ok(!/By [A-Z][a-z]+ [A-Z]/.test(html), "no invented bylines");

assert.ok(css.includes("#paper-close"), "fold chrome stays");
assert.ok(css.includes("handed") || css.includes("rotate(-0.9deg)"), "the overlay sits like a handed sheet");

["figures.js", "index.html", "chrome.css"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});

console.log("newsie: offer pose, handed sheet, fold — all assertions passed");
