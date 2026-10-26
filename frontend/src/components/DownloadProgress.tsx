import { getDownloadFileUrl } from "../api/mediaApi";
import type { DownloadStatus } from "../types/media";


interface DownloadProgressProps {
    status: DownloadStatus;
}


export function DownloadProgress({status}: DownloadProgressProps) {
    const progress =  Math.min(Math.max(status.progress, 0), 100);

    return (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                    {status.status}
                </span>

                <span className="text-sm text-gray-600">
                    {progress.toFixed(1)}%
                </span>
            </div>

            <div className="h-3 oveflow-hidden rounded-full bg-gray-200">
                <div 
                className="h-full bg-black transition-all duration-300"
                style={{width: `${progress}%`}}
                />
            </div>

            {status.status === "failed" && (
                <p className="text-sm text-red-600">
                    {status.error ?? "Download faile"}
                </p>
            )}

            {status.status === "completed" && (
                <a 
                href={getDownloadFileUrl(status.download_id)}
                className="inline-block rounded-xl bg-black px-5 py-3 font-medium text-white"
                >
                    Download File
                </a>
            )};
        </div>
    );   
}