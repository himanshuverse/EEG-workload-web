"use client";

import React, { useState, useId } from "react";
import Link from "next/link";

interface SessionData {
  id: string;
  name: string;
  participantId: string;
  participantName: string;
  taskType: string;
  device: string;
  sampleRate: string;
  channelsCount: number;
  recordedAt: string;
  duration: string;
  overallQuality: number;
  snrDb: number;
  artifactsRejected: string;
  avgWorkload: number;
  peakWorkload: number;
  currentWorkload: number;
  status: "Completed" | "Processing" | "Live Stream";
  confidence: number;
  thetaPower: number;
  alphaPower: number;
  betaPower: number;
  engagementIndex: number;
  electrodes: {
    name: string;
    region: string;
    impedanceKohm: number;
    status: "good" | "fair" | "poor";
    snr: number;
  }[];
  timeline: {
    time: string;
    second: number;
    workload: number;
    theta: number;
    alpha: number;
    beta: number;
    phase: string;
  }[];
}

const SESSIONS: SessionData[] = [
  {
    id: "SESS-2026-0891",
    name: "MATB-II Multitasking Cognitive Load Test",
    participantId: "P-4029",
    participantName: "Alex Vance (Subject #4)",
    taskType: "Multi-Attribute Task Battery (Flight Sim)",
    device: "OpenBCI Cyton (8-Ch)",
    sampleRate: "250 Hz",
    channelsCount: 8,
    recordedAt: "Today, 14:20 UTC",
    duration: "20 min 00 sec",
    overallQuality: 96,
    snrDb: 18.4,
    artifactsRejected: "3.2% (Ocular ICA filtered)",
    avgWorkload: 68,
    peakWorkload: 89,
    currentWorkload: 74,
    status: "Completed",
    confidence: 94.6,
    thetaPower: 62,
    alphaPower: 34,
    betaPower: 78,
    engagementIndex: 1.45,
    electrodes: [
      { name: "Fp1", region: "Frontal Left", impedanceKohm: 4.2, status: "good", snr: 19.1 },
      { name: "Fp2", region: "Frontal Right", impedanceKohm: 4.8, status: "good", snr: 18.7 },
      { name: "F3", region: "Frontal Left", impedanceKohm: 5.1, status: "good", snr: 17.9 },
      { name: "F4", region: "Frontal Right", impedanceKohm: 5.4, status: "good", snr: 18.2 },
      { name: "C3", region: "Central Left", impedanceKohm: 6.2, status: "good", snr: 16.8 },
      { name: "C4", region: "Central Right", impedanceKohm: 6.9, status: "good", snr: 16.5 },
      { name: "P3", region: "Parietal Left", impedanceKohm: 8.5, status: "fair", snr: 14.2 },
      { name: "P4", region: "Parietal Right", impedanceKohm: 5.7, status: "good", snr: 17.5 },
    ],
    timeline: [
      { time: "00:00", second: 0, workload: 22, theta: 25, alpha: 78, beta: 20, phase: "Resting Baseline" },
      { time: "02:00", second: 120, workload: 28, theta: 30, alpha: 72, beta: 26, phase: "Resting Baseline" },
      { time: "04:00", second: 240, workload: 46, theta: 44, alpha: 58, beta: 48, phase: "Track Alignment Task" },
      { time: "06:00", second: 360, workload: 58, theta: 52, alpha: 49, beta: 60, phase: "Track Alignment Task" },
      { time: "08:00", second: 480, workload: 71, theta: 64, alpha: 38, beta: 72, phase: "Dual Task + Fuel Mgmt" },
      { time: "10:00", second: 600, workload: 84, theta: 78, alpha: 29, beta: 85, phase: "Peak Stress / Emergency Sim" },
      { time: "12:00", second: 720, workload: 89, theta: 84, alpha: 24, beta: 91, phase: "Peak Stress / Emergency Sim" },
      { time: "14:00", second: 840, workload: 78, theta: 71, alpha: 33, beta: 79, phase: "Resource Management" },
      { time: "16:00", second: 960, workload: 62, theta: 58, alpha: 42, beta: 64, phase: "Moderate Stabilization" },
      { time: "18:00", second: 1080, workload: 41, theta: 39, alpha: 60, beta: 38, phase: "Post-Task Recovery" },
      { time: "20:00", second: 1200, workload: 31, theta: 28, alpha: 74, beta: 25, phase: "Post-Task Recovery" },
    ],
  },
  {
    id: "SESS-2026-0892",
    name: "N-Back Working Memory Protocol (1-Back vs 3-Back)",
    participantId: "P-4031",
    participantName: "Elena Rostova (Subject #7)",
    taskType: "Cognitive Load N-Back Challenge",
    device: "Emotiv EPOC X (14-Ch)",
    sampleRate: "256 Hz",
    channelsCount: 8,
    recordedAt: "Yesterday, 11:15 UTC",
    duration: "15 min 00 sec",
    overallQuality: 91,
    snrDb: 16.8,
    artifactsRejected: "5.1% (Blink & jaw movement)",
    avgWorkload: 54,
    peakWorkload: 82,
    currentWorkload: 52,
    status: "Completed",
    confidence: 92.1,
    thetaPower: 54,
    alphaPower: 48,
    betaPower: 58,
    engagementIndex: 1.12,
    electrodes: [
      { name: "Fp1", region: "Frontal Left", impedanceKohm: 5.0, status: "good", snr: 17.5 },
      { name: "Fp2", region: "Frontal Right", impedanceKohm: 5.2, status: "good", snr: 17.1 },
      { name: "F3", region: "Frontal Left", impedanceKohm: 6.8, status: "good", snr: 15.9 },
      { name: "F4", region: "Frontal Right", impedanceKohm: 6.1, status: "good", snr: 16.4 },
      { name: "C3", region: "Central Left", impedanceKohm: 7.2, status: "good", snr: 15.0 },
      { name: "C4", region: "Central Right", impedanceKohm: 8.8, status: "fair", snr: 13.9 },
      { name: "P3", region: "Parietal Left", impedanceKohm: 6.5, status: "good", snr: 16.2 },
      { name: "P4", region: "Parietal Right", impedanceKohm: 7.0, status: "good", snr: 15.8 },
    ],
    timeline: [
      { time: "00:00", second: 0, workload: 19, theta: 21, alpha: 82, beta: 18, phase: "Resting Eyes Open" },
      { time: "03:00", second: 180, workload: 38, theta: 36, alpha: 64, beta: 39, phase: "1-Back Easy Block" },
      { time: "06:00", second: 360, workload: 45, theta: 42, alpha: 59, beta: 47, phase: "1-Back Easy Block" },
      { time: "09:00", second: 540, workload: 76, theta: 74, alpha: 32, beta: 75, phase: "3-Back High Load Block" },
      { time: "12:00", second: 720, workload: 82, theta: 81, alpha: 27, beta: 80, phase: "3-Back High Load Block" },
      { time: "15:00", second: 900, workload: 33, theta: 30, alpha: 71, beta: 29, phase: "Final Recovery" },
    ],
  },
];

export default function DashboardPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(SESSIONS[0].id);
  const [selectedMetric, setSelectedMetric] = useState<"workload" | "theta" | "alpha" | "beta">("workload");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const chartGradientId = useId();

  const session = SESSIONS.find((s) => s.id === selectedSessionId) || SESSIONS[0];

  const getWorkloadState = (val: number) => {
    if (val >= 75) {
      return { label: "High Cognitive Workload", desc: "Frontal theta synchronization indicates peak memory and attention load." };
    }
    if (val >= 45) {
      return { label: "Moderate Workload", desc: "Balanced cognitive state with sustained operational focus." };
    }
    return { label: "Low Workload / Rest", desc: "Parietal alpha rhythm dominance indicating relaxed or baseline state." };
  };

  const workloadState = getWorkloadState(session.currentWorkload);

  // SVG Chart Dimensions
  const chartWidth = 780;
  const chartHeight = 220;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const points = session.timeline.map((point, index) => {
    const x = padding.left + (index / (session.timeline.length - 1)) * graphWidth;
    const value = point[selectedMetric];
    const y = padding.top + graphHeight - (value / 100) * graphHeight;
    return { x, y, ...point, value };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Report exported successfully for session ${session.id}!`);
    }, 600);
  };

  const activeHover = hoveredPointIndex !== null ? points[hoveredPointIndex] : points[points.length - 1];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Attractive Floating Glassmorphic Dashboard Header */}
      <header className="sticky top-4 z-50 mx-auto w-[92%] max-w-7xl">
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-white">
                  EEG ANALYSIS
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-mono tracking-widest text-gray-300 uppercase">
                  Telemetry
                </span>
              </div>
              <span className="text-[9px] font-mono text-gray-500">
                Session {session.id}
              </span>
            </div>
          </Link>

          {/* Only Home link as requested */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white group"
            >
              <span className="text-xs transition-transform duration-200 group-hover:-translate-x-1">←</span>
              <span>Home</span>
            </Link>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Session Switcher Pill */}
            <div className="relative">
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setHoveredPointIndex(null);
                }}
                className="bg-black/80 border border-white/15 text-xs text-gray-200 rounded-full px-3.5 py-1.5 pr-7 focus:outline-none focus:border-white appearance-none cursor-pointer transition hover:border-white/30"
                aria-label="Select EEG Session"
              >
                {SESSIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-black text-white">
                    {s.participantId} — {s.name.substring(0, 24)}...
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[9px]">
                ▼
              </span>
            </div>

            {/* Export Pill Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-all duration-300 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-6 py-8 flex-1 space-y-8">

        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Cognitive Monitoring Dashboard</span>
              <span>/</span>
              <span className="font-mono text-white">{session.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Mental Workload Analysis
            </h1>
            <p className="mt-2 text-sm text-gray-400 max-w-2xl">
              Real-time cognitive load estimation, signal quality diagnostics, and neural frequency band decomposition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-gray-800 bg-[#0a0a0a] px-3.5 py-2 rounded-md text-xs text-gray-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Status: <strong className="text-white font-medium">{session.status}</strong></span>
              <span className="text-gray-700">|</span>
              <span className="font-mono text-gray-300">{session.sampleRate}</span>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* KPI 1: Current Workload */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-5 rounded-md hover:border-gray-700 transition">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Workload Score</span>
              <span className="text-[10px] font-mono border border-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                NASA-TLX
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white font-mono">
                {session.currentWorkload}%
              </span>
              <span className="text-xs text-gray-500">
                Peak: <span className="text-gray-300 font-medium">{session.peakWorkload}%</span>
              </span>
            </div>
            {/* Minimalist Progress Bar */}
            <div className="mt-4 w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${session.currentWorkload}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-gray-500">
              <span>Session Average</span>
              <span className="font-mono text-gray-300">{session.avgWorkload}%</span>
            </div>
          </div>

          {/* KPI 2: Signal Quality */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-5 rounded-md hover:border-gray-700 transition">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Signal Quality</span>
              <span className="text-[10px] font-mono border border-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                {session.snrDb} dB SNR
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white font-mono">
                {session.overallQuality}%
              </span>
              <span className="text-xs text-emerald-400">Optimal</span>
            </div>
            <div className="mt-4 w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${session.overallQuality}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-gray-500">
              <span>Artifact Rejection</span>
              <span className="font-mono text-gray-300">{session.artifactsRejected}</span>
            </div>
          </div>

          {/* KPI 3: Model Confidence */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-5 rounded-md hover:border-gray-700 transition">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Prediction Confidence</span>
              <span className="text-[10px] font-mono border border-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                p &lt; 0.001
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-white font-mono">
                {session.confidence}%
              </span>
              <span className="text-xs text-gray-500">EEGNet + LSTM</span>
            </div>
            <div className="mt-4 w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${session.confidence}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-gray-500">
              <span>Engagement Ratio</span>
              <span className="font-mono text-gray-300">{session.engagementIndex} (β/(α+θ))</span>
            </div>
          </div>

          {/* KPI 4: Active Protocol */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-5 rounded-md hover:border-gray-700 transition flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Active Protocol</span>
              <span className="text-[10px] font-mono border border-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                {session.channelsCount} Channels
              </span>
            </div>
            <div className="my-2">
              <h2 className="text-sm font-semibold text-white line-clamp-1">{session.taskType}</h2>
              <p className="text-xs text-gray-400 mt-1">
                Subject: <span className="font-mono text-white">{session.participantId}</span>
              </p>
            </div>
            <div className="pt-2 border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>{session.device}</span>
              <span>{session.duration}</span>
            </div>
          </div>

        </div>

        {/* SECTION: TIMELINE CHART & WORKLOAD PREDICTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Timeline Chart Container (2 Cols) */}
          <div className="lg:col-span-2 border border-gray-800 bg-[#0a0a0a] p-6 rounded-md flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>〰</span> Session Workload Timeline
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Continuous mental workload and spectral power trajectory across trial phases
                  </p>
                </div>

                {/* Metric Selector Tabs */}
                <div className="flex items-center gap-1.5 bg-black p-1 rounded-md border border-gray-800 text-xs">
                  {(
                    [
                      { key: "workload", label: "Workload" },
                      { key: "theta", label: "Theta (4-8Hz)" },
                      { key: "alpha", label: "Alpha (8-12Hz)" },
                      { key: "beta", label: "Beta (13-30Hz)" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedMetric(tab.key)}
                      className={`px-3 py-1 rounded text-xs transition ${
                        selectedMetric === tab.key
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Point Inspector */}
              <div className="mt-4 border border-gray-800/80 bg-black/60 px-4 py-2.5 rounded text-xs flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-white font-mono font-medium">{activeHover.time}</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-gray-500">Phase:</span>
                  <span className="text-gray-200 font-medium">{activeHover.phase}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 sm:mt-0 font-mono">
                  <span className="text-gray-500">Selected Value:</span>
                  <span className="text-white font-bold">{activeHover[selectedMetric]}%</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-gray-400">θ: {activeHover.theta}</span>
                  <span className="text-gray-400">α: {activeHover.alpha}</span>
                  <span className="text-gray-400">β: {activeHover.beta}</span>
                </div>
              </div>

              {/* SVG Timeline Graph */}
              <div className="mt-4 relative overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto min-w-[540px] select-none"
                >
                  <defs>
                    <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines & Y-axis labels */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = padding.top + graphHeight - (val / 100) * graphHeight;
                    return (
                      <g key={val}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="#1f242d"
                          strokeDasharray={val === 75 ? "3 3" : undefined}
                          strokeWidth="1"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 4}
                          fill="#666666"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Overload Reference Line (75%) */}
                  <line
                    x1={padding.left}
                    y1={padding.top + graphHeight - (75 / 100) * graphHeight}
                    x2={chartWidth - padding.right}
                    y2={padding.top + graphHeight - (75 / 100) * graphHeight}
                    stroke="#888888"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                  <text
                    x={chartWidth - padding.right}
                    y={padding.top + graphHeight - (75 / 100) * graphHeight - 6}
                    fill="#888888"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    High Load Threshold (75%)
                  </text>

                  {/* Area fill */}
                  <path d={areaD} fill={`url(#${chartGradientId})`} />

                  {/* Waveform Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {points.map((pt, i) => {
                    const isHovered = hoveredPointIndex === i;
                    return (
                      <g
                        key={i}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        onClick={() => setHoveredPointIndex(i)}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "#ffffff" : "#000000"}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all duration-150"
                        />

                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={padding.top}
                            x2={pt.x}
                            y2={padding.top + graphHeight}
                            stroke="#ffffff"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            opacity="0.4"
                          />
                        )}

                        <text
                          x={pt.x}
                          y={chartHeight - 12}
                          fill={isHovered ? "#ffffff" : "#666666"}
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight={isHovered ? "bold" : "normal"}
                        >
                          {pt.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-800">
              <span className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-white inline-block" />
                <span>Primary EEG Curve</span>
              </span>
              <span>Hover or click on points along timeline to inspect phase metrics</span>
            </div>
          </div>

          {/* Workload Prediction & Frequency Bands */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-6 rounded-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>◉</span> Workload Prediction
                </h3>
                <span className="text-[10px] font-mono border border-gray-700 px-2 py-0.5 rounded text-gray-300">
                  ML Output
                </span>
              </div>

              {/* State Callout */}
              <div className="mt-4 p-3.5 rounded border border-gray-800 bg-black text-xs">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  {workloadState.label}
                </div>
                <p className="text-gray-400 mt-1 text-[11px] leading-relaxed">
                  {workloadState.desc}
                </p>
              </div>

              {/* Neural Frequency Bands */}
              <div className="mt-6 space-y-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Neural Frequency Bands
                </h4>

                {/* Theta */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Frontal Theta (4–8 Hz)</span>
                    <span className="font-mono text-white font-medium">{session.thetaPower}%</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${session.thetaPower}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Reflects working memory demand and mental arithmetic</p>
                </div>

                {/* Alpha */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Parietal Alpha (8–12 Hz)</span>
                    <span className="font-mono text-white font-medium">{session.alphaPower}%</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: `${session.alphaPower}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Suppression indicates visual and cognitive concentration</p>
                </div>

                {/* Beta */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Central Beta (13–30 Hz)</span>
                    <span className="font-mono text-white font-medium">{session.betaPower}%</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: `${session.betaPower}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Elevated during active motor preparation and problem-solving</p>
                </div>
              </div>
            </div>

            {/* Inference specs */}
            <div className="mt-6 pt-3 border-t border-gray-800 bg-black p-3 rounded text-xs space-y-1.5">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Inference Latency</span>
                <span className="text-white font-mono">42 ms</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Feature Pipeline</span>
                <span className="text-white font-mono">Welch PSD + Wavelet</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Model Target</span>
                <span className="text-white font-mono">Cognitive Index (0–100)</span>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION: SESSION DETAILS & SIGNAL QUALITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Session Details */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-6 rounded-md">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>▮</span> Session Details
              </h3>
              <span className="text-xs font-mono text-gray-400">{session.id}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Participant</span>
                <span className="text-sm font-semibold text-white font-mono mt-0.5 block">{session.participantId}</span>
                <span className="text-[10px] text-gray-400 truncate block">{session.participantName}</span>
              </div>

              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Sample Rate</span>
                <span className="text-sm font-semibold text-white font-mono mt-0.5 block">{session.sampleRate}</span>
                <span className="text-[10px] text-gray-400 block">Bandwidth safe</span>
              </div>

              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Duration</span>
                <span className="text-sm font-semibold text-white font-mono mt-0.5 block">{session.duration}</span>
                <span className="text-[10px] text-gray-400 block">Complete</span>
              </div>

              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Device</span>
                <span className="text-sm font-semibold text-white mt-0.5 block truncate">{session.device}</span>
                <span className="text-[10px] text-gray-400 block">Research grade</span>
              </div>

              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Channels</span>
                <span className="text-sm font-semibold text-white font-mono mt-0.5 block">{session.channelsCount} Ch</span>
                <span className="text-[10px] text-gray-400 block">10–20 Montage</span>
              </div>

              <div className="border border-gray-800 bg-black p-3 rounded">
                <span className="text-[11px] text-gray-500 uppercase block">Timestamp</span>
                <span className="text-sm font-semibold text-white mt-0.5 block truncate">{session.recordedAt}</span>
                <span className="text-[10px] text-gray-400 block">UTC Time</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 border border-gray-800 bg-black rounded">
              <span className="text-xs font-semibold text-gray-300 block">Protocol Overview:</span>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Multi-Attribute Task Battery test assessing compensatory tracking, system monitoring, and resource management.
                Cognitive difficulty is modulated across blocks to record baseline vs peak workload shifts.
              </p>
            </div>
          </div>

          {/* Signal Quality */}
          <div className="border border-gray-800 bg-[#0a0a0a] p-6 rounded-md">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>◉</span> Signal Quality & Impedance
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Electrode contact resistance & noise rejection</p>
              </div>
              <span className="text-xs font-mono border border-gray-800 bg-black px-2.5 py-1 rounded text-white">
                SNR: {session.snrDb} dB
              </span>
            </div>

            {/* Electrode Grid */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {session.electrodes.map((el) => (
                <div
                  key={el.name}
                  className="border border-gray-800 bg-black p-2.5 rounded hover:border-gray-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-white">{el.name}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        el.status === "good"
                          ? "bg-white"
                          : el.status === "fair"
                          ? "bg-gray-400"
                          : "bg-gray-600"
                      }`}
                      title={`Status: ${el.status}`}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{el.region}</div>
                  <div className="mt-2 pt-1.5 border-t border-gray-900 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Z:</span>
                    <span className="text-gray-200">{el.impedanceKohm} kΩ</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="mt-4 p-3 border border-gray-800 bg-black rounded flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-white">✓</span>
                <span className="text-gray-400">Bandpass:</span>
                <span className="text-white font-mono">0.5 – 45.0 Hz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white">✓</span>
                <span className="text-gray-400">Notch:</span>
                <span className="text-white font-mono">50/60 Hz Hum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white">✓</span>
                <span className="text-gray-400">Artifacts:</span>
                <span className="text-white font-mono">ICA Ocular Clean</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer — Identical to landing page footer */}
      <footer className="border-t border-gray-800 bg-black px-6 py-6 text-center text-sm text-gray-500 mt-12">
        EEG Workload Analysis © 2026
      </footer>
    </div>
  );
}
