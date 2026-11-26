/* =====================================================================
   Trekking Buddha — interactions
   - The Buddha (monk with saffron robe, backpack & trekking pole, styled
     after the brand logo) walks along the mountains as you scroll:
       1. in the nav "ridge bar" (whole-page progress)
       2. in the pinned #journey section (big scene, dawn → sunrise)
   - Legs only move while you scroll, so he really "walks" with you.
   ===================================================================== */
(() => {
  const WA = "919932141614";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  /* ---------------- The walking Buddha (SVG character) ---------------- */
  const SKIN = "#c98a5b", SKIN_D = "#a86d44";
  function monkSVG() {
    return `
<svg viewBox="-40 -135 80 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="m-bob">
    <g class="m-legB">
      <path d="M-4,-46 L4,-46 L3.5,-8 L-3.5,-8 Z" fill="${SKIN_D}"/>
      <path d="M-5,-9 L5,-9 Q12,-8 13,-3 L13,0 L-5,0 Z" fill="#4a2e17"/>
    </g>
    <rect x="-27" y="-100" width="18" height="46" rx="6" fill="#f2b632"/>
    <rect x="-25" y="-107" width="14" height="9" rx="4" fill="#c98a16"/>
    <rect x="-24" y="-80" width="12" height="10" rx="3" fill="#d99a1c"/>
    <path d="M-11,-96 Q2,-101 13,-95 L19,-34 Q2,-30 -17,-34 Z" fill="#f26b1d"/>
    <path d="M-8,-97 L13,-95 L-1,-58 L-12,-63 Z" fill="#d9531a"/>
    <path d="M4,-70 Q8,-52 10,-36" stroke="#d9531a" stroke-width="2" fill="none"/>
    <path d="M-10,-96 Q-2,-80 -7,-60" stroke="#8a5a10" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="m-legF">
      <path d="M-4,-46 L4,-46 L3.5,-8 L-3.5,-8 Z" fill="${SKIN}"/>
      <path d="M-5,-9 L5,-9 Q12,-8 13,-3 L13,0 L-5,0 Z" fill="#5b3a1e"/>
    </g>
    <path d="M-17,-34 Q2,-30 19,-34 L18,-38 Q2,-35 -16,-38 Z" fill="#d9531a"/>
    <rect x="0" y="-105" width="7" height="10" fill="${SKIN}"/>
    <circle cx="4" cy="-112" r="10" fill="${SKIN}"/>
    <path d="M-6,-112 Q-6,-124 5,-123 Q13,-122 14,-115 Q6,-119 -1,-111 Z" fill="#2a1a10"/>
    <circle cx="-6" cy="-119" r="4.5" fill="#2a1a10"/>
    <circle cx="10" cy="-112" r="1.2" fill="#2a1a10"/>
    <path d="M9,-106 Q11,-105 12,-107" stroke="#2a1a10" stroke-width="1" fill="none" stroke-linecap="round"/>
    <g class="m-arm">
      <line x1="11" y1="-80" x2="26" y2="0" stroke="#3b3b3b" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M3,-95 L10,-93 L13,-70 L7,-69 Z" fill="${SKIN}"/>
      <circle cx="11" cy="-70" r="3.4" fill="${SKIN}"/>
    </g>
  </g>
</svg>`;
  }

  // A walker = svg element + its current stride phase
  function makeWalker(host) {
    host.insertAdjacentHTML("beforeend", monkSVG());
    const svg = host.lastElementChild;
    return {
      svg,
      legF: $(".m-legF", svg), legB: $(".m-legB", svg), arm: $(".m-arm", svg), bob: $(".m-bob", svg),
      phase: 0, idle: 0,
    };
  }
  function poseWalker(w, dist) {
    // dist = how far he moved this frame (in px-ish units). Moving -> stride; still -> settle.
    if (Math.abs(dist) > 0.05) {
      w.phase += dist;
      w.idle = 0;
    } else {
      w.idle++;
      if (w.idle > 6) { // settle feet together
        const target = Math.round(w.phase / Math.PI) * Math.PI;
        w.phase = lerp(w.phase, target, 0.2);
      }
    }
    const s = Math.sin(w.phase);
    w.legF.setAttribute("transform", `rotate(${-26 * s} 0 -46)`);
    w.legB.setAttribute("transform", `rotate(${26 * s} 0 -46)`);
    w.arm.setAttribute("transform", `rotate(${14 * s - 4} 6 -93)`);
    w.bob.setAttribute("transform", `translate(0 ${-Math.abs(Math.cos(w.phase)) * 2.4})`);
  }

  /* ---------------- Nav: solid on scroll, burger, current link ---------------- */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open);
    links.classList.toggle("is-open", open);
  });
  $$("a", links).forEach((a) => a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }));

  /* ---------------- Ridge progress bar in the nav ---------------- */
  const ridgeH = (u) => clamp(4 + 15 * u + 4 * Math.sin(u * 18) + 2.2 * Math.sin(u * 47 + 1), 2, 27);
  (function buildRidge() {
    let d = "M0,30";
    for (let i = 0; i <= 200; i++) { const u = i / 200; d += ` L${(u * 1000).toFixed(1)},${(30 - ridgeH(u)).toFixed(2)}`; }
    d += " L1000,30 Z";
    $("#ridgeBase").setAttribute("d", d);
    $("#ridgeFill").setAttribute("d", d);
  })();
  const ridgeClip = $("#ridgeClipRect");
  const miniHost = $("#miniWalker");
  const mini = makeWalker(miniHost);

  /* ---------------- Journey scene ---------------- */
  const journey = $("#journey");
  const layerFar = $("#layerFar"), layerMid = $("#layerMid"), layerTrail = $("#layerTrail");
  const trailPath = $("#trailPath"), trailGround = $("#trailGround");
  const NS = "http://www.w3.org/2000/svg";

  // deterministic random so the mountains are the same on every visit
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // smooth path through points (Catmull-Rom -> cubic Bézier)
  function smooth(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  // Far snow range (with a towering Kanchenjunga-like massif)
  (function buildFar() {
    const pts = [[0, 520]];
    let x = 0;
    const peaks = [];
    while (x < 4000) {
      const w = 220 + rnd() * 260;
      const big = Math.abs(x - 2600) < 300;
      const py = big ? 120 + rnd() * 40 : 260 + rnd() * 200;
      const vy = 470 + rnd() * 90;
      peaks.push({ l: [x, pts[pts.length - 1][1]], p: [x + w * 0.5, py], r: [x + w, vy] });
      pts.push([x + w * 0.5, py], [x + w, vy]);
      x += w;
    }
    let d = `M0,1000 L${pts.map((p) => p.join(",")).join(" L")} L4000,1000 Z`;
    const peak = document.createElementNS(NS, "path");
    peak.setAttribute("d", d); peak.setAttribute("class", "peak");
    layerFar.appendChild(peak);
    peaks.forEach(({ l, p, r }) => {
      const t = p[1] < 200 ? 0.42 : 0.28;
      const a = [p[0] + (l[0] - p[0]) * t, p[1] + (l[1] - p[1]) * t];
      const b = [p[0] + (r[0] - p[0]) * t, p[1] + (r[1] - p[1]) * t];
      const zig = [];
      for (let i = 1; i < 5; i++) {
        const u = i / 5;
        zig.push([lerp(b[0], a[0], u), lerp(b[1], a[1], u) - (i % 2 ? 18 : -6)]);
      }
      const snow = document.createElementNS(NS, "path");
      snow.setAttribute("d", `M${p.join(",")} L${b.join(",")} L${zig.map((z) => z.map((n) => n.toFixed(1)).join(",")).join(" L")} L${a.join(",")} Z`);
      snow.setAttribute("class", "snow");
      layerFar.appendChild(snow);
    });
  })();

  // Mid forested ridges
  (function buildMid() {
    const pts = [];
    for (let x = 0; x <= 4000; x += 160) pts.push([x, 560 + Math.sin(x / 330) * 50 + rnd() * 40]);
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `${smooth(pts)} L4000,1000 L0,1000 Z`);
    layerMid.appendChild(p);
  })();

  // Foreground trail the Buddha walks on
  const TRAIL = [[0, 880], [250, 870], [500, 840], [750, 800], [950, 730], [1150, 680], [1350, 700], [1550, 740], [1750, 700], [1950, 640],
    [2150, 580], [2350, 555], [2550, 590], [2750, 630], [2950, 590], [3150, 520], [3350, 460], [3550, 425], [3750, 420], [4000, 430]];
  // keep the trail in the lower part of the frame (y 880 → ~580)
  TRAIL.forEach((p) => { p[1] = Math.round(880 - (880 - p[1]) * 0.65); });
  const trailD = smooth(TRAIL);
  trailGround.setAttribute("d", `${trailD} L4000,1000 L0,1000 Z`);
  trailGround.insertAdjacentHTML("afterend", `<defs><linearGradient id="groundShine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd9a8" stop-opacity=".16"/><stop offset=".35" stop-color="#ffd9a8" stop-opacity="0"/></linearGradient></defs>
    <path class="trail__shine" d="${trailD} L4000,1000 L0,1000 Z"/>`);
  trailPath.setAttribute("d", smooth(TRAIL.map(([x, y]) => [x, y + 14])));
  const groundForSampling = document.createElementNS(NS, "path");
  groundForSampling.setAttribute("d", trailD);
  layerTrail.appendChild(groundForSampling);
  groundForSampling.setAttribute("fill", "none");
  const yAt = (x) => { // ridge height at x (binary search over the curve)
    const L = trailLen;
    let lo = 0, hi = L;
    for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; groundForSampling.getPointAtLength(m).x < x ? (lo = m) : (hi = m); }
    return groundForSampling.getPointAtLength(lo).y;
  };
  const trailLen = groundForSampling.getTotalLength();

  // Pines, prayer flags and a summit cairn
  (function decorate() {
    const decor = $("#trailDecor");
    let html = "";
    for (let x = 120; x < 1900; x += 55 + rnd() * 70) {
      if (Math.abs(x - 1150) < 90) continue;
      const y = yAt(x) + 14, h = 70 + rnd() * 70, w = h * 0.42;
      html += `<g class="tree"><rect x="${x - 3}" y="${y - h * 0.25}" width="6" height="${h * 0.25}"/>
        <path d="M${x},${y - h} L${x + w * 0.6},${y - h * 0.55} L${x + w * 0.35},${y - h * 0.55} L${x + w},${y - h * 0.15} L${x - w},${y - h * 0.15} L${x - w * 0.35},${y - h * 0.55} L${x - w * 0.6},${y - h * 0.55} Z"/></g>`;
    }
    const COLORS = ["#2f6fdc", "#f4f4f4", "#e23b3b", "#2fae5b", "#f2c230"];
    const flags = (x1, x2) => {
      const y1 = yAt(x1), y2 = yAt(x2), top1 = y1 - 120, top2 = y2 - 120;
      let s = `<line class="pole" x1="${x1}" y1="${y1 + 6}" x2="${x1}" y2="${top1 - 10}"/><line class="pole" x1="${x2}" y1="${y2 + 6}" x2="${x2}" y2="${top2 - 10}"/>`;
      const cx = (x1 + x2) / 2, cy = Math.max(top1, top2) + 40;
      s += `<path class="flag-line" d="M${x1},${top1} Q${cx},${cy} ${x2},${top2}"/>`;
      const n = Math.floor((x2 - x1) / 26);
      for (let i = 1; i < n; i++) {
        const t = i / n, fx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, fy = (1 - t) ** 2 * top1 + 2 * (1 - t) * t * cy + t * t * top2;
        s += `<path d="M${fx - 8},${fy} L${fx + 8},${fy} L${fx},${fy + 20} Z" fill="${COLORS[i % 5]}" opacity=".9"/>`;
      }
      return s;
    };
    html += flags(1060, 1260) + flags(2260, 2460) + flags(3460, 3700);
    const sx = 3820, sy = yAt(sx);
    html += `<path d="M${sx - 26},${sy + 4} L${sx - 18},${sy - 14} L${sx + 18},${sy - 14} L${sx + 26},${sy + 4} Z M${sx - 14},${sy - 14} L${sx - 9},${sy - 30} L${sx + 9},${sy - 30} L${sx + 14},${sy - 14} Z M${sx - 6},${sy - 30} L${sx},${sy - 42} L${sx + 6},${sy - 30} Z" fill="#555a6e"/>`;
    decor.innerHTML = html;
  })();

  // Stars
  (function stars() {
    const host = $("#stars");
    let s = "";
    for (let i = 0; i < 90; i++) s += `<i style="left:${(rnd() * 100).toFixed(2)}%;top:${(rnd() * 100).toFixed(2)}%;animation-delay:${(rnd() * 3).toFixed(2)}s;transform:scale(${(0.5 + rnd()).toFixed(2)})"></i>`;
    host.innerHTML = s;
  })();

  // The big walker lives inside the trail SVG
  const bigG = $("#bigWalker");
  const bigHost = document.createElementNS(NS, "g");
  bigG.appendChild(bigHost);
  // nest the monk <svg> so it uses its own viewBox; size it in trail units
  const big = makeWalker(bigHost);
  big.svg.setAttribute("width", "110"); big.svg.setAttribute("height", "192");
  big.svg.setAttribute("x", "-55"); big.svg.setAttribute("y", "-186");
  big.svg.setAttribute("overflow", "visible");

  // Sky / colour keyframes: night → pre-dawn → dawn → summit sunrise
  const KEYS = [
    { t: 0, top: "#070b1c", mid: "#141c3d", low: "#2c2f5a", far: "#232b55", snow: "#aeb6d8", midL: "#141b36", near: "#0a0f1e" },
    { t: .5, top: "#1b1f4a", mid: "#4a3b6b", low: "#b0607a", far: "#3a3f70", snow: "#d9c6d8", midL: "#232650", near: "#0f1428" },
    { t: .8, top: "#2d4a8a", mid: "#d9826a", low: "#ffb36b", far: "#6c6a9a", snow: "#ffd9bf", midL: "#3a3360", near: "#17182e" },
    { t: 1, top: "#4f7fc4", mid: "#f0a87a", low: "#ffd59a", far: "#7d8fc0", snow: "#ffe6cc", midL: "#3e4a7a", near: "#1b2140" },
  ];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`; };
  function palette(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
    const a = KEYS[i], b = KEYS[i + 1], t = clamp((p - a.t) / (b.t - a.t), 0, 1);
    const o = {};
    for (const k of ["top", "mid", "low", "far", "snow", "midL", "near"]) o[k] = mix(a[k], b[k], t);
    return o;
  }

  const STEPS = [
    { k: "01 / 05 · The first step", t: "Every summit begins at the trailhead.", x: "Keep scrolling — walk with the Trekking Buddha from forest trails to the high Himalaya." },
    { k: "02 / 05 · 950 days", t: "A journey that began on two wheels.", x: "Founder Jyotishko Biswas cycled across India for nearly 950 days and walked 35+ treks along the way." },
    { k: "03 / 05 · HMI & NIMAS trained", t: "Certified mountaineers. Registered guides.", x: "Trained at India's most respected mountaineering institutes — and a medical team on every trail." },
    { k: "04 / 05 · 1,252 trekkers", t: "Above the clouds, together.", x: "331 trekkers in 2024. 444 in 2025. 477 in 2026. Every booking supports families in remote villages." },
    { k: "05 / 05 · Summit sunrise", t: "Your summit is next.", x: "Sandakphu, Mardi Himal, Annapurna Base Camp — winter 2026–27 departures are open now.", cta: true },
  ];
  const hudSteps = $("#hudSteps");
  hudSteps.innerHTML = STEPS.map(() => "<i></i>").join("");
  const panel = $("#journeyPanel");
  let currentStep = -1;
  function setStep(i) {
    if (i === currentStep) return;
    currentStep = i;
    panel.classList.add("is-swapping");
    setTimeout(() => {
      const s = STEPS[i];
      $("#panelKicker").textContent = s.k;
      $("#panelTitle").textContent = s.t;
      $("#panelText").textContent = s.x;
      $("#panelCta").hidden = !s.cta;
      panel.classList.remove("is-swapping");
    }, reduceMotion ? 0 : 220);
    $$("i", hudSteps).forEach((el, j) => el.classList.toggle("on", j <= i));
  }
  setStep(0);

  const sky = $("#sky"), altVal = $("#altVal");
  let jTarget = 0, jCur = 0, lastBigX = null;

  function journeyProgress() {
    const r = journey.getBoundingClientRect();
    const total = journey.offsetHeight - window.innerHeight;
    return clamp(-r.top / total, 0, 1);
  }

  function renderJourney(p) {
    // Buddha position along trail
    const len = lerp(trailLen * 0.03, trailLen * 0.955, p);
    const pt = groundForSampling.getPointAtLength(len);
    const ahead = groundForSampling.getPointAtLength(Math.min(trailLen, len + 20));
    const slope = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180 / Math.PI;
    bigG.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${(pt.y + 6).toFixed(1)}) rotate(${(slope * 0.35).toFixed(2)})`);
    const dx = lastBigX == null ? 0 : pt.x - lastBigX;
    lastBigX = pt.x;
    poseWalker(big, dx / 26);

    // Camera follows him, layers parallax
    const vw = window.innerWidth;
    const svgW = layerTrail.clientWidth, svgH = layerTrail.clientHeight;
    const scale = Math.max(svgW / 4000, svgH / 1000);
    const camX = clamp(pt.x * scale - vw * 0.42, 0, Math.max(0, svgW - vw));
    layerTrail.style.transform = `translate3d(${-camX}px,0,0)`;
    layerMid.style.transform = `translate3d(${-camX * 0.6}px,0,0)`;
    layerFar.style.transform = `translate3d(${-camX * 0.32}px,0,0)`;

    // Sky & colours
    const c = palette(p);
    const st = sky.style, root = journey.style;
    st.setProperty("--sky-top", c.top); st.setProperty("--sky-mid", c.mid); st.setProperty("--sky-low", c.low);
    st.setProperty("--stars", clamp(1 - p / 0.72, 0, 1).toFixed(3));
    st.setProperty("--sun-y", `${lerp(98, 30, clamp((p - 0.55) / 0.45, 0, 1)).toFixed(2)}%`);
    st.setProperty("--sun-o", clamp((p - 0.55) / 0.25, 0, 1).toFixed(3));
    root.setProperty("--far", c.far); root.setProperty("--far-snow", c.snow); root.setProperty("--mid", c.midL);
    root.setProperty("--near", c.near); root.setProperty("--tree", c.near);

    // HUD
    altVal.textContent = Math.round(lerp(1800, 5364, p)).toLocaleString("en-IN");
    setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999)));
  }

  /* ---------------- Main loop ---------------- */
  let pageCur = 0, lastMiniX = null;
  function frame() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pageTarget = docH > 0 ? clamp(window.scrollY / docH, 0, 1) : 0;
    jTarget = journeyProgress();
    const ease = reduceMotion ? 1 : 0.14;
    pageCur = lerp(pageCur, pageTarget, ease);
    jCur = lerp(jCur, jTarget, ease);
    if (Math.abs(pageCur - pageTarget) < 1e-5) pageCur = pageTarget;
    if (Math.abs(jCur - jTarget) < 1e-5) jCur = jTarget;

    // ridge bar
    ridgeClip.setAttribute("width", (pageCur * 1000).toFixed(1));
    const W = miniHost.parentElement.clientWidth;
    const mx = pageCur * W;
    miniHost.style.transform = `translate(${(mx - 13).toFixed(1)}px, ${(-ridgeH(pageCur) + 2).toFixed(1)}px)`;
    poseWalker(mini, lastMiniX == null ? 0 : (mx - lastMiniX) / 7);
    lastMiniX = mx;

    renderJourney(jCur);
    nav.classList.toggle("is-solid", window.scrollY > 40);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------- Treks ---------------- */
  const TREKS = [
    { n: "Sandakphu – Phalut", c: "india", r: "West Bengal", img: "sandakphu", d: "Walk to the Sleeping Buddha view · 3,636 m" },
    { n: "Mardi Himal", c: "nepal", r: "Nepal", img: "mardi-himal", d: "Face-to-face with Machapuchare (Mt Fishtail)" },
    { n: "Annapurna Base Camp", c: "nepal", r: "Nepal", img: "annapurna-base-camp", d: "Into the Annapurna amphitheatre · 4,130 m" },
    { n: "Everest Base Camp", c: "nepal", r: "Nepal", img: "everest-base-camp", d: "At the foot of the world's highest peak · 5,364 m" },
    { n: "Goechala Trek", c: "india", r: "Sikkim", img: "goechala", d: "Kanchenjunga, up close and golden at dawn" },
    { n: "Annapurna Circuit", c: "nepal", r: "Nepal", img: "annapurna-circuit", d: "Cross the legendary Thorong La · 5,416 m" },
    { n: "Manaslu Circuit", c: "nepal", r: "Nepal", img: "manaslu-circuit", d: "Remote, wild and quiet · Larke Pass 5,106 m" },
    { n: "Dzükou Valley", c: "india", r: "Nagaland", img: "dzukou-valley", d: "Rolling green meadows of the Northeast" },
    { n: "Silent Valley", c: "india", r: "India", img: "silent-valley", d: "Offbeat village trails and local hospitality" },
  ];
  const grid = $("#trekGrid");
  grid.innerHTML = TREKS.map((t) => `
    <a class="trek reveal" data-c="${t.c}" href="${waLink(`Hi Trekking Buddha! I'd like details for the ${t.n} trek.`)}" target="_blank" rel="noopener">
      <img src="assets/img/treks/${t.img}.webp" alt="${t.n} trek" loading="lazy" />
      <span class="trek__region">${t.r}</span>
      <div class="trek__body"><h3>${t.n}</h3><p>${t.d}</p><span class="trek__cta">Get the details</span></div>
    </a>`).join("");
  $$(".chip[data-filter]").forEach((chip) => chip.addEventListener("click", () => {
    $$(".chip[data-filter]").forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-selected", c === chip); });
    const f = chip.dataset.filter;
    $$(".trek", grid).forEach((el) => el.classList.toggle("is-hidden", f !== "all" && el.dataset.c !== f));
  }));
  const sel = $("#trekSelect");
  TREKS.forEach((t) => sel.insertAdjacentHTML("beforeend", `<option>${t.n}</option>`));

  /* ---------------- Departures -> WhatsApp ---------------- */
  $$(".date").forEach((b) => b.addEventListener("click", () => {
    window.open(waLink(`Hi Trekking Buddha! I'd like to reserve a seat on the ${b.dataset.trek} (${b.dataset.date}).`), "_blank", "noopener");
  }));

  /* ---------------- Gallery ---------------- */
  const YEARS = {
    2024: { imgs: [1, 2, 3, 4, 6], cap: "Frames from the Trail — 331 trekkers walked with us in 2024." },
    2025: { imgs: [9, 8, 17, 13, 18], cap: "Altitude & Aperture — 444 trekkers walked with us in 2025." },
    2026: { imgs: [20, 21, 22, 23, 25], cap: "Footsteps & Frames — 477 trekkers walked with us in 2026." },
  };
  const gallery = $("#gallery"), lb = $("#lightbox"), lbImg = $("#lightboxImg");
  function showYear(y) {
    gallery.innerHTML = YEARS[y].imgs.map((n, i) => `<button style="animation-delay:${i * 60}ms" data-src="assets/img/gallery/${n}.webp" aria-label="Open photo"><img src="assets/img/gallery/${n}.webp" alt="Trekking Buddha group on the trail, ${y}" loading="lazy" /></button>`).join("");
    $("#galleryCaption").textContent = YEARS[y].cap;
  }
  showYear(2026);
  $$(".chip[data-year]").forEach((chip) => chip.addEventListener("click", () => {
    $$(".chip[data-year]").forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-selected", c === chip); });
    showYear(chip.dataset.year);
  }));
  gallery.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    lbImg.src = b.dataset.src; lb.hidden = false;
  });
  lb.addEventListener("click", () => { lb.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.hidden = true; });

  /* ---------------- Enquiry form -> WhatsApp ---------------- */
  $("#enquiry").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hi Trekking Buddha! 🙏\nName: ${f.get("name")}\nTrek: ${f.get("trek")}\nMonth: ${f.get("month") || "-"}\nGroup size: ${f.get("size")}\n${f.get("msg") || ""}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------------- Reveal + counters ---------------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  const cio = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = reduceMotion ? 0 : 1600;
    const tick = (now) => {
      const k = dur ? clamp((now - t0) / dur, 0, 1) : 1;
      el.textContent = Math.round(to * (1 - (1 - k) ** 3)).toLocaleString("en-IN") + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  // current section highlight in nav
  const sio = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) $$("a", links).forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${en.target.id}`));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => sio.observe(s));
})();
