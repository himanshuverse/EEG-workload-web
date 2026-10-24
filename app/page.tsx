"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Lightweight Scroll Reveal Component */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
        } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress along the page
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = (totalScroll / windowHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Dynamic Animated Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-gray-600 via-white to-gray-400 z-[100] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Attractive Floating Glassmorphic Navbar */}
      <header className="sticky top-4 z-50 mx-auto w-[92%] max-w-6xl">
        <nav className="flex items-center justify-between rounded-full border border-white/15 bg-black/75 px-5 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-white/25">
          {/* Logo with live pulsing indicator */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                <span className="text-base text-white transition-transform duration-300 group-hover:rotate-12">〰</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white">
                EEG ANALYSIS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                Cognitive Dynamics
              </span>
            </div>
          </Link>

          {/* Navigation Links with smooth scroll targeting */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            <Link
              href="/"
              className="rounded-full bg-white/15 px-4 py-1.5 font-medium text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
            >
              Home
            </Link>

            <a
              href="#about"
              className="rounded-full px-4 py-1.5 font-medium text-gray-400 transition hover:text-white hover:bg-white/5"
            >
              About
            </a>

            <a
              href="#features"
              className="rounded-full px-4 py-1.5 font-medium text-gray-400 transition hover:text-white hover:bg-white/5"
            >
              Features
            </a>

            <Link
              href="/dashboard"
              className="rounded-full px-4 py-1.5 font-medium text-gray-400 transition hover:text-white hover:bg-white/5"
            >
              Dashboard
            </Link>
          </div>

          {/* Attractive CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden px-6">
        {/* Ambient Subtle Radial Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[550px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px] animate-pulse" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl transition-all">
            EEG-Based Workload
            <br />
            Analysis
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400">
            Upload your EEG data and discover insights about
            mental workload using advanced machine learning.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-block rounded-md bg-white px-8 py-4 font-semibold text-black transition duration-200 hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
            >
              Analyze EEG
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-[#0a0a0a] px-8 py-4 font-semibold text-gray-300 transition duration-200 hover:border-white hover:text-white"
            >
              <span>Explore Features</span>
              <span className="text-xs">↓</span>
            </a>
          </div>

        </div>

        {/* Animated EEG Wave Streaming Live Across Screen */}
        <div className="absolute bottom-6 left-0 w-full opacity-80 pointer-events-none overflow-hidden">
          <div className="animate-wave-flow">
            {/* SVG Copy 1 */}
            <svg
              viewBox="0 0 1200 180"
              className="h-36 sm:h-44 w-full flex-shrink-0"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M0 90
                  C20 70 25 110 45 90
                  S70 40 90 90
                  S115 130 135 90
                  S160 55 180 90
                  S205 125 225 90
                  S250 35 270 90
                  S295 145 315 90
                  S340 60 360 90
                  S385 120 405 90
                  S430 45 450 90
                  S475 135 495 90
                  S520 55 540 90
                  S565 125 585 90
                  S610 35 630 90
                  S655 145 675 90
                  S700 60 720 90
                  S745 120 765 90
                  S790 45 810 90
                  S835 135 855 90
                  S880 55 900 90
                  S925 125 945 90
                  S970 35 990 90
                  S1015 145 1035 90
                  S1060 60 1080 90
                  S1105 120 1125 90
                  S1150 45 1170 90
                  S1190 110 1200 90
                "
                fill="none"
                stroke="white"
                strokeWidth="2"
              />

              <path
                d="
                  M0 95
                  C30 85 40 105 65 95
                  S100 65 125 95
                  S155 115 180 95
                  S215 70 240 95
                  S275 120 300 95
                  S335 65 360 95
                  S395 115 420 95
                  S455 70 480 95
                  S515 120 540 95
                  S575 65 600 95
                  S635 115 660 95
                  S695 70 720 95
                  S755 120 780 95
                  S815 65 840 95
                  S875 115 900 95
                  S935 70 960 95
                  S995 120 1020 95
                  S1055 65 1080 95
                  S1115 115 1140 95
                  S1175 70 1200 95
                "
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.35"
              />
            </svg>

            {/* SVG Copy 2 (Enables smooth seamless infinite scrolling) */}
            <svg
              viewBox="0 0 1200 180"
              className="h-36 sm:h-44 w-full flex-shrink-0"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M0 90
                  C20 70 25 110 45 90
                  S70 40 90 90
                  S115 130 135 90
                  S160 55 180 90
                  S205 125 225 90
                  S250 35 270 90
                  S295 145 315 90
                  S340 60 360 90
                  S385 120 405 90
                  S430 45 450 90
                  S475 135 495 90
                  S520 55 540 90
                  S565 125 585 90
                  S610 35 630 90
                  S655 145 675 90
                  S700 60 720 90
                  S745 120 765 90
                  S790 45 810 90
                  S835 135 855 90
                  S880 55 900 90
                  S925 125 945 90
                  S970 35 990 90
                  S1015 145 1035 90
                  S1060 60 1080 90
                  S1105 120 1125 90
                  S1150 45 1170 90
                  S1190 110 1200 90
                "
                fill="none"
                stroke="white"
                strokeWidth="2"
              />

              <path
                d="
                  M0 95
                  C30 85 40 105 65 95
                  S100 65 125 95
                  S155 115 180 95
                  S215 70 240 95
                  S275 120 300 95
                  S335 65 360 95
                  S395 115 420 95
                  S455 70 480 95
                  S515 120 540 95
                  S575 65 600 95
                  S635 115 660 95
                  S695 70 720 95
                  S755 120 780 95
                  S815 65 840 95
                  S875 115 900 95
                  S935 70 960 95
                  S995 120 1020 95
                  S1055 65 1080 95
                  S1115 115 1140 95
                  S1175 70 1200 95
                "
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.35"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* What We Do — With Scroll Reveal Animation */}
      <section
        id="features"
        className="scroll-mt-24 bg-white px-6 py-28 text-black"
      >
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                What We Do
              </h2>

              <div className="mx-auto mt-4 h-1 w-12 bg-black" />

              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-600">
                We process EEG signals and estimate cognitive workload
                using machine learning.
              </p>
            </div>
          </ScrollReveal>

          {/* Staggered Features on Scroll */}
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <ScrollReveal delay={100}>
              <Feature
                icon="〰"
                title="EEG Processing"
                description="Advanced signal processing to clean and prepare EEG data."
              />
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <Feature
                icon="◉"
                title="Workload Estimation"
                description="Machine learning models predict mental workload from EEG signals."
              />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <Feature
                icon="▮"
                title="Insights & Visualization"
                description="Visualize results and track workload trends over time."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Simple About — With Scroll Reveal Animation */}
      <section
        id="about"
        className="scroll-mt-24 border-t border-gray-900 bg-black px-6 py-28 text-center"
      >
        <ScrollReveal>
          <div className="mx-auto max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Understand Your Mental Workload
            </h2>

            <p className="mx-auto mt-5 text-base sm:text-lg leading-relaxed text-gray-400">
              Our system combines EEG signal processing and machine
              learning to provide meaningful workload insights.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-block rounded-md border border-white px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black hover:scale-105 active:scale-95 duration-200"
              >
                Explore Dashboard →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black px-6 py-8 text-center text-sm text-gray-500">
        EEG Workload Analysis © 2026
      </footer>
    </main>
  );
}

/* Feature Component with Hover Micro-Animations */
function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group text-center p-4 transition-all duration-300 hover:-translate-y-2 cursor-default">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/20">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold transition-colors duration-200">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xs leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}