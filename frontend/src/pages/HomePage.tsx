import { useState } from "react";
import { analyzeMedia, startDownload } from "../api/mediaApi";
import { MediaPreview } from "../components/MediaPreview";
import { UrlInput } from "../components/UrlInput";
import type { MediaAnalysis } from "../types/media";
import { FormatSelector, type FormatSelection } from "../components/FormatSelector";
import { useDownloadStatus } from "../hooks/useDownloadStatus"
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
            setMedia(result)
            setCurrentUrl(url)
        }catch {
            setError("Unable to analyze this URL.");
        } finally {
            setLoading(false);
        }
    }



    async function handleDownload() {
        if(!selection || !currentUrl) {
            return;
        }

        try {
            setStartingDownload(true);
            setError(null);

            const result = await startDownload({
                url: currentUrl,
                formatId: selection.format.format_id,
                mediaType: selection.format.type,
                audioFormat: selection.audioFormat
            });
            setDownloadId(result.download_id)
        }catch {
            setError("Unable to start download")
        } finally {
            setStartingDownload(false);
        }
    }


    return (
        <main className="min-h-screen bg-gray-50 px-4 py-16">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-4xl font-bold tracking-light">
                        Media Downloader
                    </h1>

                    <p className="text-gray-600">
                        Paste a supported media URL to inspect available download options.
                    </p>
                </div>

                <UrlInput onAnalyze={handleAnalyze} loading={loading}/>
                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}
                {media && (
                    <>
                    <MediaPreview media={media} />
                    <FormatSelector formats={media.formats} onSelect={setSelection}/>
                    </>
                )}

                {selection && !downloadId && (
                
                    <button
                    type="button"
                    onClick={handleDownload}
                    disabled={startingDownload}
                    className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                    >
                        {startingDownload
                        ? "Starting..."
                        : "Download" }
                    </button>
                )}

                {downloadStatus && (
                    < DownloadProgress status={downloadStatus}/>
                )}
            </div>
        </main>
    )
}