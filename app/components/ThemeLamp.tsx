"use client";

import { useState } from "react";

// The light/dark switch: a lamp hanging from the top of the page. Pull its cord (click, Enter or Space) to switch.
// DARK mode = lamp on (warm bulb, soft cone of light); LIGHT mode = lamp off. Fixed colours so it is the same object in both modes.
export default function ThemeLamp({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [pulls, setPulls] = useState(0);

  return (
    <div className="pointer-events-none fixed right-3 top-0 z-[60] md:right-6">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[66px] h-[300px] w-[260px] -translate-x-1/2 transition-opacity duration-700"
        style={{
          opacity: dark ? 1 : 0,
          clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(to bottom, rgb(245 184 46 / 0.16), rgb(245 184 46 / 0.04) 60%, transparent)",
        }}
      />
      <button
        type="button"
        onClick={() => {
          onToggle();
          setPulls((n) => n + 1);
        }}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        title={dark ? "Light mode" : "Dark mode"}
        className="pointer-events-auto relative block cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <span key={pulls} className={`block ${pulls ? "lamp-swing" : ""}`}>
          <svg viewBox="0 0 60 120" className="h-[120px] w-[60px] overflow-visible" fill="none" aria-hidden="true">
            <line x1="30" y1="0" x2="30" y2="30" stroke="#8a8a8a" strokeWidth="1.5" />
            <rect x="25.5" y="27" width="9" height="7" rx="2" fill="#4a5553" />
            <circle cx="30" cy="61" r="20" fill="url(#lamp-glow)" style={{ opacity: dark ? 1 : 0, transition: "opacity 500ms" }} />
            <path d="M11 60 C11 44 19 33 30 33 C41 33 49 44 49 60 Z" fill="#2f3a37" />
            <path d="M16 46 C19 39 24 36 30 35.5" stroke="#5b6966" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="30" cy="60" rx="19" ry="3" fill="#1f2725" />
            <circle cx="30" cy="62.5" r="5" fill={dark ? "#ffe9a8" : "#d6d3d1"} style={{ transition: "fill 400ms" }} />
            <g key={`p${pulls}`} className={pulls ? "lamp-pull" : ""}>
              <line x1="42" y1="58" x2="42" y2="92" stroke="#8a8a8a" strokeWidth="1.2" />
              <circle cx="42" cy="95.5" r="3.6" fill="#c8901a" />
            </g>
            <defs>
              <radialGradient id="lamp-glow">
                <stop offset="0" stopColor="#ffd56b" stopOpacity="0.85" />
                <stop offset="1" stopColor="#ffd56b" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </span>
      </button>
    </div>
  );
}
