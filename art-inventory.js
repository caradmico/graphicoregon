/* Graphic Oregon — unique studio works hung once. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ArtInventory = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const PRIVATE = ["identity-canvas.jpg", "identity-canvas.png"];

  /* Same work as mixed-media-gouache.jpg — keep the file, do not hang twice. */
  const ALIAS = {
    "mixed-media-gouache-on-canson.jpg": "mixed-media-gouache.jpg"
  };

  const HANG = [
    "0321232309_HDR.jpg",
    "0517232026.jpg",
    "0716231323.jpg",
    "0730230642.jpg",
    "20180506_122928-2.jpg",
    "20181111_133449.jpg",
    "20181121_150820-2.jpg",
    "20181202_131855-2.jpg",
    "20190629_203228-1.jpg",
    "2020-08-21-1.jpg",
    "20200504_131719-1.jpg",
    "20200701_195408.jpg",
    "20200724_204038-2.jpg",
    "20201024_233425.jpg",
    "20201024_233433.jpg",
    "20201024_233453.jpg",
    "20201024_233510.jpg",
    "20201024_233520.jpg",
    "20201025_145149.jpg",
    "20201025_145254.jpg",
    "20201025_145436.jpg",
    "20201206_134723.jpg",
    "20201206_134739.jpg",
    "20201206_134759.jpg",
    "IMG_20151029_091758.jpg",
    "IMG_20200214_214207-2.jpg",
    "IMG_3195.jpg",
    "IMG_3197.jpg",
    "IMG_3198.jpg",
    "IMG_3201.jpg",
    "IMG_3207.jpg",
    "IMG_3208.jpg",
    "IMG_3210.jpg",
    "NA7y1.jpg",
    "bird.jpg",
    "broken.jpg",
    "cat.jpg",
    "cloth-study.jpg",
    "composition-study.jpg",
    "dog.jpg",
    "female-figure-charcoal.jpg",
    "female-figure-oil.jpg",
    "female-nude-charcoal.jpg",
    "female-portrait-acrylic.jpg",
    "female-portrait-oil-3.jpg",
    "female-portrait-oil-4.jpg",
    "female-portrait-oil.jpg",
    "ghost.jpg",
    "large-jelly.jpg",
    "leg-in-water.jpg",
    "linoleum-print.jpg",
    "male-portrait.jpg",
    "mixed-media-gouache.jpg",
    "mono-print.jpg",
    "monochromatic-self-portrait.jpg",
    "neahkahnie.jpg",
    "nehalem.jpg",
    "ocean.jpg",
    "self-portrait-acrylic.jpg",
    "self-portrait-charcoal.jpg",
    "self-portrait-graphite.jpg",
    "still-life-1.jpg",
    "still-life-2-2.jpg",
    "still-life-acrylic.jpg",
    "still-life-charcoal-3.jpg",
    "still-life-charcoal-4.jpg",
    "still-life-charcoal.jpg",
    "still-life-graphite.jpg",
    "still-life-pencil.jpg",
    "street-scene.jpg",
    "unfinished.jpg",
    "violet-flame.jpg"
  ];

  function titleFromFile(file) {
    return String(file || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
  }

  function isPrivate(file) {
    const n = String(file || "").toLowerCase();
    return PRIVATE.some((p) => n === p || n.indexOf("identity-canvas") !== -1);
  }

  function shouldHang(file) {
    if (!file || isPrivate(file)) return false;
    if (ALIAS[file]) return false;
    return HANG.indexOf(file) !== -1;
  }

  return {
    HANG: HANG,
    PRIVATE: PRIVATE,
    ALIAS: ALIAS,
    titleFromFile: titleFromFile,
    isPrivate: isPrivate,
    shouldHang: shouldHang
  };
});
