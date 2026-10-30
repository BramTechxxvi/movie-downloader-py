import { Clock, Layers, User, Film } from 'lucide-react'
import type { MediaAnalysis } from '../types/media'

interface MediaPreviewProps {
  media: MediaAnalysis
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

export function MediaPreview({ media }: MediaPreviewProps) {
  return (
    <div className="animate-fade-up card overflow-hidden">
      {/* Thumbnail row */}
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Thumbnail or fallback */}
        <div className="relative shrink-0">
          {media.thumbnail ? (
            <img
              src={media.thumbnail}
              alt=""
              aria-hidden="true"
              className="h-20 w-32 rounded-lg object-cover sm:h-24 sm:w-40"
              loading="lazy"
            />
          ) : (
            /* Icon-based fallback — no emoji */
            <div
              className="flex h-20 w-32 items-center justify-center rounded-lg bg-slate-800 sm:h-24 sm:w-40"
              aria-hidden="true"
            >
              <Film size={28} className="text-slate-600" />
            </div>
          )}

          {/* Duration badge */}
          {media.duration != null && (
            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white backdrop-blur-sm">
              <Clock size={9} aria-hidden="true" />
              {formatDuration(media.duration)}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex min-w-0 flex-col justify-center gap-1.5">
          {/* Provider */}
          <span className="inline-block w-fit rounded border border-brand-800/60 bg-brand-900/40 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-widest text-brand-400">
            {media.provider}
          </span>

          {/* Title */}
          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100 sm:text-base">
            {media.title}
          </h2>

          {/* Secondary meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            {media.uploader && (
              <span className="inline-flex items-center gap-1">
                <User size={11} aria-hidden="true" />
                {media.uploader}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Layers size={11} aria-hidden="true" />
              {media.formats.length} format{media.formats.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
