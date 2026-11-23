"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// "What We Do": three expanding panels. Hover (or focus / tap) one and it opens to show a live mini-preview of that step.
// A spotlight follows the cursor. On phones every panel is open and stacked.

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

// ── tiny deterministic noise so the SVGs are the same on server and client ──
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};
const wave = (i: number) => Math.sin(i * 0.16) * 18 + Math.sin(i * 0.05 + 1) * 10;
const path = (fn: (i: number) => number, n = 120, w = 360, mid = 40) =>
  Array.from({ length: n }, (_, i) => `${i ? "L" : "M"}${((i / (n - 1)) * w).toFixed(1)} ${(mid - fn(i)).toFixed(1)}`).join(" ");

// ── preview 1: raw signal → cleaned signal ──
function ProcessingPreview() {
  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500">
        <span>Raw · AF7</span>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-950 dark:text-red-300">noisy</span>
      </div>
      <svg viewBox="0 0 360 80" preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
        <path d={path((i) => wave(i) + noise(i) * 34 + (i > 60 && i < 66 ? 28 : 0))} fill="none" stroke="#b9482f" strokeWidth="1.2" opacity="0.75" />
      </svg>
      <div className="flex items-center gap-2 text-stone-500">
        <span className="h-px flex-1 bg-stone-300" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">band-pass · notch · artifacts</span>
        <span className="h-px flex-1 bg-stone-300" />
      </div>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500">
        <span>Cleaned</span>
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-brand-800">ready</span>
      </div>
      <svg viewBox="0 0 360 80" preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
        <path d={path((i) => wave(i) + noise(i) * 4)} fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="feat-draw" />
      </svg>
    </div>
  );
}

// ── preview 2: window labels cycle low / medium / high ──
const LEVELS = [
  { name: "Low", pct: 91, h: 0.3, c: "#5a9a8a" },
  { name: "Medium", pct: 78, h: 0.62, c: "#d9a441" },
  { name: "High", pct: 87, h: 1, c: "#c8553d" },
];
function EstimationPreview() {
  const [i, setI] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % 3), 2200);
    return () => clearInterval(t);
  }, []);
  const lv = LEVELS[i];
  const bars = [0.3, 0.3, 0.62, 0.3, 0.62, 1, 1, 0.62, 0.3, 0.62];
  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-surface p-4 shadow-lg">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Window 6 · 20–24 s</p>
          <p className="mt-1 font-display text-3xl font-semibold transition-colors duration-500" style={{ color: lv.c }}>
            {lv.name} workload
          </p>
        </div>
        <p className="font-mono text-sm text-stone-600">{lv.pct}% sure</p>
      </div>
      <div className="flex h-24 items-end gap-1.5 rounded-lg bg-paper p-2">
        {bars.map((h, k) => (
          <span
            key={k}
            className="flex-1 rounded-t transition-all duration-700"
            style={{ height: `${(k === 5 ? lv.h : h) * 100}%`, background: k === 5 ? lv.c : LEVELS.find((l) => l.h === h)?.c, opacity: k === 5 ? 1 : 0.55 }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {LEVELS.map((l, k) => (
          <span
            key={l.name}
            className="flex-1 rounded-full py-1 text-center text-[11px] font-semibold transition-all duration-500"
            style={{ background: k === i ? l.c : "transparent", color: k === i ? "#1a2321" : "var(--color-stone-500)", boxShadow: k === i ? "none" : "inset 0 0 0 1px var(--color-stone-300)" }}
          >
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── preview 3: workload trend with markers ──
function InsightsPreview() {
  const pts = [22, 30, 28, 46, 58, 52, 74, 88, 80, 62, 44, 30];
  const x = (k: number) => 14 + (k / (pts.length - 1)) * 332;
  const y = (v: number) => 92 - v * 0.82;
  const d = pts.map((v, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Workload over time</p>
        <div className="flex gap-2 text-[11px] text-stone-600">
          <span className="rounded-full bg-paper px-2 py-0.5">Peak 88</span>
          <span className="rounded-full bg-paper px-2 py-0.5">Avg 51</span>
        </div>
      </div>
      <svg viewBox="0 0 360 104" preserveAspectRatio="none" className="h-32 w-full" aria-hidden="true">
        {[25, 50, 75].map((g) => (
          <line key={g} x1="14" x2="346" y1={y(g)} y2={y(g)} stroke="var(--color-stone-200)" strokeDasharray="3 4" />
        ))}
        <path d={`${d} L${x(pts.length - 1)} 100 L${x(0)} 100 Z`} fill="var(--c)" fillOpacity="0.12" className="feat-fade" />
        <path d={d} fill="none" stroke="var(--c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="feat-draw" />
        <circle cx={x(7)} cy={y(88)} r="5" fill="var(--c)" className="feat-fade" />
        <circle cx={x(7)} cy={y(88)} r="10" fill="var(--c)" opacity="0.2" className="feat-ping" />
      </svg>
      <div className="flex justify-between text-[10px] font-mono text-stone-500">
        <span>0:00</span>
        <span>0:20</span>
        <span>0:40</span>
        <span>1:00</span>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "EEG Processing",
    description: "Advanced signal processing to clean and prepare EEG data.",
    tags: ["Band-pass & notch", "Artifact rejection", "Quality score"],
    color: "#0f6b5c",
    icon: (
      <Icon>
        <path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5" />
      </Icon>
    ),
    preview: <ProcessingPreview />,
  },
  {
    title: "Workload Estimation",
    description: "Machine learning models predict mental workload from EEG signals.",
    tags: ["Low · Medium · High", "Per-window confidence", "Personal baseline"],
    color: "#b7791f",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </Icon>
    ),
    preview: <EstimationPreview />,
  },
  {
    title: "Insights & Visualization",
    description: "Visualize results and track workload trends over time.",
    tags: ["Timeline", "Cognitive markers", "Session summary"],
    color: "#b9482f",
    icon: (
      <Icon>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </Icon>
    ),
    preview: <InsightsPreview />,
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} id="features" className="relative overflow-hidden bg-paper px-5 py-28 sm:px-8">
      <div className={`relative text-center transition-all duration-700 ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">Features</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">What We Do</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-stone-600 sm:text-lg">We process EEG signals and estimate cognitive workload using machine learning.</p>
      </div>

      <div
        className={`relative mx-auto mt-14 flex max-w-7xl flex-col gap-4 transition-all delay-100 duration-700 lg:h-[30rem] lg:flex-row ${shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {FEATURES.map((f, i) => {
          const isActive = active === i;
          return (
            <div
              key={f.title}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ ["--c" as string]: f.color, flexGrow: undefined }}
              className={`feat-panel group relative cursor-pointer overflow-hidden rounded-3xl border bg-surface outline-none transition-[flex-grow,border-color,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-w-0 lg:basis-0 ${
                isActive
                  ? "border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_8%,var(--color-surface))] lg:grow-[6]"
                  : "border-stone-200 hover:border-stone-300 lg:grow-[1]"
              }`}
            >
              {/* big faint number */}
              <span className={`pointer-events-none absolute right-6 top-3 select-none font-display text-7xl font-semibold text-ink/[0.06] transition-opacity duration-300 ${isActive ? "opacity-100" : "lg:opacity-0"}`}>
                0{i + 1}
              </span>

              {/* icon */}
              <div
                className={`absolute top-6 z-10 grid size-14 place-items-center rounded-2xl border transition-all duration-500 ${
                  isActive ? "left-6 border-[color-mix(in_srgb,var(--c)_45%,transparent)] bg-[color-mix(in_srgb,var(--c)_14%,transparent)]" : "left-6 border-stone-200 bg-paper lg:left-1/2 lg:-translate-x-1/2"
                }`}
                style={{ color: f.color }}
              >
                {f.icon}
              </div>

              {/* collapsed (desktop): sideways title */}
              <p className={`absolute bottom-7 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-lg font-semibold text-stone-700 transition-opacity duration-300 [writing-mode:vertical-rl] lg:block ${isActive ? "opacity-0" : "opacity-100 delay-300"}`}>
                {f.title}
              </p>

              {/* open content */}
              <div
                className={`relative mt-24 flex flex-col gap-6 px-6 pb-7 transition-all duration-500 lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:w-full lg:min-w-[44rem] lg:flex-row lg:items-center lg:gap-8 lg:p-8 ${
                  isActive ? "lg:translate-x-0 lg:opacity-100 lg:delay-200" : "lg:pointer-events-none lg:translate-x-6 lg:opacity-0"
                }`}
              >
                <div className="lg:w-64 lg:shrink-0 lg:pt-20">
                  <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{f.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span key={t} className="rounded-full border border-[color-mix(in_srgb,var(--c)_40%,transparent)] bg-[color-mix(in_srgb,var(--c)_10%,transparent)] px-2.5 py-1 text-[11px] font-medium text-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div key={isActive ? "on" : "off"} className="lg:min-w-0 lg:flex-1">
                  {f.preview}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
