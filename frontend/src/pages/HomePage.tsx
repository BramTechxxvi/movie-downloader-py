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
        
    )
}