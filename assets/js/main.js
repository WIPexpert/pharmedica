/* Pharmedica site prototype — shared behaviour.
   No build step, no dependencies: works as-is on GitHub Pages. */
(function () {
  "use strict";

  /* ---------- Glossary: every abbreviation and technical term in one place ---------- */
  var GLOSSARY = {
    odf: { term: "ODF", full: "Oral Dissolving Film", def: "A thin strip, about the size of a postage stamp, that dissolves in the mouth and releases the ingredients it carries. No water or swallowing needed." },
    podf: { term: "P/ODF", full: "Programmable Oral Dissolving Film", def: "Pharmedica's platform. The dose, the timing of release and the mix of ingredients are set by design for each product." },
    api: { term: "API", full: "Active Pharmaceutical Ingredient", def: "The part of a medicine that produces the effect. The rest of a pill or film is there to carry it." },
    mucosa: { term: "Oral mucosa", def: "The soft, moist lining inside the mouth. Many medicines can pass through it straight into the bloodstream." },
    firstpass: { term: "First-pass metabolism", def: "A swallowed medicine goes to the liver before it reaches the rest of the body, and the liver breaks part of it down. Absorption through the mouth lining skips this step." },
    bioavail: { term: "Bioavailability", def: "The share of a dose that actually reaches the bloodstream and can work." },
    hme: { term: "HME", full: "Hot-Melt Extrusion", def: "A manufacturing method that melts the materials and presses them through a shaped opening, a bit like making pasta. It uses no solvents and scales from small to large batches." },
    casting: { term: "Solvent casting", def: "The usual way to make oral films: dissolve the ingredients in a liquid, spread it thin and dry it. Slower, costlier and it limits which ingredients can be combined." },
    hygro: { term: "Hygroscopic", def: "Attracts and absorbs moisture. In the mouth, such a material soaks up saliva and swells into a gel." },
    bolus: { term: "Bolus", def: "A quick dose released all at once, for a fast effect." },
    dysphagia: { term: "Dysphagia", def: "Difficulty swallowing. Common in older people, after a stroke, and in some neurological conditions." },
    xero: { term: "Xerostomia", def: "The medical name for dry mouth: the salivary glands do not make enough saliva." },
    mucositis: { term: "Oral mucositis", def: "Painful inflammation and sores in the lining of the mouth. A frequent side effect of chemotherapy and radiation therapy." },
    gmp: { term: "GMP", full: "Good Manufacturing Practice", def: "Rules that make sure medical and health products are made consistently and to a defined quality." },
    iso13485: { term: "ISO 13485", def: "The international quality-management standard for companies that make medical devices." },
    gras: { term: "GRAS", full: "Generally Recognized As Safe", def: "A US Food and Drug Administration (FDA) status for substances that experts consider safe for their intended use." },
    fda: { term: "FDA", full: "US Food and Drug Administration", def: "The US government agency that regulates medicines, medical devices and food." },
    monograph: { term: "OTC monograph", full: "Over-The-Counter monograph", def: "An FDA rulebook for a type of non-prescription product. A product that meets its conditions can be sold in the US without a separate approval." },
    amar: { term: "AMAR", full: "Medical Devices Division, Israeli Ministry of Health", def: "The Israeli authority that registers medical devices for sale in Israel." },
    nutra: { term: "Nutraceutical", def: "A product made from food sources with a health benefit, such as vitamins, minerals or plant extracts." },
    glyco: { term: "Glycopyrrolate", def: "A known, approved medicine that reduces saliva production. Used to treat excessive drooling." },
    hpmc: { term: "HPMC", full: "Hydroxypropyl methylcellulose", def: "A plant-derived cellulose widely used to form films and coat tablets." },
    xylitol: { term: "Xylitol", def: "A natural sweetener found in many fruits and vegetables. Common in sugar-free gum because it does not feed the bacteria that cause tooth decay." },
    excipient: { term: "Excipient", def: "Any ingredient in a product other than the active one: binders, flavours, film-formers." },
  };
  window.PHARMEDICA_GLOSSARY = GLOSSARY;

  /* ---------- Tooltip engine (hover, keyboard focus, tap) ---------- */
  var tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  tip.id = "tooltip";
  document.body.appendChild(tip);
  var tipFor = null;

  function showTip(el) {
    var g = GLOSSARY[el.getAttribute("data-t")];
    if (!g) return;
    tip.innerHTML = "<b>" + g.term + "</b>" + (g.full ? '<span class="tip-full">' + g.full + "</span>" : "") + g.def;
    tip.classList.add("show");
    el.setAttribute("aria-describedby", "tooltip");
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = r.left + window.scrollX + r.width / 2 - tw / 2;
    left = Math.max(window.scrollX + 12, Math.min(left, window.scrollX + document.documentElement.clientWidth - tw - 12));
    var top = r.top + window.scrollY - th - 10;
    if (r.top - th - 10 < 70) top = r.bottom + window.scrollY + 10;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tipFor = el;
  }
  function hideTip() {
    tip.classList.remove("show");
    if (tipFor) tipFor.removeAttribute("aria-describedby");
    tipFor = null;
  }
  document.querySelectorAll(".t").forEach(function (el) {
    el.setAttribute("tabindex", "0");
    el.addEventListener("mouseenter", function () { showTip(el); });
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", function () { showTip(el); });
    el.addEventListener("blur", hideTip);
    el.addEventListener("click", function (e) { e.stopPropagation(); if (tipFor === el) hideTip(); else showTip(el); });
  });
  document.addEventListener("click", hideTip);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { hideTip(); closeDrawer(); } });
  window.addEventListener("scroll", function () { if (tipFor) showTip(tipFor); }, { passive: true });

  /* ---------- Glossary drawer ---------- */
  var fab = document.createElement("button");
  fab.className = "glossary-fab";
  fab.type = "button";
  fab.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M8 7h8M8 11h6"/></svg> Glossary';
  fab.setAttribute("aria-haspopup", "dialog");
  document.body.appendChild(fab);

  var bg = document.createElement("div");
  bg.className = "drawer-bg"; bg.hidden = true;
  var drawer = document.createElement("aside");
  drawer.className = "drawer"; drawer.hidden = true;
  drawer.setAttribute("role", "dialog"); drawer.setAttribute("aria-label", "Glossary");
  var keys = Object.keys(GLOSSARY).sort(function (a, b) { return GLOSSARY[a].term.localeCompare(GLOSSARY[b].term); });
  drawer.innerHTML = '<header><h3>Glossary</h3><button class="icon-btn" type="button" aria-label="Close glossary">✕</button></header>' +
    '<p class="small muted">Plain-language explanations of the terms used on this site. Underlined words show the same note when you point at them.</p>' +
    '<input id="glossary-search" type="search" placeholder="Search a term" aria-label="Search the glossary" style="margin-top:12px">' +
    "<dl>" + keys.map(function (k) {
      var g = GLOSSARY[k];
      return '<div data-k="' + k + '"><dt>' + g.term + (g.full ? " <span>· " + g.full + "</span>" : "") + "</dt><dd>" + g.def + "</dd></div>";
    }).join("") + "</dl>";
  document.body.appendChild(bg);
  document.body.appendChild(drawer);
  function openDrawer() { bg.hidden = false; drawer.hidden = false; drawer.querySelector("input").focus(); }
  function closeDrawer() { bg.hidden = true; drawer.hidden = true; }
  fab.addEventListener("click", openDrawer);
  bg.addEventListener("click", closeDrawer);
  drawer.querySelector(".icon-btn").addEventListener("click", closeDrawer);
  drawer.querySelector("input").addEventListener("input", function (e) {
    var q = e.target.value.trim().toLowerCase();
    drawer.querySelectorAll("dl > div").forEach(function (d) { d.hidden = q && d.textContent.toLowerCase().indexOf(q) === -1; });
  });

  /* ---------- Mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) { a.addEventListener("click", function () { header.classList.remove("open"); }); });
  }

  /* ---------- Review notes: hidden on the live site.
     Open any page with ?review or #review to show the "Review notes" button. ---------- */
  var notes = document.querySelectorAll(".chk");
  var reviewMode = /[?&#]review\b/.test(location.search + location.hash);
  if (notes.length && reviewMode) {
    var rt = document.createElement("button");
    rt.className = "review-toggle"; rt.type = "button";
    rt.setAttribute("aria-pressed", "false");
    rt.textContent = "Review notes · " + notes.length;
    rt.title = "Highlight statements that need the company's confirmation before launch";
    document.body.appendChild(rt);
    rt.addEventListener("click", function () {
      var on = document.body.classList.toggle("review");
      rt.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- Segmented buttons helper ---------- */
  function segmented(group, onChange) {
    var btns = group.querySelectorAll("button");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        onChange(b.getAttribute("data-v"));
      });
    });
  }
  window.PH_segmented = segmented;

  function setRangeFill(r) {
    var p = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.setProperty("--p", p + "%");
  }

  /* ---------- Film programmer (home hero) ---------- */
  var lab = document.getElementById("lab");
  if (lab) {
    var dose = document.getElementById("dose");
    var doseOut = document.getElementById("dose-out");
    var durBtns = document.getElementById("dur");
    var actBtns = document.getElementById("acts");
    var curve = document.getElementById("curve");
    var film = document.getElementById("film");
    var verdict = document.getElementById("verdict");
    var axisEnd = document.getElementById("axis-end");
    var axisMid = document.getElementById("axis-mid");
    var state = { dose: 40, dur: 240, acts: 2 };
    var COLORS = ["#5F40D9", "#2E9BD6", "#D2468F"];
    var DUR_LABEL = { 10: "10 min", 60: "1 h", 240: "4 h", 720: "12 h" };

    // place the conventional-film limit mark on the dose slider (50 mg of 5–150)
    var mark = document.getElementById("limit-mark");
    if (mark) mark.style.left = "calc(" + ((50 - 5) / (150 - 5) * 100) + "% - 1px)";

    function profile(i, n, t) {
      // Illustrative release rate shapes (0..1 time) — not clinical data
      if (n === 1) {
        return 0.85 * Math.exp(-Math.pow((t - 0.08) / 0.07, 2)) + 0.35 * (t > 0.05 && t < 0.95 ? 1 : 0) * Math.min(1, (t - 0.05) * 12) * Math.min(1, (0.95 - t) * 12);
      }
      if (i === 0) return 0.95 * Math.exp(-Math.pow((t - 0.07) / 0.06, 2)) + 0.18 * Math.exp(-Math.pow((t - 0.3) / 0.25, 2));
      if (i === 1) return 0.62 * Math.exp(-Math.pow((t - 0.45) / 0.2, 2));
      return 0.4 * (t > 0.2 ? Math.min(1, (t - 0.2) * 8) : 0) * (t < 0.97 ? Math.min(1, (0.97 - t) * 10) : 0);
    }

    function draw() {
      var n = state.acts;
      var W = 300, H = 120, pad = 6;
      var paths = "";
      var scale = 0.35 + 0.65 * (state.dose / 150);
      for (var i = 0; i < n; i++) {
        var d = "M " + pad + " " + (H - pad);
        for (var k = 0; k <= 60; k++) {
          var t = k / 60;
          var y = (H - pad) - profile(i, n, t) * (H - 2 * pad) * scale;
          d += " L " + (pad + t * (W - 2 * pad)).toFixed(1) + " " + y.toFixed(1);
        }
        d += " L " + (W - pad) + " " + (H - pad) + " Z";
        paths += '<path d="' + d + '" fill="' + COLORS[i] + '" fill-opacity=".16" stroke="' + COLORS[i] + '" stroke-width="2" stroke-linejoin="round"/>';
      }
      curve.innerHTML = '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#CFCDE6" stroke-width="1"/>' + paths;
      axisEnd.textContent = DUR_LABEL[state.dur];
      axisMid.textContent = state.dur >= 60 ? (state.dur / 120 >= 1 ? (state.dur / 120) + " h" : (state.dur / 2) + " min") : (state.dur / 2) + " min";

      // film layers: one layer per active, wells when actives conflict (2+)
      var thick = 6 + state.dose / 150 * 10;
      var svg = "";
      for (var j = 0; j < n; j++) {
        var y0 = 30 + j * (thick + 10);
        svg += '<g class="layer"><polygon points="20,' + (y0 + 14) + " 90," + y0 + " 140," + (y0 + 14) + " 70," + (y0 + 28) + '" fill="' + COLORS[j] + '" fill-opacity=".22" stroke="' + COLORS[j] + '" stroke-width="1.5"/>' +
          '<polygon points="20,' + (y0 + 14) + " 70," + (y0 + 28) + " 70," + (y0 + 28 + thick) + " 20," + (y0 + 14 + thick) + '" fill="' + COLORS[j] + '" fill-opacity=".38"/>' +
          '<polygon points="70,' + (y0 + 28) + " 140," + (y0 + 14) + " 140," + (y0 + 14 + thick) + " 70," + (y0 + 28 + thick) + '" fill="' + COLORS[j] + '" fill-opacity=".5"/>';
        if (n > 1) {
          svg += '<ellipse cx="62" cy="' + (y0 + 14) + '" rx="9" ry="4" fill="#FFFFFF" stroke="' + COLORS[j] + '" stroke-width="1.2"/><ellipse cx="94" cy="' + (y0 + 12) + '" rx="9" ry="4" fill="#FFFFFF" stroke="' + COLORS[j] + '" stroke-width="1.2"/>';
        }
        svg += "</g>";
      }
      film.setAttribute("viewBox", "0 0 160 " + (60 + n * (thick + 10) + 20));
      film.innerHTML = svg;

      // verdict
      var reasons = [];
      if (state.dose > 50) reasons.push("more than 50 mg in one film");
      if (state.dur > 30) reasons.push("release longer than 30 minutes");
      if (n > 1) reasons.push("several active ingredients kept apart");
      if (reasons.length) {
        verdict.innerHTML = '<span class="badge">P/ODF only</span><div>A conventional film cannot do this: ' + reasons.join(", ") + ".</div>";
      } else {
        verdict.innerHTML = '<span class="badge ok">Both</span><div>A conventional film can handle this. P/ODF adds flexibility beyond it.</div>';
      }
      var lg = document.getElementById("legend");
      var names = ["Ingredient A: fast start", "Ingredient B: delayed", "Ingredient C: steady"];
      if (n === 1) names = ["One ingredient: quick start, then steady"];
      lg.innerHTML = names.slice(0, n).map(function (nm, idx) { return '<span><i style="background:' + COLORS[idx] + '"></i>' + nm + "</span>"; }).join("");
    }

    dose.addEventListener("input", function () { state.dose = +dose.value; doseOut.textContent = dose.value + " mg"; setRangeFill(dose); draw(); });
    setRangeFill(dose);
    segmented(durBtns, function (v) { state.dur = +v; draw(); });
    segmented(actBtns, function (v) { state.acts = +v; draw(); });
    draw();
  }

  /* ---------- Technology explorer ---------- */
  var techList = document.getElementById("tech-list");
  if (techList) {
    var items = techList.querySelectorAll(".tech-item");
    var cap = document.getElementById("tech-cap");
    var svgT = document.getElementById("tech-svg");
    function selectTech(item) {
      items.forEach(function (x) { x.setAttribute("aria-pressed", x === item ? "true" : "false"); });
      var key = item.getAttribute("data-k");
      svgT.setAttribute("data-mode", key);
      cap.textContent = item.getAttribute("data-cap");
      var spread = { swell: [0, 0, 0, 22], layers: [-30, -10, 10, 30], wells: [0, -18, 0, 0], hme: [0, 0, 0, 0] }[key];
      ["L1", "L2", "L3", "L4"].forEach(function (id, i) {
        var g = svgT.querySelector("#" + id);
        g.style.transform = "translateY(" + spread[i] + "px)";
        var hl = (key === "layers") || (key === "swell" && id === "L4") || (key === "wells" && id === "L2") || key === "hme";
        g.style.opacity = hl ? 1 : 0.35;
      });
      svgT.querySelector("#gel").style.opacity = key === "swell" ? 1 : 0;
      svgT.querySelector("#extruder").style.opacity = key === "hme" ? 1 : 0;
    }
    items.forEach(function (it) {
      it.addEventListener("click", function () { selectTech(it); });
      it.addEventListener("mouseenter", function () { selectTech(it); });
    });
    selectTech(items[0]);
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = box.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) {
          var sel = x === t;
          x.setAttribute("aria-selected", sel ? "true" : "false");
          x.tabIndex = sel ? 0 : -1;
          document.getElementById(x.getAttribute("aria-controls")).hidden = !sel;
        });
      });
      t.addEventListener("keydown", function (e) {
        var arr = Array.prototype.slice.call(tabs), i = arr.indexOf(t);
        if (e.key === "ArrowRight") { arr[(i + 1) % arr.length].click(); arr[(i + 1) % arr.length].focus(); }
        if (e.key === "ArrowLeft") { arr[(i - 1 + arr.length) % arr.length].click(); arr[(i - 1 + arr.length) % arr.length].focus(); }
      });
    });
  });

  /* ---------- Shop: gallery + order calculator ---------- */
  var gallery = document.getElementById("gallery-main");
  if (gallery) {
    var thumbs = document.querySelectorAll(".thumbs button");
    thumbs.forEach(function (b) {
      b.addEventListener("click", function () {
        thumbs.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        gallery.src = b.getAttribute("data-src");
        gallery.alt = b.getAttribute("data-alt");
      });
    });
  }
  var qtyInput = document.getElementById("qty");
  if (qtyInput) {
    var PRICE = 98, SHIP = 25, FIRST = 0.25;
    var firstBox = document.getElementById("first-order");
    function fmt(n) { return "₪" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); }
    function calc() {
      var q = Math.max(1, Math.min(20, parseInt(qtyInput.value, 10) || 1));
      qtyInput.value = q;
      var sub = q * PRICE;
      var disc = firstBox.checked ? sub * FIRST : 0;
      var ship = q >= 3 ? 0 : SHIP;
      document.getElementById("s-sub").textContent = fmt(sub);
      document.getElementById("s-disc").textContent = disc ? "−" + fmt(disc) : "—";
      document.getElementById("s-ship").textContent = ship ? fmt(ship) : "Free";
      document.getElementById("s-total").textContent = fmt(sub - disc + ship);
      document.getElementById("s-films").textContent = q * 20 + " films";
      var hint = document.getElementById("ship-hint");
      hint.textContent = q >= 3 ? "Free delivery applied for 3 packs or more." : "Add " + (3 - q) + " more pack" + (3 - q > 1 ? "s" : "") + " for free delivery.";
    }
    document.getElementById("q-minus").addEventListener("click", function () { qtyInput.value = (+qtyInput.value || 1) - 1; calc(); });
    document.getElementById("q-plus").addEventListener("click", function () { qtyInput.value = (+qtyInput.value || 1) + 1; calc(); });
    qtyInput.addEventListener("input", calc);
    firstBox.addEventListener("change", calc);
    calc();
  }

  /* ---------- Investors: business plan chart ---------- */
  var planSvg = document.getElementById("plan-chart");
  if (planSvg) {
    var YEARS = [2026, 2027, 2028, 2029, 2030];
    var DATA = {
      revenue: [744, 3304, 7223, 17789, 34610],
      gross: [318, 1857, 4986, 14128, 28949],
      ebitda: [-829, -820, 867, 9319, 23003],
      profit: [-1329, -1170, -133, 8319, 21403]
    };
    var LABEL = { revenue: "Revenue", gross: "Gross profit", ebitda: "EBITDA", profit: "Net profit / loss" };
    var tipEl = document.getElementById("plan-tip");
    var cur = "revenue";
    function drawPlan() {
      var vals = DATA[cur];
      var W = 640, H = 300, L = 56, R = 12, T = 16, B = 34;
      var max = 36000, min = cur === "revenue" || cur === "gross" ? 0 : -4000;
      var y = function (v) { return T + (max - v) / (max - min) * (H - T - B); };
      var ticks = min < 0 ? [-4000, 0, 10000, 20000, 30000] : [0, 10000, 20000, 30000];
      var bw = (W - L - R) / YEARS.length;
      var s = "";
      ticks.forEach(function (tk) {
        s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(tk) + '" y2="' + y(tk) + '" stroke="' + (tk === 0 ? "#9C9BC0" : "#E2E1F0") + '" stroke-width="1"/>' +
          '<text x="' + (L - 8) + '" y="' + (y(tk) + 4) + '" text-anchor="end" font-size="11" fill="#64658A" font-family="DM Sans, sans-serif">' + (tk === 0 ? "0" : (tk / 1000) + "M") + "</text>";
      });
      vals.forEach(function (v, i) {
        var x = L + i * bw + bw * 0.22, w = bw * 0.56;
        var y1 = y(Math.max(v, 0)), y2 = y(Math.min(v, 0));
        var fill = v < 0 ? "#D9822B" : "#5F40D9";
        s += '<rect class="bar-r" data-i="' + i + '" x="' + x + '" y="' + y1 + '" width="' + w + '" height="' + Math.max(1, y2 - y1) + '" rx="4" fill="' + fill + '" tabindex="0"/>' +
          '<text x="' + (x + w / 2) + '" y="' + (v < 0 ? y2 + 14 : y1 - 6) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#0B0B4F" font-family="DM Sans, sans-serif">' + (v / 1000).toFixed(1) + "M</text>" +
          '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" fill="#3D3E6B" font-family="DM Sans, sans-serif">' + YEARS[i] + "</text>";
      });
      planSvg.innerHTML = s;
      planSvg.querySelectorAll(".bar-r").forEach(function (r) {
        function show() { var i = +r.getAttribute("data-i"); tipEl.textContent = LABEL[cur] + " " + YEARS[i] + ": $" + DATA[cur][i].toLocaleString("en-US") + "K"; }
        r.addEventListener("mouseenter", show); r.addEventListener("focus", show);
      });
      tipEl.textContent = "Point at a bar for the exact figure. Amounts in thousands of US dollars.";
    }
    segmented(document.getElementById("plan-seg"), function (v) { cur = v; drawPlan(); });
    drawPlan();
  }

  /* ---------- Forms (static hosting: compose an email, no server) ---------- */
  document.querySelectorAll("form[data-mailto]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var to = f.getAttribute("data-mailto");
      var subject = f.getAttribute("data-subject") || "Website enquiry";
      var lines = [];
      f.querySelectorAll("input, textarea, select").forEach(function (el) {
        if (el.type === "checkbox") { lines.push(el.getAttribute("data-label") + ": " + (el.checked ? "Yes" : "No")); return; }
        if (el.name) lines.push(el.getAttribute("data-label") + ": " + el.value);
      });
      var href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      var done = f.querySelector(".notice");
      if (done) { done.hidden = false; }
      try { window.location.href = href; } catch (err) { /* ignore */ }
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copy");
      var orig = b.textContent;
      function ok() { b.textContent = "Copied"; setTimeout(function () { b.textContent = orig; }, 1400); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, function () { selectNear(b); });
      } else { selectNear(b); }
    });
  });
  function selectNear(b) {
    var code = b.parentNode.querySelector("code");
    if (!code) return;
    var range = document.createRange(); range.selectNodeContents(code);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  }

  /* ---------- Comparison bars: set widths from data-w ---------- */
  document.querySelectorAll(".bar > i[data-w]").forEach(function (b) { b.style.setProperty("--w", b.getAttribute("data-w")); });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
