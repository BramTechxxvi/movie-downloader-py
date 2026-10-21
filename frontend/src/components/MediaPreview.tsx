import type { MediaAnalysis } from "../types/media";




interface MediaPreviewProps {
    media: MediaAnalysis;
}

export function MediaPreview({media}: MediaPreviewProps) {
    return(
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {media.thumbnail && (
                <img src={media.thumbnail} alt={media.title} 
                className="h-64 w-full object-cover"
                />
            )}

            <div className="space-y-2 p-5">
                <p className="text-sm font-medium uppercae text-gray-500">
                    {media.provider}
                </p>

                <h2 className="text-xl font-semibold">{media.title}</h2>
                {media.uploader && (
                    <p className="text-sm text-gray-600">
                        Uploaded by {media.uploader}
                    </p>
                )}
                <p className="text-sm text-gray-500">
                    {media.formats.length} formats available
                </p>

            </div>
        </div>
    )
}