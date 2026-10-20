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