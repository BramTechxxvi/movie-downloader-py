import { Clock, Layers, User } from "lucide-react";
import type { MediaAnalysis } from "../types/media";

interface MediaPreviewProps {
  media: MediaAnalysis;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MediaPreview({ media }: MediaPreviewProps) {
  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl glass-card">
      {/* Thumbnail */}
      {media.thumbnail ? (
        <div className="relative h-52 w-full overflow-hidden sm:h-64">
          <img
            src={media.thumbnail}
            alt={media.title}
            className="h-full w-full object-cover"
          />
          {/* gradient scrim so text sits on top if ever needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Duration badge */}
          {media.duration != null && (
            <span
              className="
                absolute bottom-3 right-3 inline-flex items-center gap-1
                rounded-lg bg-black/70 px-2.5 py-1
                text-xs font-semibold text-white backdrop-blur-sm
              "
            >
              <Clock size={11} aria-hidden="true" />
              {formatDuration(media.duration)}
            </span>
          )}
        </div>
      ) : (
        /* Placeholder when no thumbnail */
        <div className="flex h-40 items-center justify-center bg-slate-800/60">
          <span className="text-4xl opacity-20">🎬</span>
        </div>
      )}

      {/* Meta */}
      <div className="space-y-3 p-5">
        {/* Provider badge */}
        <span
          className="
            inline-block rounded-md bg-brand-600/20 px-2.5 py-0.5
            text-xs font-semibold uppercase tracking-widest text-brand-400
          "
        >
          {media.provider}
        </span>

        {/* Title */}
        <h2 className="text-lg font-semibold leading-snug text-slate-100 line-clamp-2">
          {media.title}
        </h2>

        {/* Uploader + formats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
          {media.uploader && (
            <span className="inline-flex items-center gap-1.5">
              <User size={13} aria-hidden="true" />
              {media.uploader}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Layers size={13} aria-hidden="true" />
            {media.formats.length} format{media.formats.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>
    </div>
  );
}
