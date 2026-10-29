import { useMemo, useState } from "react";
import type { MediaFormat } from "../types/media"






export interface FormatSelection{
    format: MediaFormat;
    audioFormat: "original" | "mp3"
}


interface FormatSelectorProps {
    formats: MediaFormat[];
    onSelect: (selection: FormatSelection | null)=> void;
}




export function FormatSelector({formats, onSelect}:FormatSelectorProps) {
    const [mediaType, setMediaType] = useState<"video" | "audio">("video");
    const filteredFormats = useMemo(
        ()=> formats.filter((format)=> format.type === mediaType),
        [formats, mediaType]
    );

    const [audioFormat, setAudioFormat] = useState<"original" | "mp3">("original");
    const [selectedFormat, setSelectedFormat] =  useState<MediaFormat | null>(null);


    function selectFormat(format: MediaFormat) {
        setSelectedFormat(format);
        onSelect({ format, audioFormat });
    };


    function changeAudioFormat(value: "original" | "mp3") {
        setAudioFormat(value);
        if (selectedFormat) {
            onSelect({format: selectedFormat, audioFormat: value});
        };
    };


    function changeMediaType(type: "video" | "audio") {
        if (type === mediaType) {
            return;
        }
        setMediaType(type);
        setSelectedFormat(null);
        onSelect(null);
    }

    return (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex gap-2">
                {(["video", "audio"] as const).map((type)=> (
                <button
                key={type}
                type="button"
                onClick={()=> changeMediaType(type)}
                className={`rounded-lg px-4 py-2 font-medium capitalize ${
                    mediaType === type
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                >
                    {type}
                </button>
                ))}
            </div>

            {mediaType === "audio" && (
                <fieldset className="space-y-2">
                    <legend className="font-medium">
                        Audio output
                    </legend>

                    <label className="flex items-center gap-2">
                        <input 
                        type="radio" 
                        name="audioFormat"
                        value="original"
                        checked={audioFormat === "original"}
                        onChange={()=> changeAudioFormat("original")}
                        />
                        Original audio
                    </label>

                    <label className="flex items-center gap-2">
                        <input 
                        type="radio" 
                        name="audioFormat"
                        value="mp3"
                        checked={audioFormat === "mp3"}
                        onChange={()=> changeAudioFormat("mp3")}
                        />
                        MP3
                    </label>
                </fieldset>
            )}

            {filteredFormats.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No {mediaType} formats are available
                </p>
            ): (
                <div className="grid gap-3 sm:grid-cols-2">
                    {filteredFormats.map((format) => (
                        <button
                        key={format.format_id}
                        type="button"
                        onClick={()=> selectFormat(format)}
                        className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            selectedFormat?.format_id === format.format_id
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-gray-200 hover:border-gray-400"
                        }`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">
                                        {format.resolution ?? "Audio"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {format.extension.toUpperCase()}
                                    </p>
                                </div>
                                
                                {selectedFormat?.format_id === format.format_id && (
                                    <span className="text-sm font-semibold text-blue-700">
                                        Selected ✓
                                    </span>
                                )}
                            </div>
                    </button>
                ))}
            </div>
            )} 
        </section>
    );
}