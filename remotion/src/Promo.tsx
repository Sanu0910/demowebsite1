import React from "react";
import {
  AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { Mountains } from "./Mountains";

// Fonts are bundled in public/fonts so renders work offline
export const DISPLAY = "Fraunces";
export const BODY = "Inter";
const FONTS: [string, string, string, string][] = [
  [DISPLAY, "fraunces-latin-600-normal.woff2", "600", "normal"],
  [DISPLAY, "fraunces-latin-800-normal.woff2", "800", "normal"],
  [DISPLAY, "fraunces-latin-600-italic.woff2", "600", "italic"],
  [BODY, "inter-latin-400-normal.woff2", "400", "normal"],
  [BODY, "inter-latin-600-normal.woff2", "600", "normal"],
  [BODY, "inter-latin-700-normal.woff2", "700", "normal"],
];
FONTS.forEach(([family, file, weight, style]) => loadFont({ family, url: staticFile(`fonts/${file}`), weight, style }));
export const SAFFRON = "#f26b1d";
export const GOLD = "#f2b632";

export const LogoBadge: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  // The original Trekking Buddha logo, unchanged, on a white badge so its dark lettering stays readable.
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 10px 40px rgba(0,0,0,.35)", ...style }}>
    <Img src={staticFile("brand/logo.png")} style={{ width: "92%" }} />
  </div>
);

const useUnit = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, u: Math.min(width, height) / 1080, vertical: height > width };
};

/* ---------- Scene 1: logo over night mountains ---------- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, u } = useUnit();
  const pop = spring({ frame: f, fps, config: { damping: 12 } });
  const txt = interpolate(f, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mountains width={W} height={H} cam={interpolate(f, [0, 90], [0, W * 0.15])} dawn={0.05} showWalker={false} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 * u, paddingBottom: H * 0.18 }}>
        <LogoBadge size={300 * u} style={{ transform: `scale(${pop})` }} />
        <div style={{ opacity: txt, transform: `translateY(${(1 - txt) * 30}px)`, textAlign: "center", color: "#f5f1ea" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 92 * u, lineHeight: 1 }}>
            Trekking <span style={{ color: SAFFRON, fontStyle: "italic" }}>Buddha</span>
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: "0.3em", fontSize: 26 * u, color: GOLD, marginTop: 20 * u }}>NEPAL · INDIA · SINCE 2021</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Scene 2: the Buddha walks the mountains ---------- */
const Walk: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { W, H, u, vertical } = useUnit();
  const cam = interpolate(f, [0, dur], [W * 0.15, W * 2.2]);
  const dawn = interpolate(f, [0, dur], [0.08, 0.6]);
  const a = interpolate(f, [8, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(f, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const alt = Math.round(interpolate(f, [0, dur], [1800, 3900]));
  return (
    <AbsoluteFill>
      <Mountains width={W} height={H} cam={cam} dawn={dawn} walkerPhase={f * 0.33} walkerX={vertical ? 0.45 : 0.4} />
      <AbsoluteFill style={{ padding: vertical ? `${H * 0.12}px ${70 * u}px` : `${110 * u}px ${130 * u}px`, color: "#f5f1ea" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: (vertical ? 120 : 110) * u, lineHeight: 1.02, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
          Walk the<br />Himalayas.
        </div>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: (vertical ? 84 : 76) * u, color: "#ff8a3d", marginTop: 14 * u, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
          Find your stillness.
        </div>
        <div style={{ marginTop: 40 * u, fontFamily: BODY, opacity: b }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 64 * u }}>{alt.toLocaleString("en-IN")}</span>
          <span style={{ color: GOLD, fontSize: 30 * u }}> m</span>
          <div style={{ letterSpacing: "0.3em", fontSize: 20 * u, color: "#9aa7bd" }}>ALTITUDE</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Scene 3: trek photos ---------- */
const TREKS = [
  { img: "img/treks/sandakphu.webp", n: "Sandakphu – Phalut", d: "Sleeping Buddha view · 3,636 m", r: "INDIA" },
  { img: "img/treks/mardi-himal.webp", n: "Mardi Himal", d: "Face-to-face with Mt Fishtail", r: "NEPAL" },
  { img: "img/treks/annapurna-base-camp.webp", n: "Annapurna Base Camp", d: "The Annapurna amphitheatre · 4,130 m", r: "NEPAL" },
  { img: "img/treks/everest-base-camp.webp", n: "Everest Base Camp", d: "Foot of the world's highest peak · 5,364 m", r: "NEPAL" },
];
const TrekCard: React.FC<{ t: (typeof TREKS)[number]; dur: number; i: number }> = ({ t, dur, i }) => {
  const f = useCurrentFrame();
  const { u, vertical } = useUnit();
  const fade = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, dur], [1.04, 1.16]);
  const slide = interpolate(f, [4, 18], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#0b1220" }}>
      <Img src={staticFile(t.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${(i % 2 ? -1 : 1) * (zoom - 1) * 80}px)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,12,22,.35) 0%, rgba(8,12,22,0) 35%, rgba(8,12,22,.92) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: vertical ? `${260 * u}px ${70 * u}px` : `${100 * u}px ${130 * u}px`, color: "#fff" }}>
        <div style={{ transform: `translateY(${slide}px)` }}>
          <div style={{ display: "inline-block", fontFamily: BODY, fontWeight: 700, letterSpacing: "0.18em", fontSize: 22 * u, padding: `${8 * u}px ${18 * u}px`, borderRadius: 99, background: "rgba(255,255,255,.18)", marginBottom: 20 * u }}>{t.r}</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 96 * u, lineHeight: 1.02 }}>{t.n}</div>
          <div style={{ fontFamily: BODY, fontSize: 34 * u, opacity: 0.88, marginTop: 14 * u }}>{t.d}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: vertical ? 140 * u : 60 * u, left: vertical ? 70 * u : 130 * u, fontFamily: BODY, color: GOLD, fontWeight: 700, letterSpacing: "0.3em", fontSize: 22 * u }}>
        TREKS 2027 · {String(i + 1).padStart(2, "0")}/04
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 4: departures ---------- */
const DEPS = [
  { n: "Annapurna Base Camp", d: ["Dec 05 – 14", "Dec 26 – Jan 04"] },
  { n: "Sandakphu – Phalut", d: ["Dec 26 – Jan 01", "Jan 02 – 08", "Jan 23 – 29"] },
  { n: "Mardi Himal", d: ["Dec 28 – Jan 02"] },
];
const Departures: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, vertical } = useUnit();
  return (
    <AbsoluteFill style={{ background: "#0b1220" }}>
      <Img src={staticFile("img/photos/camp.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.28, transform: `scale(${1.1 + f * 0.0012})` }} />
      <AbsoluteFill style={{ padding: vertical ? `${220 * u}px ${70 * u}px` : `${90 * u}px ${130 * u}px`, color: "#f5f1ea", justifyContent: "center" }}>
        <div style={{ fontFamily: BODY, color: GOLD, fontWeight: 700, letterSpacing: "0.3em", fontSize: 24 * u }}>WINTER 2026 – 27</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 92 * u, lineHeight: 1.05, margin: `${16 * u}px 0 ${50 * u}px` }}>
          Next departures. <span style={{ color: SAFFRON, fontStyle: "italic" }}>Seats are limited.</span>
        </div>
        <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 28 * u }}>
          {DEPS.map((d, i) => {
            const s = spring({ frame: f - 10 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={d.n} style={{ flex: 1, padding: 34 * u, borderRadius: 28 * u, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 46 * u, marginBottom: 20 * u }}>{d.n}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 * u }}>
                  {d.d.map((x) => (
                    <span key={x} style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28 * u, padding: `${10 * u}px ${18 * u}px`, borderRadius: 14 * u, background: SAFFRON, color: "#fff" }}>{x}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Scene 5: summit sunrise + CTA ---------- */
const Summit: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, u, vertical } = useUnit();
  const walkT = interpolate(f, [0, 45], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const cam = W * 3.55 + walkT * W * 0.25;
  const phase = walkT < 1 ? f * 0.33 : Math.round((45 * 0.33) / Math.PI) * Math.PI;
  const dawn = interpolate(f, [0, dur * 0.6], [0.75, 1], { extrapolateRight: "clamp" });
  const s = spring({ frame: f - 15, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Mountains width={W} height={H} cam={cam} dawn={dawn} walkerPhase={phase} walkerX={vertical ? 0.55 : 0.62} />
      <AbsoluteFill style={{ alignItems: vertical ? "center" : "flex-start", justifyContent: "flex-start", padding: vertical ? `${180 * u}px ${60 * u}px` : `${100 * u}px ${130 * u}px`, textAlign: vertical ? "center" : "left" }}>
        <div style={{ opacity: s, transform: `translateY(${(1 - s) * 40}px)`, color: "#fff", display: "flex", flexDirection: "column", alignItems: vertical ? "center" : "flex-start", gap: 24 * u }}>
          <LogoBadge size={170 * u} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 104 * u, lineHeight: 1.02, textShadow: "0 4px 30px rgba(0,0,0,.25)" }}>
            Your summit<br /><span style={{ fontStyle: "italic", color: "#fff1d6" }}>is calling.</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16 * u, fontFamily: BODY, fontWeight: 700, fontSize: 38 * u, padding: `${22 * u}px ${36 * u}px`, borderRadius: 99, background: "#25d366", boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}>
            WhatsApp +91 99321 41614
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30 * u, letterSpacing: "0.08em", color: "#0b1220", background: "rgba(255,255,255,.85)", padding: `${8 * u}px ${20 * u}px`, borderRadius: 12 * u }}>trekkingbuddha.com</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- The full promo ---------- */
export const PROMO_FRAMES = 600;
export const Promo: React.FC = () => {
  const T = 45;
  return (
    <AbsoluteFill style={{ background: "#0b1220" }}>
      <Sequence durationInFrames={90}><Intro /></Sequence>
      <Sequence from={90} durationInFrames={150}><Walk dur={150} /></Sequence>
      {TREKS.map((t, i) => (
        <Sequence key={t.n} from={240 + i * T} durationInFrames={T}><TrekCard t={t} dur={T} i={i} /></Sequence>
      ))}
      <Sequence from={420} durationInFrames={90}><Departures /></Sequence>
      <Sequence from={510} durationInFrames={90}><Summit dur={90} /></Sequence>
    </AbsoluteFill>
  );
};
