import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { Mountains } from "./Mountains";
import { BODY, DISPLAY, GOLD, LogoBadge, SAFFRON } from "./Promo";

const Chip: React.FC<{ children: React.ReactNode; u: number }> = ({ children, u }) => (
  <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 22 * u, padding: `${10 * u}px ${20 * u}px`, borderRadius: 99, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}>{children}</span>
);

/** Wide hero banner: Facebook cover, YouTube channel art, website hero. */
export const HeroBanner: React.FC<{ safe?: { w: number; h: number } }> = ({ safe }) => {
  const { width: W, height: H } = useVideoConfig();
  // area that must contain the text (YouTube shows only the centre on mobile)
  const box = safe ?? { w: W, h: H };
  const u = box.h / 624;
  return (
    <AbsoluteFill>
      <Mountains width={W} height={H} cam={W * 3.6} dawn={0.92} walkerPhase={0.7} walkerX={0.5 + (box.w / W) * 0.32} flags={!!safe} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,12,22,.75) 0%, rgba(8,12,22,.35) 45%, rgba(8,12,22,0) 70%)" }} />
      <div style={{ position: "absolute", left: (W - box.w) / 2, top: (H - box.h) / 2, width: box.w, height: box.h, display: "flex", alignItems: "center", gap: 40 * u, padding: `0 ${60 * u}px` }}>
        <LogoBadge size={200 * u} />
        <div style={{ color: "#fff" }}>
          <div style={{ fontFamily: BODY, color: GOLD, fontWeight: 700, letterSpacing: "0.28em", fontSize: 20 * u }}>NEPAL · INDIA · SINCE 2021</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 78 * u, lineHeight: 1.02, margin: `${10 * u}px 0 ${18 * u}px` }}>
            Walk the Himalayas.<br /><span style={{ color: "#ffb37a", fontStyle: "italic", fontWeight: 600 }}>Find your stillness.</span>
          </div>
          <div style={{ display: "flex", gap: 10 * u, flexWrap: "wrap" }}>
            <Chip u={u}>Certified Mountaineer</Chip><Chip u={u}>Registered Guide</Chip><Chip u={u}>Medical Team</Chip>
          </div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24 * u, marginTop: 18 * u }}>
            <span style={{ background: "#25d366", padding: `${8 * u}px ${18 * u}px`, borderRadius: 99 }}>WhatsApp +91 99321 41614</span>
            <span style={{ marginLeft: 16 * u, opacity: 0.9 }}>trekkingbuddha.com</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Instagram 4:5 post: winter departures. */
export const DeparturesPost: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  const u = W / 1080;
  const rows = [
    { n: "Annapurna Base Camp", d: "Dec 05–14 · Dec 26–Jan 04", img: "img/treks/annapurna-base-camp.webp" },
    { n: "Sandakphu – Phalut", d: "Dec 26–Jan 01 · Jan 02–08 · Jan 23–29", img: "img/treks/sandakphu.webp" },
    { n: "Mardi Himal", d: "Dec 28 – Jan 02", img: "img/treks/mardi-himal.webp" },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${H * 0.13}px)` }}>
        <Mountains width={W} height={H} cam={W * 2.2} dawn={0.7} walkerPhase={0.6} walkerX={0.8} flags={false} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,12,22,.85) 0%, rgba(8,12,22,.55) 60%, rgba(8,12,22,0) 85%)" }} />
      <AbsoluteFill style={{ padding: 70 * u, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 * u }}>
          <LogoBadge size={120 * u} />
          <div style={{ fontFamily: BODY, color: GOLD, fontWeight: 700, letterSpacing: "0.28em", fontSize: 24 * u }}>WINTER 2026 – 27</div>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 88 * u, lineHeight: 1.02, margin: `${36 * u}px 0 ${40 * u}px` }}>
          Next departures.<br /><span style={{ color: SAFFRON, fontStyle: "italic" }}>Seats are limited.</span>
        </div>
        <div style={{ display: "grid", gap: 20 * u }}>
          {rows.map((r) => (
            <div key={r.n} style={{ display: "flex", gap: 24 * u, alignItems: "center", padding: 18 * u, borderRadius: 24 * u, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)" }}>
              <Img src={staticFile(r.img)} style={{ width: 120 * u, height: 120 * u, objectFit: "cover", borderRadius: 18 * u }} />
              <div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 44 * u }}>{r.n}</div>
                <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 26 * u, color: "#ffc28f" }}>{r.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34 * u, fontFamily: BODY, fontWeight: 700, fontSize: 30 * u }}>
          <span style={{ background: "#25d366", padding: `${12 * u}px ${24 * u}px`, borderRadius: 99 }}>Book: +91 99321 41614</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
