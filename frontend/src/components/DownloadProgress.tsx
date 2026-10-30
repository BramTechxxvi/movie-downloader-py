import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react'
import { getDownloadFileUrl } from '../api/mediaApi'
import type { DownloadStatus } from '../types/media'

interface DownloadProgressProps {
  status: DownloadStatus
  onRetry?: () => void
}

type StatusConfig = {
  label: string
  icon: React.ReactNode
  barClass: string
  labelClass: string
}

const STATUS_CONFIG: Record<DownloadStatus['status'], StatusConfig> = {
  pending: {
    label: 'Preparing…',
    icon: <Loader2 size={14} className="animate-spin text-slate-400" aria-hidden="true" />,
    barClass: 'bg-slate-600',
    labelClass: 'text-slate-400',
  },
  downloading: {
    label: 'Downloading',
    icon: <span className="pulse-dot" aria-hidden="true" />,
    barClass: 'progress-shimmer',
    labelClass: 'text-brand-400',
  },
  completed: {
    label: 'Complete',
    icon: <CheckCircle2 size={14} className="text-ok-400" aria-hidden="true" />,
    barClass: 'bg-ok-500',
    labelClass: 'text-ok-400',
  },
  failed: {
    label: 'Failed',
    icon: <AlertCircle size={14} className="text-err-400" aria-hidden="true" />,
    barClass: 'bg-err-500',
    labelClass: 'text-err-400',
  },
}

export function DownloadProgress({ status, onRetry }: DownloadProgressProps) {
  const progress = Math.min(Math.max(status.progress, 0), 100)
  const cfg = STATUS_CONFIG[status.status]

  return (
    <div className="animate-fade-up card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 text-sm font-semibold ${cfg.labelClass}`}>
          {cfg.icon}
          {cfg.label}
          {status.filename && status.status !== 'failed' && (
            <span className="ml-1 max-w-[16ch] truncate font-normal text-slate-500">
              {status.filename}
            </span>
          )}
        </span>
        <span className="font-mono text-xs tabular-nums text-slate-500">
          {progress.toFixed(1)}%
        </span>
      </div>

      {/* Progress track */}
      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-700/60"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Download progress: ${progress.toFixed(0)}%`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${cfg.barClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Error detail */}
      {status.status === 'failed' && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-red-800/40 bg-red-950/30 px-3.5 py-3">
          <p className="text-sm text-red-300">
            {status.error ?? 'Download failed. Please try again.'}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-ghost shrink-0 text-xs"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Download file CTA */}
      {status.status === 'completed' && (
        <a
          href={getDownloadFileUrl(status.download_id)}
          className="btn-success focus-ring"
          download
        >
          <Download size={15} aria-hidden="true" />
          Save file
        </a>
      )}
    </div>
  )
}
