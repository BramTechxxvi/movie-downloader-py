import { useState } from "react";
import { ArrowDownToLine, Loader2, Sparkles } from "lucide-react";
import { analyzeMedia, startDownload } from "../api/mediaApi";
import { MediaPreview } from "../components/MediaPreview";
import { UrlInput } from "../components/UrlInput";
import type { MediaAnalysis } from "../types/media";
import { FormatSelector, type FormatSelection } from "../components/FormatSelector";
import { useDownloadStatus } from "../hooks/useDownloadStatus";
import { DownloadProgress } from "../components/DownloadProgress";

export function HomePage() {
  const [media, setMedia] = useState<MediaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<FormatSelection | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [startingDownload, setStartingDownload] = useState(false);
  const downloadStatus = useDownloadStatus(downloadId);

  async function handleAnalyze(url: string) {
    try {
      setLoading(true);
      setError(null);
      setMedia(null);
      setSelection(null);
      setDownloadId(null);
      const result = await analyzeMedia(url);
      setMedia(result);
      setCurrentUrl(url);
    } catch {
      setError("Unable to analyze this URL. Check the link and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!selection || !currentUrl) return;
    try {
      setStartingDownload(true);
      setError(null);
      const result = await startDownload({
        url: currentUrl,
        formatId: selection.format.format_id,
        mediaType: selection.format.type,
        audioFormat: selection.audioFormat,
      });
      setDownloadId(result.download_id);
    } catch {
      setError("Unable to start download. Please try again.");
    } finally {
      setStartingDownload(false);
    }
  }

  return (
    <div className="bg-mesh min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header className="mb-10 space-y-3 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-600/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-400">
            <Sparkles size={11} aria-hidden="true" />
            Media Downloader
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Download anything,{" "}
            <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
              instantly
            </span>
          </h1>

          <p className="mx-auto max-w-sm text-base text-slate-400">
            Paste a supported media URL to inspect available formats and grab
            exactly what you need.
          </p>
        </header>

        {/* ── Content stack ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* URL input */}
          <UrlInput onAnalyze={handleAnalyze} loading={loading} />

          {/* Error */}
          {error && (
            <div className="animate-fade-up flex items-start gap-3 rounded-xl border border-red-800/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">⚠</span>
              {error}
            </div>
          )}

          {/* Media preview */}
          {media && <MediaPreview media={media} />}

          {/* Format selector */}
          {media && (
            <FormatSelector formats={media.formats} onSelect={setSelection} />
          )}

          {/* Download trigger */}
          {selection && !downloadId && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={startingDownload}
              className="
                animate-fade-up w-full inline-flex items-center justify-center gap-2
                rounded-2xl bg-brand-600 px-6 py-4
                text-base font-semibold text-white
                shadow-lg shadow-brand-900/40
                transition-all duration-200
                hover:bg-brand-500 active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-50
                focus-ring
              "
            >
              {startingDownload ? (
                <>
                  <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  Starting download…
                </>
              ) : (
                <>
                  <ArrowDownToLine size={17} aria-hidden="true" />
                  Download
                </>
              )}
            </button>
          )}

          {/* Progress */}
          {downloadStatus && <DownloadProgress status={downloadStatus} />}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="pb-8 text-center text-xs text-slate-600">
        Only download content you have the right to use.
      </footer>
    </div>
  );
}
