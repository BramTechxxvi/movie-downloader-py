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
    )
}