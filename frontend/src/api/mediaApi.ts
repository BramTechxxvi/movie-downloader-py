import type { MediaAnalysis } from "../types/media";







const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function analyzeMedia(url: string):
Promise<MediaAnalysis> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/media/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({url})
        }
    );
    if(!response.ok) {
        throw new Error("Unable to analyze media")
    }
    return response.json();
}