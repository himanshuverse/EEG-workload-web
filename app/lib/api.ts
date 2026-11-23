export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Level = "low" | "medium" | "high" | "unusable";

export interface Prediction {
  window: number;
  start_time_sec: number;
  end_time_sec: number;
  workload: Level;
  confidence: number;
  quality_score: number;
  theta_alpha_ratio: number | null;
  engagement_index: number | null;
  frontal_alpha_asymmetry: number | null;
  details?: Record<string, number> | null;
}

export interface PredictResponse {
  session_id: string;
  user_id: string | null;
  calibrated: boolean;
  message: string;
  predictions: Prediction[];
  signal_quality: {
    is_usable: boolean;
    overall_quality_score: number;
    bad_channels: string[];
    rejection_reasons: string[];
  };
  session_summary: {
    duration_seconds: number;
    total_windows: number;
    usable_windows: number;
    rejected_windows: number;
    dominant_workload: Level;
    level_percentages: Record<string, number>;
    avg_quality_score: number;
  };
}

export interface CalibrationResponse {
  user_id: string;
  is_calibrated: boolean;
  usable_windows: number;
  baseline_tar: number;
  baseline_engagement: number;
  message: string;
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail ?? j);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function health(): Promise<{ model_connected: boolean; version: string }> {
  return parse(await fetch(`${API_URL}/health`));
}

export async function predictUpload(file: File | Blob, name: string, userId?: string): Promise<PredictResponse> {
  const form = new FormData();
  form.append("file", file, name);
  form.append("session_id", name);
  if (userId) form.append("user_id", userId);
  return parse(await fetch(`${API_URL}/predict/upload`, { method: "POST", body: form }));
}

export async function calibrateUpload(file: File | Blob, name: string, userId: string): Promise<CalibrationResponse> {
  const form = new FormData();
  form.append("file", file, name);
  form.append("user_id", userId);
  return parse(await fetch(`${API_URL}/calibrate/upload`, { method: "POST", body: form }));
}

export async function clearCalibration(userId: string): Promise<void> {
  await fetch(`${API_URL}/calibrate/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

/** Synthetic 4-channel Muse-style recording (256 Hz) so the pipeline can be tried without a file. */
export function makeSample(seconds: number, load: "rest" | "task"): Blob {
  const fs = 256;
  const n = fs * seconds;
  const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random());
  const [thetaAmp, alphaAmp, betaAmp] = load === "rest" ? [6, 22, 4] : [20, 8, 16];
  const ch = [0, 1, 2, 3].map((c) => {
    const out: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / fs;
      out[i] =
        thetaAmp * Math.sin(2 * Math.PI * 6 * t + c) +
        alphaAmp * Math.sin(2 * Math.PI * 10 * t + c * 0.7) +
        betaAmp * Math.sin(2 * Math.PI * 20 * t + c * 1.3) +
        gauss() * 4;
    }
    return out;
  });
  return new Blob([JSON.stringify({ eeg_data: ch, sampling_rate: fs })], { type: "application/json" });
}
