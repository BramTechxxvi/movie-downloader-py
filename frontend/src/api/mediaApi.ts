import type { 
    MediaAnalysis,
    DownloadStatus,
 } from "../types/media";



 interface StartDownloadRequest {
    url: string;
    formatId: string;
    mediaType: "video" | "audio";
    audioFormat: "original" | "mp3";
 }



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
};



export async function startDownload({
    url, formatId, mediaType, audioFormat = "original",
}: StartDownloadRequest) {
    const response = await fetch(`${API_BASE_URL}/api/v1/downloads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url, 
            format_id: formatId,
            media_type: mediaType,
            audio_format: audioFormat
        })
    });
    if (!response.ok) {
        throw new Error("Unable to start download");
    }
    return response.json();
};



export async function getDownloadStatus(downloadId: string): Promise<DownloadStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/downloads/${downloadId}`);
    if(!response.ok) {
        throw new Error("Unable to fetch download status");
    }
    return response.json();
}


export function getDownloadFileUrl(downloadId: string) {
    return `${API_BASE_URL}/api/v1/downloads/${downloadId}/file`
}