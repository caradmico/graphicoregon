(function () {
  const status = document.getElementById("status");
  function showStatus(msg) {
    status.hidden = !msg;
    status.textContent = msg || "";
  }

  const map = L.map("map", {
    center: [45.72, -123.72],
    zoom: 9,
    zoomControl: true,
    preferCanvas: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
  }).addTo(map);

  const fmtInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  const palettes = {
    wells: { from: "#ead7a4", to: "#c4922a", stroke: "#2aa8a0" },
    surface_pods: { from: "#d8efe9", to: "#1f7f78", stroke: "#2aa8a0" },
    homes_off_city: { from: "#ead7a4", to: "#8b5a1e", stroke: "#d4b05a" },
    wells_per_home: { from: "#ead7a4", to: "#2aa8a0", stroke: "#d4b05a" }
  };

  function line(text, cls) {
    if (!text) return "";
    return "<div class=\"" + (cls || "pop-line") + "\">" + text + "</div>";
  }
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function lerpColor(a, b, t) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    const c = A.map(function (v, i) { return Math.round(v + (B[i] - v) * t); });
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }
  function nums(p) {
    const wells = Number((p || {}).wells || 0);
    const surface_pods = Number((p || {}).surface_pods || 0);
    const homes_off_city = Number((p || {}).homes_off_city || 0);
    return {
      wells: wells,
      surface_pods: surface_pods,
      homes_off_city: homes_off_city,
      wells_per_home: homes_off_city > 0 ? wells / homes_off_city : (wells > 0 ? wells : 0)
    };
  }
  function flags(p) {
    const n = nums(p);
    return {
      wellDominant: n.wells >= 50 && n.wells >= 3 * n.surface_pods,
      podDominant: n.surface_pods >= 20 && n.wells <= 5,
      fewWells: n.homes_off_city >= 200 && n.wells <= 30
    };
  }
  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  Promise.all([
    fetch("data/creek_size.geojson").then(function (res) {
      if (!res.ok) throw new Error("creek map missing");
      return res.json();
    }),
    fetch("data/summary.json").then(function (res) {
      if (!res.ok) throw new Error("summary missing");
      return res.json();
    })
  ]).then(function (pair) {
    const features = (pair[0].features || []);
    const summary = pair[1];
    if (features.length < 40) throw new Error("Expected many creek polygons");

    const totals = (summary && summary.counts) || {};
    const maxes = { wells: 0, surface_pods: 0, homes_off_city: 0, wells_per_home: 0 };
    features.forEach(function (f) {
      const n = nums(f.properties);
      maxes.wells = Math.max(maxes.wells, n.wells);
      maxes.surface_pods = Math.max(maxes.surface_pods, n.surface_pods);
      maxes.homes_off_city = Math.max(maxes.homes_off_city, n.homes_off_city);
      maxes.wells_per_home = Math.max(maxes.wells_per_home, n.wells_per_home);
    });

    const totalsList = document.getElementById("totals-list");
    [
      fmtInt.format(totals.creek_size || features.length) + " creeks in Clatsop and Tillamook",
      fmtInt.format(totals.homes_off_city || 0) + " houses outside city limits (" +
        fmtInt.format(totals.homes_clatsop_off_city || 0) + " Clatsop, " +
        fmtInt.format(totals.homes_tillamook_off_city || 0) + " Tillamook)",
      fmtInt.format(totals.wells || 0) + " registered wells · " +
        fmtInt.format(totals.surface_pods || 0) + " stream water rights"
    ].forEach(function (text) {
      const li = document.createElement("li");
      li.textContent = text;
      totalsList.appendChild(li);
    });

    let mode = "homes_off_city";
    const activeFlags = { wellDominant: true, fewWells: true, podDominant: false };
    const layersByCode = {};
    const legendNote = document.getElementById("legend-note");
    const hotspotList = document.getElementById("hotspot-list");

    function heatStyle(n, maxN, palette) {
      const t = Math.max(0, Math.min(1, Number(n || 0) / (maxN || 1)));
      return {
        color: palette.stroke,
        weight: 1,
        fillColor: lerpColor(palette.from, palette.to, t),
        fillOpacity: 0.16 + 0.48 * t
      };
    }

    function styleFeature(feature) {
      const p = feature.properties || {};
      const n = nums(p);
      const f = flags(p);
      const style = heatStyle(n[mode], maxes[mode], palettes[mode]);
      if (activeFlags.wellDominant && f.wellDominant) {
        style.color = "#2aa8a0";
        style.weight = 2.4;
      } else if (activeFlags.fewWells && f.fewWells) {
        style.color = "#d4b05a";
        style.weight = 2.4;
      } else if (activeFlags.podDominant && f.podDominant) {
        style.color = "#ead7a4";
        style.weight = 2.4;
      }
      return style;
    }

    function popupHtml(p) {
      const n = nums(p);
      const f = flags(p);
      const extra = [];
      if (n.homes_off_city > 0) {
        extra.push(line((n.wells / n.homes_off_city).toFixed(2) + " registered wells per house off city water"));
      }
      if (f.wellDominant) extra.push(line("Well records far outnumber stream water rights here."));
      if (f.fewWells) extra.push(line("Many houses off city water, few well records."));
      if (f.podDominant) extra.push(line("Stream water rights dominate; almost no well records."));
      return "<strong>" + escapeHtml(p.name || "Creek") + "</strong>" +
        line(fmtInt.format(n.homes_off_city) + " houses off city water") +
        line(fmtInt.format(n.wells) + " registered wells") +
        line(fmtInt.format(n.surface_pods) + " stream water rights") +
        extra.join("") +
        line("Counts are public records inside this creek. Not who drinks from what.", "pop-proxy");
    }

    function renderLegend() {
      const labels = {
        homes_off_city: "<span class=\"swatch homes\"></span>Darker = more houses off city water",
        wells: "<span class=\"swatch wells\"></span>Darker = more registered wells",
        surface_pods: "<span class=\"swatch rights\"></span>Darker = more stream water rights",
        wells_per_home: "<span class=\"swatch well-dom\"></span>Darker = more well records per house"
      };
      legendNote.innerHTML = labels[mode] || "";
      hotspotList.textContent = "";
      const groups = [
        { kind: "wellDominant", title: "Well-heavy", on: activeFlags.wellDominant, fmt: function (n) {
          return fmtInt.format(n.wells) + " wells / " + fmtInt.format(n.surface_pods) + " stream rights";
        } },
        { kind: "fewWells", title: "Many houses, few wells", on: activeFlags.fewWells, fmt: function (n) {
          return fmtInt.format(n.homes_off_city) + " houses / " + fmtInt.format(n.wells) + " wells";
        } },
        { kind: "podDominant", title: "Stream-right heavy", on: activeFlags.podDominant, fmt: function (n) {
          return fmtInt.format(n.surface_pods) + " stream rights / " + fmtInt.format(n.wells) + " wells";
        } }
      ];
      groups.forEach(function (group) {
        if (!group.on) return;
        const units = features.filter(function (f) { return flags(f.properties)[group.kind]; })
          .sort(function (a, b) {
            const na = nums(a.properties);
            const nb = nums(b.properties);
            if (group.kind === "wellDominant") return nb.wells - na.wells;
            if (group.kind === "podDominant") return nb.surface_pods - na.surface_pods;
            return nb.homes_off_city - na.homes_off_city;
          });
        if (!units.length) return;
        const head = document.createElement("li");
        head.textContent = group.title;
        head.style.marginTop = "8px";
        head.style.color = "#2aa8a0";
        head.style.fontSize = "0.7rem";
        head.style.letterSpacing = "0.12em";
        head.style.textTransform = "uppercase";
        hotspotList.appendChild(head);
        units.forEach(function (f) {
          const p = f.properties || {};
          const li = document.createElement("li");
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = (p.name || "Creek") + " · " + group.fmt(nums(p));
          btn.addEventListener("click", function () {
            const lyr = layersByCode[p.code];
            if (!lyr) return;
            map.fitBounds(lyr.getBounds(), { padding: [36, 36], maxZoom: 11 });
            lyr.openPopup();
          });
          li.appendChild(btn);
          hotspotList.appendChild(li);
        });
      });
    }

    const layer = L.geoJSON({ type: "FeatureCollection", features: features }, {
      style: styleFeature,
      onEachFeature: function (feature, lyr) {
        const p = feature.properties || {};
        layersByCode[p.code] = lyr;
        lyr.bindPopup(function () { return popupHtml(p); });
      }
    }).addTo(map);

    map.fitBounds(layer.getBounds(), { padding: [24, 24], maxZoom: 10 });

    function refresh() {
      layer.setStyle(styleFeature);
      renderLegend();
    }

    document.querySelectorAll(".modes button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        mode = btn.getAttribute("data-mode");
        document.querySelectorAll(".modes button").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        refresh();
      });
    });
    document.querySelectorAll(".layers input").forEach(function (box) {
      box.addEventListener("change", function () {
        activeFlags[box.getAttribute("data-flag")] = box.checked;
        box.parentElement.classList.toggle("on", box.checked);
        refresh();
      });
    });

    refresh();
    showStatus("");
  }).catch(function (err) {
    showStatus(err.message || "Could not load the map.");
  });
})();
