import { useState } from "react";
import { analyzeMedia } from "../api/mediaApi";
import { MediaPreview } from "../components/MediaPreview";
import { UrlInput } from "../components/UrlInput";
import type { MediaAnalysis } from "../types/media";






export function HomePage() {
    const [media, setMedia] = useState<MediaAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAnalyze(url: string) {
        try {
            setLoading(true);
            setError(null);
            setMedia(null);

            const result = await analyzeMedia(url);
            setMedia(result)
        }catch {
            setError("Unable to analyze this URL.");
        } finally {
            setLoading(false);
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
                {media && <MediaPreview media={media}/>}
            </div>
        </main>
    )
}