const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "field.js"), "utf8");
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

assert.ok(html.includes('id="paper-close"'), "Fold stays");
assert.ok(html.includes("a paper from the path"), "the overlay still reads as a handed paper");
assert.ok(html.includes("assets/news/gazette-puffin.jpg"), "Gazette photo stays");
assert.ok(html.includes("assets/news/hipfish-1016.jpg"), "Hipfish photo is on the sheet");
assert.ok(html.includes("assets/news/pioneer-archive.jpg"), "Pioneer photo is on the sheet");
assert.ok(/<figcaption>Gazette<\/figcaption>/.test(html), "caption Gazette from the file");
assert.ok(/<figcaption>Hipfish<\/figcaption>/.test(html), "caption Hipfish from the file");
assert.ok(/<figcaption>Pioneer<\/figcaption>/.test(html), "caption Pioneer from the file");
assert.ok(html.includes("https://graphicoregon.com/"), "graphicoregon.com stays a real link");
assert.ok(
  html.includes("https://www.tillamookcountypioneer.net/author/assistant-editor/"),
  "Pioneer author page stays a real link"
);
assert.ok(!/jarvis|commander|experiment|v0/i.test(html), "canvas copy stays quiet");
assert.ok(!/byline|By [A-Z]/i.test(html), "no invented bylines");

assert.ok(css.includes("#paper-close"), "fold chrome stays");
assert.ok(css.includes("handed") || css.includes("rotate(-0.9deg)"), "the overlay sits like a handed sheet");

["field.js", "index.html", "chrome.css"].forEach((file) => {
  const src = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(!/jarvis|commander/i.test(src), file + " stays off the canvas");
});

console.log("newsie: offer pose, handed sheet, fold — all assertions passed");
