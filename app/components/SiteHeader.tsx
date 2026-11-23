import Link from "next/link";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Features", "/#features"],
  ["Dashboard", "/dashboard"],
];

export default function SiteHeader({ active }: { active: "Home" | "Dashboard" }) {
  return (
    <header className="fixed left-3 right-[5.5rem] top-4 z-50 mx-auto max-w-6xl md:left-20 md:right-20">
      <nav className="flex items-center justify-between rounded-full border border-stone-200 bg-surface/80 px-5 py-2.5 shadow-sm backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-brand-700 text-sm text-white">〰</span>
          <span className="text-sm font-bold tracking-wider">EEG ANALYSIS</span>
        </Link>
        <div className="hidden items-center gap-1 text-xs md:flex">
          {NAV.map(([n, h]) => (
            <Link
              key={n}
              href={h}
              className={`rounded-full px-4 py-1.5 font-medium transition hover:bg-brand-50 hover:text-accent-ink ${
                n === active ? "bg-brand-100 text-accent-ink" : "text-stone-600"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
        <Link href="/dashboard" className="rounded-full bg-ink px-5 py-2 text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5">
          Get Started →
        </Link>
      </nav>
    </header>
  );
}
