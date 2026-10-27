import { useEffect, useState } from "react";
import { getDownloadStatus } from "../api/mediaApi";
import type { DownloadStatus } from "../types/media";





export function useDownloadStatus(downloadId: string | null) {
    const [status, setStatus] = useState<DownloadStatus | null>(null);
    useEffect(()=> {
        if (!downloadId) {
            return;
        };

        const id = downloadId
        let cancelled = false;
        async function poll() {
            try {
                const result = await getDownloadStatus(id)
                if(cancelled) {
                    return;
                }
                setStatus(result)

                if(result.status === "completed" || result.status === "failed") {
                    return;
                }
                setTimeout(poll, 1000)
            }catch {
                if(!cancelled) {
                    setTimeout(poll, 1000);
                }
            }
        };
        poll();

        return ()=> {
            cancelled = true;
        };
    }, [downloadId]);

    return status;
}