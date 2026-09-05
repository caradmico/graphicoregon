(function () {
  var status = document.getElementById("status");
  function showStatus(msg) {
    status.hidden = !msg;
    status.textContent = msg || "";
  }

  var map = L.map("map", {
    center: [45.72, -123.72],
    zoom: 9,
    zoomControl: true,
    preferCanvas: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "OpenStreetMap"
  }).addTo(map);

  var fmtInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  var palettes = {
    wells: { from: "#ead7a4", to: "#c4922a", stroke: "#2aa8a0" },
    surface_pods: { from: "#d8efe9", to: "#1f7f78", stroke: "#2aa8a0" },
    homes_off_city: { from: "#ead7a4", to: "#8b5a1e", stroke: "#d4b05a" },
    wells_per_home: { from: "#ead7a4", to: "#2aa8a0", stroke: "#d4b05a" }
  };

  function line(text, cls) {
    if (!text) return "";
    return "<div class='" + (cls || "pop-line") + "'>" + text + "</div>";
  }
  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function lerpColor(a, b, t) {
    var A = hexToRgb(a);
    var B = hexToRgb(b);
    var c = A.map(function (v, i) { return Math.round(v + (B[i] - v) * t); });
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }
  function nums(p) {
    var wells = Number((p || {}).wells || 0);
    var surface_pods = Number((p || {}).surface_pods || 0);
    var homes_off_city = Number((p || {}).homes_off_city || 0);
    return {
      wells: wells,
      surface_pods: surface_pods,
      homes_off_city: homes_off_city,
      wells_per_home: homes_off_city > 0 ? wells / homes_off_city : (wells > 0 ? wells : 0)
    };
  }
  function flags(p) {
    var n = nums(p);
    return {
      wellDominant: n.wells >= 50 && n.wells >= 3 * n.surface_pods,
      podDominant: n.surface_pods >= 20 && n.wells <= 5,
      fewWells: n.homes_off_city >= 200 && n.wells <= 30
    };
  }
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>]/g, function (ch) {
      if (ch === "&") return "\u0026amp;";
      if (ch === "<") return "\u0026lt;";
      return "\u0026gt;";
    });
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
    var features = pair[0].features || [];
    var summary = pair[1];
    if (features.length < 40) throw new Error("Expected many creek polygons");

    var totals = (summary && summary.counts) || {};
    var maxes = { wells: 0, surface_pods: 0, homes_off_city: 0, wells_per_home: 0 };
    features.forEach(function (f) {
      var n = nums(f.properties);
      maxes.wells = Math.max(maxes.wells, n.wells);
      maxes.surface_pods = Math.max(maxes.surface_pods, n.surface_pods);
      maxes.homes_off_city = Math.max(maxes.homes_off_city, n.homes_off_city);
      maxes.wells_per_home = Math.max(maxes.wells_per_home, n.wells_per_home);
    });

    var totalsList = document.getElementById("totals-list");
    [
      fmtInt.format(totals.creek_size || features.length) + " creeks in Clatsop and Tillamook",
      fmtInt.format(totals.homes_off_city || 0) + " houses outside city limits (" +
        fmtInt.format(totals.homes_clatsop_off_city || 0) + " Clatsop, " +
        fmtInt.format(totals.homes_tillamook_off_city || 0) + " Tillamook)",
      fmtInt.format(totals.wells || 0) + " well logs \u00b7 " +
        fmtInt.format(totals.surface_pods || 0) + " stream water rights"
    ].forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      totalsList.appendChild(li);
    });

    var mode = "homes_off_city";
    var activeFlags = { wellDominant: true, fewWells: true, podDominant: false };
    var layersByCode = {};
    var legendNote = document.getElementById("legend-note");
    var hotspotList = document.getElementById("hotspot-list");

    function heatStyle(n, maxN, palette) {
      var t = Math.max(0, Math.min(1, Number(n || 0) / (maxN || 1)));
      return {
        color: palette.stroke,
        weight: 1,
        fillColor: lerpColor(palette.from, palette.to, t),
        fillOpacity: 0.16 + 0.48 * t
      };
    }

    function styleFeature(feature) {
      var p = feature.properties || {};
      var n = nums(p);
      var f = flags(p);
      var style = heatStyle(n[mode], maxes[mode], palettes[mode]);
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
      var n = nums(p);
      var f = flags(p);
      var extra = [];
      if (n.homes_off_city > 0) {
        extra.push(line(n.wells_per_home.toFixed(2) + " well logs per house outside city limits"));
      }
      if (f.wellDominant) {
        extra.push(line("More well logs than stream rights. Next check: well date vs when groundwater rights were required."));
      }
      if (f.fewWells) {
        extra.push(line("Many houses outside city limits, few well logs. They may still sit on a city or district line."));
      }
      if (f.podDominant) {
        extra.push(line("Stream rights dominate the paper trail here."));
      }
      return "<strong>" + escapeHtml(p.name || "Creek") + "</strong>" +
        line(fmtInt.format(n.homes_off_city) + " houses outside city limits") +
        line(fmtInt.format(n.wells) + " well logs") +
        line(fmtInt.format(n.surface_pods) + " stream water rights") +
        extra.join("") +
        line("These are counts in the creek, not who drinks from what.", "pop-proxy");
    }

    function renderLegend() {
      var labels = {
        homes_off_city: "Darker = more houses outside city limits",
        wells: "Darker = more well logs",
        surface_pods: "Darker = more stream water rights",
        wells_per_home: "Darker = more well logs per house outside city limits"
      };
      legendNote.textContent = labels[mode] || "";
      hotspotList.textContent = "";
      var groups = [
        { kind: "wellDominant", title: "More wells than stream rights", on: activeFlags.wellDominant, fmt: function (n) {
          return fmtInt.format(n.wells) + " wells / " + fmtInt.format(n.surface_pods) + " stream rights";
        } },
        { kind: "fewWells", title: "Houses outside city, few well logs", on: activeFlags.fewWells, fmt: function (n) {
          return fmtInt.format(n.homes_off_city) + " houses / " + fmtInt.format(n.wells) + " wells";
        } },
        { kind: "podDominant", title: "Stream rights, few well logs", on: activeFlags.podDominant, fmt: function (n) {
          return fmtInt.format(n.surface_pods) + " stream rights / " + fmtInt.format(n.wells) + " wells";
        } }
      ];
      groups.forEach(function (group) {
        if (!group.on) return;
        var units = features.filter(function (f) { return flags(f.properties)[group.kind]; })
          .sort(function (a, b) {
            var na = nums(a.properties);
            var nb = nums(b.properties);
            if (group.kind === "wellDominant") return nb.wells - na.wells;
            if (group.kind === "podDominant") return nb.surface_pods - na.surface_pods;
            return nb.homes_off_city - na.homes_off_city;
          });
        if (!units.length) return;
        var head = document.createElement("li");
        head.textContent = group.title;
        head.style.marginTop = "8px";
        head.style.color = "#2aa8a0";
        head.style.fontSize = "0.7rem";
        head.style.letterSpacing = "0.12em";
        head.style.textTransform = "uppercase";
        hotspotList.appendChild(head);
        units.forEach(function (f) {
          var p = f.properties || {};
          var li = document.createElement("li");
          var btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = (p.name || "Creek") + " \u00b7 " + group.fmt(nums(p));
          btn.addEventListener("click", function () {
            var lyr = layersByCode[p.code];
            if (!lyr) return;
            map.fitBounds(lyr.getBounds(), { padding: [36, 36], maxZoom: 11 });
            lyr.openPopup();
          });
          li.appendChild(btn);
          hotspotList.appendChild(li);
        });
      });
    }

    var layer = L.geoJSON({ type: "FeatureCollection", features: features }, {
      style: styleFeature,
      onEachFeature: function (feature, lyr) {
        var p = feature.properties || {};
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
