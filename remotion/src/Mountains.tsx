import React, { useMemo } from "react";
import { random } from "remotion";
import { Monk } from "./Monk";

/* Colour keyframes: night → pre-dawn → dawn → summit sunrise (same as the website) */
const KEYS = [
  { t: 0, top: "#070b1c", mid: "#141c3d", low: "#2c2f5a", far: "#232b55", snow: "#aeb6d8", midL: "#141b36", near: "#0a0f1e" },
  { t: 0.5, top: "#1b1f4a", mid: "#4a3b6b", low: "#b0607a", far: "#3a3f70", snow: "#d9c6d8", midL: "#232650", near: "#0f1428" },
  { t: 0.8, top: "#2d4a8a", mid: "#d9826a", low: "#ffb36b", far: "#6c6a9a", snow: "#ffd9bf", midL: "#3a3360", near: "#17182e" },
  { t: 1, top: "#4f7fc4", mid: "#f0a87a", low: "#ffd59a", far: "#7d8fc0", snow: "#ffe6cc", midL: "#3e4a7a", near: "#1b2140" },
] as const;
type Pal = { top: string; mid: string; low: string; far: string; snow: string; midL: string; near: string };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`;
};
export function palette(p: number): Pal {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
  const a = KEYS[i], b = KEYS[i + 1], t = clamp((p - a.t) / (b.t - a.t), 0, 1);
  const o = {} as Pal;
  (Object.keys(a) as (keyof Pal | "t")[]).forEach((k) => {
    if (k !== "t") o[k] = mix(a[k], b[k], t);
  });
  return o;
}

/** Height of the walking ridge at world-x (gently climbing to a summit). */
export const nearY = (x: number, W: number, H: number) =>
  H * (0.84 - 0.05 * Math.sin(x / (W * 0.45)) - 0.03 * Math.sin(x / (W * 0.17) + 1.3) - 0.12 * clamp(x / (W * 3.2), 0, 1));

const WORLD = 5; // world is 5 screens wide

export const Mountains: React.FC<{
  width: number;
  height: number;
  cam: number; // camera x in px (world units)
  dawn: number; // 0 night … 1 sunrise
  walkerPhase?: number;
  walkerX?: number; // screen fraction where the Buddha walks
  showWalker?: boolean;
  flags?: boolean;
}> = ({ width: W, height: H, cam, dawn, walkerPhase = 0, walkerX = 0.4, showWalker = true, flags = true }) => {
  const c = palette(dawn);

  const { far, snow, mid, near, trees, flagEls } = useMemo(() => {
    // far snow range
    const pts: [number, number][] = [[0, H * 0.55]];
    const caps: string[] = [];
    let x = 0, k = 0;
    while (x < W * WORLD) {
      const w = W * (0.16 + random(`w${k}`) * 0.18);
      const big = random(`b${k}`) > 0.8;
      const py = H * (big ? 0.2 + random(`p${k}`) * 0.05 : 0.3 + random(`p${k}`) * 0.14);
      const vy = H * (0.5 + random(`v${k}`) * 0.08);
      const l = pts[pts.length - 1];
      const p: [number, number] = [x + w * 0.5, py];
      const r: [number, number] = [x + w, vy];
      const t = big ? 0.4 : 0.28;
      const a = [p[0] + (l[0] - p[0]) * t, p[1] + (l[1] - p[1]) * t];
      const b = [p[0] + (r[0] - p[0]) * t, p[1] + (r[1] - p[1]) * t];
      const zig = [1, 2, 3, 4].map((i) => [lerp(b[0], a[0], i / 5), lerp(b[1], a[1], i / 5) - (i % 2 ? H * 0.018 : -H * 0.006)]);
      caps.push(`M${p.join(",")} L${b.join(",")} L${zig.map((z) => z.join(",")).join(" L")} L${a.join(",")} Z`);
      pts.push(p, r);
      x += w;
      k++;
    }
    const farD = `M0,${H} L${pts.map((p) => p.join(",")).join(" L")} L${W * WORLD},${H} Z`;

    // mid ridges
    let midD = `M0,${H}`;
    for (let i = 0; i <= 200; i++) {
      const xx = (i / 200) * W * WORLD;
      midD += ` L${xx},${H * (0.62 + 0.04 * Math.sin(xx / (W * 0.3)) + 0.02 * Math.sin(xx / (W * 0.07)))}`;
    }
    midD += ` L${W * WORLD},${H} Z`;

    // near walking ridge
    let nearD = `M0,${H}`;
    for (let i = 0; i <= 400; i++) {
      const xx = (i / 400) * W * WORLD;
      nearD += ` L${xx.toFixed(1)},${nearY(xx, W, H).toFixed(1)}`;
    }
    nearD += ` L${W * WORLD},${H} Z`;

    // pines
    const tr: string[] = [];
    for (let i = 0; i < 70; i++) {
      const tx = W * 0.1 + random(`tx${i}`) * W * 2.4;
      const ty = nearY(tx, W, H) + H * 0.012;
      const h = H * (0.06 + random(`th${i}`) * 0.07), w = h * 0.42;
      tr.push(`M${tx},${ty - h} L${tx + w * 0.6},${ty - h * 0.55} L${tx + w * 0.35},${ty - h * 0.55} L${tx + w},${ty - h * 0.1} L${tx + 3},${ty - h * 0.1} L${tx + 3},${ty + 4} L${tx - 3},${ty + 4} L${tx - 3},${ty - h * 0.1} L${tx - w},${ty - h * 0.1} L${tx - w * 0.35},${ty - h * 0.55} L${tx - w * 0.6},${ty - h * 0.55} Z`);
    }

    // prayer flags
    const COLORS = ["#2f6fdc", "#f4f4f4", "#e23b3b", "#2fae5b", "#f2c230"];
    const fl: React.ReactNode[] = [];
    [W * 1.3, W * 2.6, W * 3.9].forEach((x1, j) => {
      const x2 = x1 + W * 0.25;
      const y1 = nearY(x1, W, H), y2 = nearY(x2, W, H), ph = H * 0.11;
      const t1 = y1 - ph, t2 = y2 - ph, cx = (x1 + x2) / 2, cy = Math.max(t1, t2) + H * 0.035;
      fl.push(<line key={`p1${j}`} x1={x1} y1={y1 + 4} x2={x1} y2={t1 - 8} stroke="#2c2c2c" strokeWidth={H * 0.004} />);
      fl.push(<line key={`p2${j}`} x1={x2} y1={y2 + 4} x2={x2} y2={t2 - 8} stroke="#2c2c2c" strokeWidth={H * 0.004} />);
      fl.push(<path key={`l${j}`} d={`M${x1},${t1} Q${cx},${cy} ${x2},${t2}`} stroke="rgba(255,255,255,.45)" strokeWidth={1.5} fill="none" />);
      const n = 12, fs = H * 0.012;
      for (let i = 1; i < n; i++) {
        const t = i / n;
        const fx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const fy = (1 - t) ** 2 * t1 + 2 * (1 - t) * t * cy + t * t * t2;
        fl.push(<path key={`f${j}-${i}`} d={`M${fx - fs},${fy} L${fx + fs},${fy} L${fx},${fy + fs * 2.4} Z`} fill={COLORS[i % 5]} opacity={0.9} />);
      }
    });

    return { far: farD, snow: caps, mid: midD, near: nearD, trees: tr.join(" "), flagEls: fl };
  }, [W, H]);

  const wx = cam + W * walkerX;
  const wy = nearY(wx, W, H);
  const slope = (Math.atan2(nearY(wx + 20, W, H) - wy, 20) * 180) / Math.PI;
  const monkSize = H * (H > W ? 0.13 : 0.2);
  const sunT = clamp((dawn - 0.55) / 0.45, 0, 1);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `linear-gradient(180deg, ${c.top} 0%, ${c.mid} 55%, ${c.low} 100%)` }}>
      {/* stars */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: clamp(1 - dawn / 0.72, 0, 1) }}>
        {Array.from({ length: 120 }).map((_, i) => (
          <circle key={i} cx={random(`sx${i}`) * W} cy={random(`sy${i}`) * H * 0.6} r={0.6 + random(`sr${i}`) * 1.6} fill="#fff" opacity={0.3 + random(`so${i}`) * 0.7} />
        ))}
      </svg>
      {/* sun */}
      <div
        style={{
          position: "absolute", left: W * 0.68 - H * 0.1, top: lerp(H * 0.95, H * 0.22, sunT) - H * 0.1,
          width: H * 0.2, height: H * 0.2, borderRadius: "50%", opacity: clamp((dawn - 0.55) / 0.25, 0, 1),
          background: "radial-gradient(circle, #fff6d8 0%, #ffd27a 35%, rgba(255,160,70,.5) 55%, transparent 70%)",
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${-cam * 0.32} 0)`}>
          <path d={far} fill={c.far} />
          {snow.map((d, i) => <path key={i} d={d} fill={c.snow} />)}
        </g>
        <g transform={`translate(${-cam * 0.6} 0)`}>
          <path d={mid} fill={c.midL} />
        </g>
        <g transform={`translate(${-cam} 0)`}>
          <path d={trees} fill={c.near} />
          <path d={near} fill={c.near} />
          {flags && flagEls}
          {showWalker && (
            <g transform={`translate(${wx} ${wy + monkSize * 0.03}) rotate(${slope * 0.35})`}>
              <Monk phase={walkerPhase} size={monkSize} x={(-monkSize * 40) / 140} y={(-monkSize * 135) / 140} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
