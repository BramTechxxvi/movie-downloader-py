import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { analyzeMedia, startDownload } from '../api/mediaApi'
import { Navbar } from '../components/Navbar'
import { UrlInput } from '../components/UrlInput'
import { MediaPreview } from '../components/MediaPreview'
import { FormatSelector, type FormatSelection } from '../components/FormatSelector'
import { DownloadButton } from '../components/DownloadButton'
import { DownloadProgress } from '../components/DownloadProgress'
import { useDownloadStatus } from '../hooks/useDownloadStatus'
import type { MediaAnalysis } from '../types/media'

export function HomePage() {
  // ── State (identical to original) ───────────────────────────────────────
  const [media, setMedia] = useState<MediaAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selection, setSelection] = useState<FormatSelection | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [downloadId, setDownloadId] = useState<string | null>(null)
  const [startingDownload, setStartingDownload] = useState(false)

  const downloadStatus = useDownloadStatus(downloadId)

  // ── Handlers (identical logic to original) ───────────────────────────────

  async function handleAnalyze(url: string) {
    try {
      setLoading(true)
      setError(null)
      setMedia(null)
      setSelection(null)
      setDownloadId(null)
      const result = await analyzeMedia(url)
      setMedia(result)
      setCurrentUrl(url)
    } catch {
      setError('Unable to analyze this URL. Check that it\'s publicly accessible and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    if (!selection || !currentUrl) return
    try {
      setStartingDownload(true)
      setError(null)
      const result = await startDownload({
        url: currentUrl,
        formatId: selection.format.format_id,
        mediaType: selection.format.type,
        audioFormat: selection.audioFormat,
      })
      setDownloadId(result.download_id)
    } catch {
      setError('Unable to start download. Please try again.')
    } finally {
      setStartingDownload(false)
    }
  }

  function handleRetry() {
    setDownloadId(null)
    setError(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="page-bg">
      <Navbar />

      <main id="main-content" className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="mb-10 text-center sm:mb-12" aria-label="Introduction">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            Your media.{' '}
            <span className="text-brand-400">Your format.</span>{' '}
            Your choice.
          </h1>
          <p className="mx-auto max-w-md text-[0.9375rem] leading-relaxed text-slate-400">
            Analyze supported media links and download in the format and
            quality that work for you.
          </p>
        </section>

        {/* ── URL input ─────────────────────────────────────────── */}
        <UrlInput onAnalyze={handleAnalyze} loading={loading} />

        {/* ── Skeleton while analyzing ──────────────────────────── */}
        {loading && (
          <div className="mt-4 space-y-3" aria-busy="true" aria-label="Analyzing link">
            <div className="card flex gap-4 p-4">
              <div className="skeleton h-20 w-32 rounded-lg sm:h-24 sm:w-40" />
              <div className="flex flex-1 flex-col justify-center gap-2.5">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            </div>
            <div className="card p-5 space-y-3">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-20 flex-1 rounded-xl" />
                <div className="skeleton h-20 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* ── API / network error ───────────────────────────────── */}
        {error && !loading && (
          <div
            role="alert"
            className="animate-fade-up mt-4 flex items-start gap-3 rounded-xl border border-red-800/40 bg-red-950/30 px-4 py-3.5 text-sm text-red-300"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────── */}
        {!loading && media && (
          <div className="mt-4 space-y-3">
            <MediaPreview media={media} />
            <FormatSelector formats={media.formats} onSelect={setSelection} />

            {/* Download action — hidden once job is started */}
            {selection && !downloadId && (
              <DownloadButton
                selection={selection}
                loading={startingDownload}
                onClick={handleDownload}
              />
            )}

            {/* Progress / completion */}
            {downloadStatus && (
              <DownloadProgress
                status={downloadStatus}
                onRetry={downloadStatus.status === 'failed' ? handleRetry : undefined}
              />
            )}
          </div>
        )}

        {/* ── Supported sources note ────────────────────────────── */}
        {!media && !loading && (
          <p className="mt-6 text-center text-xs text-slate-600">
            Works with YouTube, Vimeo, SoundCloud, and other supported platforms.
            Only download content you have the right to use.
          </p>
        )}
      </main>
    </div>
  )
}
