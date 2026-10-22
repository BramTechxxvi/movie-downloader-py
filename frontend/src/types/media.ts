export interface MediaFormat {
    format_id: string;
    type: "video" | "audio";
    resolution: string | null;
    extension: string;
}

export interface MediaAnalysis {
    provider: string;
    id: string;
    title: string;
    thumbnail: string | null;
    duration: number | null;
    uploader: string | null;
    formats: MediaFormat[];
}

export interface StartDownloadResponse {
    download_id: string;
    status: string;
}

export interface DownloadStatus {
    download_id: string;
    status: "pending" | "downloading" |"completed" | "failed";
    progress: number;
    filename: string | null;
    error: string | null
}