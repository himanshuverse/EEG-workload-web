"use client";

import Link from "next/link";
import Analyzer from "../components/Analyzer";
import ThemeLamp from "../components/ThemeLamp";
import { useDark } from "../lib/theme";

// A standalone app screen: no landing-page navbar or footer, just a slim bar to go back and the analysis workspace.
export default function DashboardPage() {
  const { dark, toggle } = useDark();

  return (
    <main className="min-h-screen bg-graph-paper text-ink">
      <ThemeLamp dark={dark} onToggle={toggle} />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-surface px-4 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-300 hover:text-ink">
          <span aria-hidden="true">←</span> Home
        </Link>

        <div className="mt-8 border-b border-stone-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">Cognitive Monitoring Dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Mental Workload Analysis</h1>
          <p className="mt-2 max-w-2xl text-stone-600">Upload your EEG data to see mental workload, signal quality and trends over time.</p>
        </div>

        <div className="mt-8">
          <Analyzer onLevel={() => {}} />
        </div>
      </div>
    </main>
  );
}
