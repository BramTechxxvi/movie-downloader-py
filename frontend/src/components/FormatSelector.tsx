import { useMemo, useState } from "react";
import type { MediaFormat } from "../types/media"



interface FormatSelectorProps {
    formats: MediaFormat[];
    onSelect: (format: MediaFormat)=> void;
}

export function FormatSelector({formats, onSelect}:FormatSelectorProps) {
    const [mediaType, setMediaType] = useState<"video" | "audio">("video");
    const filteredFormats = useMemo(
        ()=> formats.filter((format)=> format.type === mediaType),
        [formats, mediaType]
    );

    return (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex gap-2">
                <button
                type="button"
                onClick={()=> setMediaType("video")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    mediaType === "video"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Video
                </button>

               <button
                type="button"
                onClick={()=> setMediaType("audio")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    mediaType === "audio"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Audio
                </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {filteredFormats.map((format) => (
                    <button
                    key={format.format_id}
                    type="button"
                    onClick={()=> onSelect(format)}
                    className="rounded-xl border border-gray-200 p-4 text-left transition hover:border-black"
                    >
                        <p className="font-medium">
                            {format.resolution ?? "Audio"};
                        </p>
                        <p className="text-sm text-gray-500">
                            {format.extension.toUpperCase()};
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}