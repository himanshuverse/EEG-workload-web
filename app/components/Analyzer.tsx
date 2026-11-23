"use client";

import { useEffect, useRef, useState } from "react";
import {
  API_URL,
  calibrateUpload,
  clearCalibration,
  health,
  makeSample,
  predictUpload,
  type CalibrationResponse,
  type Level,
  type PredictResponse,
} from "../lib/api";

const LEVEL_STYLE: Record<Level, { label: string; bar: string; chip: string; height: number; blurb: string }> = {
  low: {
    label: "Low",
    bar: "bg-brand-400",
    chip: "bg-brand-100 text-brand-800",
    height: 0.33,
    blurb: "Relaxed or resting state. Alpha rhythm dominates and little mental effort is needed.",
  },
  medium: {
    label: "Medium",
    bar: "bg-highlight",
    chip: "bg-amber-100 text-amber-900",
    height: 0.66,
    blurb: "Balanced, sustained focus. Attention is engaged but not overloaded.",
  },
  high: {
    label: "High",
    bar: "bg-orange-500",
    chip: "bg-orange-100 text-orange-900",
    height: 1,
    blurb: "Heavy mental load. Frontal theta rises while alpha is suppressed.",
  },
  unusable: {
    label: "Unusable",
    bar: "bg-stone-300",
    chip: "bg-stone-100 text-stone-600",
    height: 0.12,
    blurb: "Window rejected: the signal was too noisy to classify.",
  },
};

const fmt = (v: number | null | undefined, d = 2) => (v === null || v === undefined ? "–" : v.toFixed(d));

export default function Analyzer({ onLevel }: { onLevel: (l: Level) => void }) {
  const [api, setApi] = useState<"checking" | "online" | "no-model" | "offline">("checking");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [fileName, setFileName] = useState("");
  const [userId, setUserId] = useState("");
  const [baseline, setBaseline] = useState<CalibrationResponse | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    health()
      .then((h) => alive && setApi(h.model_connected ? "online" : "no-model"))
      .catch(() => alive && setApi("offline"));
    return () => {
      alive = false;
    };
  }, []);

  const run = async (blob: File | Blob, name: string) => {
    setBusy("Analyzing recording…");
    setError(null);
    try {
      const uid = userId.trim() || undefined;
      const res = await predictUpload(blob, name, uid);
      setResult(res);
      setFileName(name);
      setHover(null);
      setApi("online");
      onLevel(res.session_summary.dominant_workload);
    } catch (e) {
      setError(e instanceof TypeError ? `Cannot reach the API at ${API_URL}. Is the backend running?` : (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const onFile = (f?: File | null) => {
    if (!f) return;
    if (!/\.(csv|json)$/i.test(f.name)) return setError("Please choose a .csv or .json EEG file.");
    run(f, f.name);
  };

  const calibrate = async (f?: File | null) => {
    if (!f) return;
    const uid = userId.trim();
    if (!uid) return setError("Enter a user ID first, so the baseline can be stored for that person.");
    setBusy("Storing resting baseline…");
    setError(null);
    try {
      setBaseline(await calibrateUpload(f, f.name, uid));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const clearBaseline = async () => {
    if (userId.trim()) await clearCalibration(userId.trim());
    setBaseline(null);
  };

  const sum = result?.session_summary;
  const preds = result?.predictions ?? [];
  const usable = preds.filter((p) => p.workload !== "unusable");
  const mean = (k: "confidence" | "theta_alpha_ratio" | "engagement_index" | "frontal_alpha_asymmetry") =>
    usable.length ? usable.reduce((a, p) => a + (p[k] ?? 0), 0) / usable.length : null;
  const active = hover !== null ? preds[hover] : null;

  const apiPill = {
    checking: ["bg-stone-300", "Checking API…"],
    online: ["bg-emerald-500", "API online · model ready"],
    "no-model": ["bg-amber-500", "API online · no model loaded"],
    offline: ["bg-red-500", "API offline"],
  }[api];

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      {/* ── left: inputs ── */}
      <div className="space-y-5">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFile(e.dataTransfer.files[0]);
          }}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
            drag ? "border-brand-600 bg-brand-50" : "border-stone-300 bg-surface"
          }`}
        >
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-100 text-xl text-brand-800">↑</div>
          <p className="mt-3 font-display text-lg font-semibold">Drop an EEG recording</p>
          <p className="mt-1 text-sm text-stone-600">Muse S CSV or JSON, 4 channels at 256 Hz. At least 4 seconds.</p>
          <input ref={fileRef} type="file" accept=".csv,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={!!busy}
              className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              Choose file
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => run(makeSample(16, "rest"), "sample-resting.json")}
                disabled={!!busy}
                className="h-10 rounded-full bg-surface text-xs font-semibold ring-1 ring-ink/15 transition-colors hover:bg-stone-100 disabled:opacity-50"
              >
                Try resting sample
              </button>
              <button
                onClick={() => run(makeSample(16, "task"), "sample-task.json")}
                disabled={!!busy}
                className="h-10 rounded-full bg-surface text-xs font-semibold ring-1 ring-ink/15 transition-colors hover:bg-stone-100 disabled:opacity-50"
              >
                Try task sample
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Personal baseline</h3>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600">Optional</span>
          </div>
          <p className="mt-1 text-sm text-stone-600">
            Upload 8+ seconds of resting EEG for a user. Later predictions with the same ID are compared against it.
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-stone-600" htmlFor="uid">
            User ID
          </label>
          <input
            id="uid"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. participant-07"
            className="mt-1.5 h-10 w-full rounded-lg border border-stone-300 bg-surface px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
          <input ref={baseRef} type="file" accept=".csv,.json" hidden onChange={(e) => calibrate(e.target.files?.[0])} />
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => baseRef.current?.click()}
              disabled={!!busy}
              className="h-10 flex-1 rounded-full bg-brand-700 text-xs font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
            >
              Upload resting file
            </button>
            {baseline && (
              <button onClick={clearBaseline} className="h-10 rounded-full px-4 text-xs font-semibold ring-1 ring-ink/15 hover:bg-stone-100">
                Clear
              </button>
            )}
          </div>
          {baseline && (
            <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-brand-900">
              Baseline stored for <strong>{baseline.user_id}</strong> from {baseline.usable_windows} windows. Resting theta/alpha{" "}
              {fmt(baseline.baseline_tar)}, engagement {fmt(baseline.baseline_engagement, 3)}.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span className={`size-2 rounded-full ${apiPill[0]}`} />
          <span>{apiPill[1]}</span>
          <span className="text-stone-400">·</span>
          <span className="truncate font-mono">{API_URL}</span>
        </div>
      </div>

      {/* ── right: results ── */}
      <div className="min-w-0 rounded-2xl border border-stone-200 bg-surface p-5 sm:p-7">
        {busy && (
          <div className="flex items-center gap-3 rounded-lg bg-brand-50 p-3 text-sm text-brand-900" role="status">
            <span className="size-4 animate-spin rounded-full border-2 border-brand-300 border-t-brand-700" />
            {busy}
            {api === "offline" && " (the server may be waking up, this can take a minute)"}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        {!result && !busy && (
          <div className="grid min-h-[22rem] place-items-center text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-4 flex h-16 items-end justify-center gap-1.5" aria-hidden="true">
                {[0.35, 0.6, 0.9, 0.55, 0.75, 0.4, 0.65].map((h, i) => (
                  <span key={i} className="w-3 rounded-t bg-brand-200" style={{ height: `${h * 100}%` }} />
                ))}
              </div>
              <h3 className="font-display text-2xl font-semibold">Your analysis appears here</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Upload a recording, or try one of the sample signals, to see signal quality, workload per 4-second window and cognitive markers.
              </p>
            </div>
          </div>
        )}

        {result && sum && (
          <div className="space-y-7">
            {/* headline */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-stone-500">{fileName}</p>
                <div className="mt-1 flex items-center gap-3">
                  <h3 className="font-display text-4xl font-semibold">{LEVEL_STYLE[sum.dominant_workload].label} workload</h3>
                  {result.calibrated && (
                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-800">Calibrated</span>
                  )}
                </div>
                <p className="mt-2 max-w-xl text-sm text-stone-600">{LEVEL_STYLE[sum.dominant_workload].blurb}</p>
              </div>
              <div className={`rounded-full px-3 py-1.5 text-xs font-semibold ${result.signal_quality.is_usable ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-800"}`}>
                {result.signal_quality.is_usable ? "Signal usable" : "Signal poor"}
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Duration", `${sum.duration_seconds.toFixed(0)} s`],
                ["Usable windows", `${sum.usable_windows} / ${sum.total_windows}`],
                ["Signal quality", `${Math.round(sum.avg_quality_score * 100)}%`],
                ["Avg confidence", mean("confidence") === null ? "–" : `${Math.round((mean("confidence") ?? 0) * 100)}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-paper p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">{k}</p>
                  <p className="mt-1.5 font-display text-2xl font-semibold">{v}</p>
                </div>
              ))}
            </div>

            {/* timeline */}
            <div>
              <div className="flex items-end justify-between">
                <h4 className="font-display text-lg font-semibold">Workload over time</h4>
                <p className="text-xs text-stone-500">4-second windows · hover for detail</p>
              </div>
              <div className="mt-3 flex h-44 items-end gap-1.5 rounded-xl bg-paper p-3 sm:gap-2" onMouseLeave={() => setHover(null)}>
                {preds.map((p, i) => (
                  <button
                    key={p.window}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    aria-label={`Window ${p.window}: ${p.workload}, confidence ${Math.round(p.confidence * 100)}%`}
                    className="flex h-full min-w-0 flex-1 items-end"
                  >
                    <span
                      className={`bar-grow block w-full rounded-t-md ${LEVEL_STYLE[p.workload].bar} ${hover === i ? "opacity-100 ring-2 ring-ink/40" : "opacity-85"}`}
                      style={{ height: `${LEVEL_STYLE[p.workload].height * 100}%`, animationDelay: `${i * 40}ms` }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-600">
                <span>0 s</span>
                <span className="font-medium text-ink">
                  {active
                    ? `${active.start_time_sec.toFixed(0)}–${active.end_time_sec.toFixed(0)} s · ${LEVEL_STYLE[active.workload].label} · ${Math.round(active.confidence * 100)}% confident · quality ${Math.round(active.quality_score * 100)}%`
                    : "Hover a bar to inspect a window"}
                </span>
                <span>{sum.duration_seconds.toFixed(0)} s</span>
              </div>
            </div>

            {/* distribution */}
            <div>
              <h4 className="font-display text-lg font-semibold">Level distribution</h4>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-stone-100">
                {(["low", "medium", "high", "unusable"] as Level[]).map((l) => {
                  const pct = sum.level_percentages[l] ?? 0;
                  return pct > 0 ? <span key={l} className={LEVEL_STYLE[l].bar} style={{ width: `${pct}%` }} title={`${l} ${pct}%`} /> : null;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-700">
                {(["low", "medium", "high", "unusable"] as Level[]).map((l) => (
                  <span key={l} className="inline-flex items-center gap-1.5">
                    <span className={`size-2.5 rounded-full ${LEVEL_STYLE[l].bar}`} />
                    {LEVEL_STYLE[l].label} {Math.round(sum.level_percentages[l] ?? 0)}%
                  </span>
                ))}
              </div>
            </div>

            {/* markers + quality */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 p-4">
                <h4 className="font-display text-lg font-semibold">Cognitive markers</h4>
                <dl className="mt-3 space-y-2.5 text-sm">
                  {[
                    ["Theta / alpha ratio", fmt(mean("theta_alpha_ratio")), "Higher means more mental effort"],
                    ["Engagement index", fmt(mean("engagement_index"), 3), "Beta / (alpha + theta)"],
                    ["Frontal alpha asymmetry", fmt(mean("frontal_alpha_asymmetry")), "AF8 vs AF7 alpha balance"],
                  ].map(([k, v, hint]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3">
                      <div>
                        <dt className="font-medium">{k}</dt>
                        <dd className="text-xs text-stone-500">{hint}</dd>
                      </div>
                      <span className="font-mono text-base font-semibold text-accent-ink">{v}</span>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-xl border border-stone-200 p-4">
                <h4 className="font-display text-lg font-semibold">Signal quality</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["TP9", "AF7", "AF8", "TP10"].map((c) => {
                    const bad = result.signal_quality.bad_channels.includes(c);
                    return (
                      <span key={c} className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${bad ? "bg-red-100 text-red-800" : "bg-brand-100 text-brand-800"}`}>
                        {c} {bad ? "✕" : "✓"}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  Overall score <strong className="text-ink">{Math.round(result.signal_quality.overall_quality_score * 100)}%</strong>.
                </p>
                {result.signal_quality.rejection_reasons.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-stone-600">
                    {result.signal_quality.rejection_reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-paper text-[11px] uppercase tracking-wider text-stone-600">
                  <tr>
                    {["Window", "Time", "Workload", "Confidence", "Quality", "θ/α", "Engage"].map((h) => (
                      <th key={h} className="px-3 py-2.5 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {preds.map((p, i) => (
                    <tr key={p.window} className={hover === i ? "bg-brand-50" : ""} onMouseEnter={() => setHover(i)}>
                      <td className="px-3 py-2 font-mono">{p.window}</td>
                      <td className="px-3 py-2 font-mono text-stone-600">
                        {p.start_time_sec.toFixed(0)}–{p.end_time_sec.toFixed(0)} s
                      </td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLE[p.workload].chip}`}>{LEVEL_STYLE[p.workload].label}</span>
                      </td>
                      <td className="px-3 py-2 font-mono">{Math.round(p.confidence * 100)}%</td>
                      <td className="px-3 py-2 font-mono">{Math.round(p.quality_score * 100)}%</td>
                      <td className="px-3 py-2 font-mono">{fmt(p.theta_alpha_ratio)}</td>
                      <td className="px-3 py-2 font-mono">{fmt(p.engagement_index, 3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
