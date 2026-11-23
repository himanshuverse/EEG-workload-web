"use client";

import Link from "next/link";
import { useState } from "react";
import EegScene from "./components/EegScene";
import Features from "./components/Features";
import SiteHeader from "./components/SiteHeader";
import ThemeLamp from "./components/ThemeLamp";
import type { Level } from "./lib/api";
import { useDark } from "./lib/theme";

export default function Home() {
  const [level] = useState<Level>("medium");
  const { dark, toggle } = useDark();

  return (
    <main className="bg-surface text-ink">
      {/* Header */}
      <ThemeLamp dark={dark} onToggle={toggle} />
      <SiteHeader active="Home" />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:flex-row lg:items-center">
        <div className="absolute inset-0 -z-10 max-lg:relative max-lg:inset-auto max-lg:order-last max-lg:h-[380px] max-lg:w-full">
          <EegScene level={level} dark={dark} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-linear-to-r from-surface via-surface/85 to-transparent lg:block" />

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-6 pt-32 sm:px-10 lg:px-16 lg:pb-24 lg:pt-28">
          <div className="pointer-events-auto max-w-[50rem] max-lg:mx-auto max-lg:text-center">
            <h1 className="hero-in font-display text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl xl:text-[4.2rem]">
              EEG-Based Workload
              <span className="block text-accent-ink">Analysis</span>
            </h1>
            <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-stone-600 max-lg:mx-auto" style={{ animationDelay: "120ms" }}>
              Upload your EEG data and discover insights about mental workload using advanced machine learning.
            </p>
            <div className="hero-in mt-9 flex flex-wrap items-center gap-3 max-lg:justify-center" style={{ animationDelay: "220ms" }}>
              <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
                Analyze EEG
              </Link>
              <a href="#features" className="inline-flex h-12 items-center gap-2 rounded-full bg-surface/80 px-7 text-sm font-semibold ring-1 ring-ink/15 backdrop-blur transition-colors hover:bg-stone-100">
                Explore Features <span className="cta-bob">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Features />

      {/* About */}
      <section id="about" className="keep-light bg-brand-950 px-6 py-28 text-center text-paper">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Understand Your Mental Workload</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-100/80 sm:text-lg">
          Our system combines EEG signal processing and machine learning to provide meaningful workload insights.
        </p>
        <Link href="/dashboard" className="mt-10 inline-block rounded-full border border-white/70 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink">
          Explore Dashboard →
        </Link>
      </section>

      <footer className="border-t border-stone-200 bg-surface text-stone-600 px-6 py-8 text-center text-sm">EEG Workload Analysis © 2026</footer>
    </main>
  );
}
