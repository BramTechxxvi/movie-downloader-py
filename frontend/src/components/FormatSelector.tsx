import { useMemo, useState } from "react";
import { CheckCircle2, Film, Music } from "lucide-react";
import type { MediaFormat } from "../types/media";

export interface FormatSelection {
  format: MediaFormat;
  audioFormat: "original" | "mp3";
}

interface FormatSelectorProps {
  formats: MediaFormat[];
  onSelect: (selection: FormatSelection | null) => void;
}

export function FormatSelector({ formats, onSelect }: FormatSelectorProps) {
  const [mediaType, setMediaType] = useState<"video" | "audio">("video");
  const [audioFormat, setAudioFormat] = useState<"original" | "mp3">("original");
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat | null>(null);

  const filteredFormats = useMemo(
    () => formats.filter((f) => f.type === mediaType),
    [formats, mediaType],
  );

  function selectFormat(format: MediaFormat) {
    setSelectedFormat(format);
    onSelect({ format, audioFormat });
  }

  function changeAudioFormat(value: "original" | "mp3") {
    setAudioFormat(value);
    if (selectedFormat) {
      onSelect({ format: selectedFormat, audioFormat: value });
    }
  }

  function changeMediaType(type: "video" | "audio") {
    if (type === mediaType) return;
    setMediaType(type);
    setSelectedFormat(null);
    onSelect(null);
  }

  return (
    <section className="animate-fade-up space-y-5 rounded-2xl glass-card p-5">
      {/* ── Type toggle ───────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Media type"
        className="inline-flex rounded-xl bg-slate-800/60 p-1 gap-1"
      >
        {(["video", "audio"] as const).map((type) => {
          const Icon = type === "video" ? Film : Music;
          const active = mediaType === type;
          return (
            <button
              key={type}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => changeMediaType(type)}
              className={`
                inline-flex items-center gap-2 rounded-lg px-4 py-2
                text-sm font-semibold capitalize transition-all duration-200
                focus-ring
                ${
                  active
                    ? "bg-brand-600 text-white shadow-md shadow-brand-900/40"
                    : "text-slate-400 hover:text-slate-200"
                }
              `}
            >
              <Icon size={14} aria-hidden="true" />
              {type}
            </button>
          );
        })}
      </div>

      {/* ── Audio output selector ──────────────────────────────────── */}
      {mediaType === "audio" && (
        <fieldset className="space-y-2">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Output format
          </legend>
          <div className="flex flex-wrap gap-3">
            {(["original", "mp3"] as const).map((value) => {
              const checked = audioFormat === value;
              return (
                <label
                  key={value}
                  className={`
                    inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5
                    text-sm font-medium transition-all duration-200
                    ${
                      checked
                        ? "border-brand-500 bg-brand-600/15 text-brand-300"
                        : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="audioFormat"
                    value={value}
                    checked={checked}
                    onChange={() => changeAudioFormat(value)}
                    className="sr-only"
                  />
                  <span
                    className={`
                      flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2
                      transition-colors duration-200
                      ${checked ? "border-brand-500 bg-brand-500" : "border-slate-600"}
                    `}
                  >
                    {checked && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  {value === "original" ? "Original" : "MP3"}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* ── Format grid ───────────────────────────────────────────── */}
      {filteredFormats.length === 0 ? (
        <p className="rounded-xl bg-slate-800/50 py-6 text-center text-sm text-slate-500">
          No {mediaType} formats available
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredFormats.map((format) => {
            const active = selectedFormat?.format_id === format.format_id;
            return (
              <button
                key={format.format_id}
                type="button"
                onClick={() => selectFormat(format)}
                className={`
                  group relative rounded-xl border p-4 text-left
                  transition-all duration-200 focus-ring
                  ${
                    active
                      ? "border-brand-500 bg-brand-600/10 shadow-[0_0_0_1px_rgba(99,102,241,0.5)]"
                      : "border-slate-700/60 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60"
                  }
                `}
              >
                {/* selected check */}
                {active && (
                  <CheckCircle2
                    size={16}
                    className="absolute right-3 top-3 text-brand-400"
                    aria-hidden="true"
                  />
                )}

                <p
                  className={`font-semibold text-sm ${
                    active ? "text-brand-300" : "text-slate-200"
                  }`}
                >
                  {format.resolution ?? "Audio"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500 uppercase tracking-wide">
                  {format.extension}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
