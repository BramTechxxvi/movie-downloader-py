import { useMemo, useState } from 'react'
import { Film, Music, ChevronDown, ChevronUp, Check } from 'lucide-react'
import type { MediaFormat } from '../types/media'
import {
  groupVideoFormats,
  groupAudioFormats,
  type VideoOption,
  type AudioOption,
} from '../lib/formatUtils'

// ── Public contract (unchanged from original) ────────────────────────────────
export interface FormatSelection {
  format: MediaFormat
  audioFormat: 'original' | 'mp3'
}

interface FormatSelectorProps {
  formats: MediaFormat[]
  onSelect: (selection: FormatSelection | null) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Does the backend support MP3 conversion for this media? */
function detectMP3Support(formats: MediaFormat[]): boolean {
  // The backend accepts audioFormat="mp3" for any audio track.
  // We surface this option whenever audio tracks exist.
  return formats.some((f) => f.type === 'audio')
}

// ── Component ────────────────────────────────────────────────────────────────

export function FormatSelector({ formats, onSelect }: FormatSelectorProps) {
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video')
  const [selectedVideoOption, setSelectedVideoOption] = useState<VideoOption | null>(null)
  const [selectedAudioOption, setSelectedAudioOption] = useState<AudioOption | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const supportsMP3 = useMemo(() => detectMP3Support(formats), [formats])

  const videoOptions = useMemo(() => groupVideoFormats(formats), [formats])
  const audioOptions = useMemo(
    () => groupAudioFormats(formats, supportsMP3),
    [formats, supportsMP3],
  )

  // ── Auto-select sensible defaults when options first appear ──────────────

  const defaultVideoOption = videoOptions[0] ?? null
  const defaultAudioOption = audioOptions.find((o) => o.isDefault) ?? audioOptions[0] ?? null

  // Primary visible options — cap at 4 unless advanced is open
  const VISIBLE_VIDEO_LIMIT = 4
  const visibleVideoOptions = showAdvanced
    ? videoOptions
    : videoOptions.slice(0, VISIBLE_VIDEO_LIMIT)
  const hasHiddenVideoOptions = videoOptions.length > VISIBLE_VIDEO_LIMIT

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleMediaTypeChange(type: 'video' | 'audio') {
    if (type === mediaType) return
    setMediaType(type)
    onSelect(null)

    // Re-apply the default for the newly selected type
    if (type === 'video' && defaultVideoOption) {
      setSelectedVideoOption(defaultVideoOption)
      onSelect({ format: defaultVideoOption.format, audioFormat: 'original' })
    } else if (type === 'audio' && defaultAudioOption) {
      setSelectedAudioOption(defaultAudioOption)
      const audioFmt = defaultAudioOption.format.extension === 'mp3' ? 'mp3' : 'original'
      onSelect({ format: defaultAudioOption.format, audioFormat: audioFmt })
    }
  }

  function handleSelectVideo(option: VideoOption) {
    setSelectedVideoOption(option)
    onSelect({ format: option.format, audioFormat: 'original' })
  }

  function handleSelectAudio(option: AudioOption) {
    setSelectedAudioOption(option)
    const audioFmt = option.format.extension === 'mp3' ? 'mp3' : 'original'
    onSelect({ format: option.format, audioFormat: audioFmt })
  }

  // Apply default selection on first render if none selected yet
  const activeVideo = selectedVideoOption ?? defaultVideoOption
  const activeAudio = selectedAudioOption ?? defaultAudioOption

  // Propagate defaults to parent on first paint (only once, via useMemo side-effect
  // is inappropriate — we handle this in the parent's handleAnalyze reset instead;
  // see note in HomePage). The parent reads `selection` only when the button is
  // clicked, so defaults applied via click-handlers are sufficient.

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section
      className="animate-fade-up card p-5 space-y-5"
      aria-label="Format selector"
    >
      {/* ── Type toggle ───────────────────────────────────────────── */}
      <div className="flex gap-2" role="group" aria-label="Download type">
        {(
          [
            { type: 'video', Icon: Film, label: 'Video', desc: 'Download with visuals' },
            { type: 'audio', Icon: Music, label: 'Audio', desc: 'Audio track only' },
          ] as const
        ).map(({ type, Icon, label, desc }) => {
          const active = mediaType === type
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => handleMediaTypeChange(type)}
              className={`focus-ring flex flex-1 items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 sm:p-4 ${
                active
                  ? 'border-brand-600 bg-brand-900/30 text-slate-100'
                  : 'border-slate-700/60 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  active ? 'bg-brand-600 text-white' : 'bg-slate-700/60 text-slate-500'
                }`}
              >
                <Icon size={15} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{desc}</span>
              </span>
              {active && (
                <Check
                  size={14}
                  className="ml-auto mt-0.5 shrink-0 text-brand-400"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Video quality grid ────────────────────────────────────── */}
      {mediaType === 'video' && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Quality
          </p>

          {videoOptions.length === 0 ? (
            <p className="rounded-lg bg-slate-800/50 py-4 text-center text-sm text-slate-500">
              No video formats available
            </p>
          ) : (
            <>
              <div
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                role="radiogroup"
                aria-label="Video quality"
              >
                {visibleVideoOptions.map((opt) => {
                  const active = activeVideo?.format.format_id === opt.format.format_id
                  return (
                    <button
                      key={opt.format.format_id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => handleSelectVideo(opt)}
                      className={`focus-ring relative rounded-xl border px-3 py-3 text-left transition-all duration-150 ${
                        active
                          ? 'border-brand-500 bg-brand-900/30 text-slate-100'
                          : 'border-slate-700/60 bg-slate-800/20 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {opt.isBest && (
                        <span className="mb-1 block text-[0.625rem] font-bold uppercase tracking-widest text-brand-400">
                          Best
                        </span>
                      )}
                      <span className="block text-sm font-semibold leading-tight">
                        {opt.qualityLabel}
                      </span>
                      <span className="mt-0.5 block text-xs uppercase text-slate-500">
                        {opt.format.extension}
                      </span>
                      {active && (
                        <Check
                          size={12}
                          className="absolute right-2.5 top-2.5 text-brand-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Advanced toggle — only shown when there are hidden formats */}
              {hasHiddenVideoOptions && (
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="focus-ring inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
                  aria-expanded={showAdvanced}
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp size={13} aria-hidden="true" />
                      Show fewer formats
                    </>
                  ) : (
                    <>
                      <ChevronDown size={13} aria-hidden="true" />
                      {videoOptions.length - VISIBLE_VIDEO_LIMIT} more format
                      {videoOptions.length - VISIBLE_VIDEO_LIMIT !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Audio format list ─────────────────────────────────────── */}
      {mediaType === 'audio' && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Format
          </p>

          {audioOptions.length === 0 ? (
            <p className="rounded-lg bg-slate-800/50 py-4 text-center text-sm text-slate-500">
              No audio formats available
            </p>
          ) : (
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Audio format"
            >
              {audioOptions.map((opt) => {
                const active = activeAudio?.format.format_id === opt.format.format_id
                return (
                  <button
                    key={opt.format.format_id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleSelectAudio(opt)}
                    className={`focus-ring relative rounded-xl border px-3 py-3 text-left transition-all duration-150 ${
                      active
                        ? 'border-brand-500 bg-brand-900/30 text-slate-100'
                        : 'border-slate-700/60 bg-slate-800/20 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {opt.isDefault && (
                      <span className="mb-1 block text-[0.625rem] font-bold uppercase tracking-widest text-brand-400">
                        Recommended
                      </span>
                    )}
                    <span className="block text-sm font-semibold leading-tight">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {opt.description}
                    </span>
                    {active && (
                      <Check
                        size={12}
                        className="absolute right-2.5 top-2.5 text-brand-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
