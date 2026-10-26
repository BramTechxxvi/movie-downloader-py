import { useMemo, useState } from "react";
import type { MediaFormat } from "../types/media"






export interface FormatSelection{
    format: MediaFormat;
    audioFormat: "original" | "mp3"
}


interface FormatSelectorProps {
    formats: MediaFormat[];
    onSelect: (selection: FormatSelection)=> void;
}




export function FormatSelector({formats, onSelect}:FormatSelectorProps) {
    const [mediaType, setMediaType] = useState<"video" | "audio">("video");
    const filteredFormats = useMemo(
        ()=> formats.filter((format)=> format.type === mediaType),
        [formats, mediaType]
    );
    const [audioFormat, setAudioFormat] = useState<"original" | "mp3">("original");


    function selectFormat(format: MediaFormat) {
        onselect({ format, audioFormat });
    }

    function changeAudioFormat(value: "original" | "mp3") {
        setAudioFormat(value)
    }
    return (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex gap-2">
                {(["video", "audio"] as const).map((type)=> (
                <button
                key={type}
                type="button"
                onClick={()=> setMediaType(type)}
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
            )} 
        </section>
    );
}