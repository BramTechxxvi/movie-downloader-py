import { AlertCircle, CheckCircle2, Download, Loader2 } from "lucide-react";
import { getDownloadFileUrl } from "../api/mediaApi";
import type { DownloadStatus } from "../types/media";

interface DownloadProgressProps {
  status: DownloadStatus;
}

const STATUS_CONFIG = {
  pending: {
    label: "Preparing…",
    icon: <Loader2 size={15} className="animate-spin text-slate-400" aria-hidden="true" />,
    barClass: "bg-slate-500",
    textClass: "text-slate-400",
  },
  downloading: {
    label: "Downloading",
    icon: <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand-400" aria-hidden="true" />,
    barClass: "progress-shimmer",
    textClass: "text-brand-300",
  },
  completed: {
    label: "Complete",
    icon: <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />,
    barClass: "bg-emerald-500",
    textClass: "text-emerald-400",
  },
  failed: {
    label: "Failed",
    icon: <AlertCircle size={15} className="text-red-400" aria-hidden="true" />,
    barClass: "bg-red-500",
    textClass: "text-red-400",
  },
} satisfies Record<DownloadStatus["status"], { label: string; icon: React.ReactNode; barClass: string; textClass: string }>;

export function DownloadProgress({ status }: DownloadProgressProps) {
  const progress = Math.min(Math.max(status.progress, 0), 100);
  const cfg = STATUS_CONFIG[status.status];

  return (
    <div className="animate-fade-up space-y-4 rounded-2xl glass-card p-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 text-sm font-semibold ${cfg.textClass}`}>
          {cfg.icon}
          {cfg.label}
        </span>
        <span className="font-mono text-sm font-medium text-slate-400">
          {progress.toFixed(1)}%
        </span>
      </div>

      {/* Progress track */}
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-700/60"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Download progress"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${cfg.barClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Error message */}
      {status.status === "failed" && (
        <p className="rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300 border border-red-800/40">
          {status.error ?? "Download failed. Please try again."}
        </p>
      )}

      {/* Download file button */}
      {status.status === "completed" && (
        <a
          href={getDownloadFileUrl(status.download_id)}
          className="
            inline-flex items-center gap-2
            rounded-xl bg-emerald-600 px-5 py-2.5
            text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-emerald-500 active:scale-95
            focus-ring
          "
        >
          <Download size={15} aria-hidden="true" />
          Download File
        </a>
      )}
    </div>
  );
}
