import { Divide } from "lucide-react";
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

            <div></div>
        </div>
    )
        
}