/**
 * formatUtils.ts
 *
 * Pure functions that transform the raw MediaFormat[] returned by the backend
 * into user-friendly grouped options for the FormatSelector.
 *
 * No React, no side effects, no API calls — fully testable in isolation.
 * All types are imported from the canonical types/media module; nothing is
 * duplicated or redefined here.
 */

import type { MediaFormat } from '../types/media'

// ---------------------------------------------------------------------------
// Resolution ordering
// ---------------------------------------------------------------------------

/**
 * Numeric height extracted from a resolution string like "1080p" or "720p".
 * Returns 0 for any format that has no resolution (audio-only tracks).
 */
export function resolutionHeight(resolution: string | null): number {
  if (!resolution) return 0
  const match = resolution.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Sort order: highest resolution first.  Formats with equal resolution are
 * further sorted by extension so MP4 appears before WebM before others.
 */
const EXT_PREFERENCE: Record<string, number> = { mp4: 0, webm: 1, mkv: 2 }

function extOrder(ext: string): number {
  return EXT_PREFERENCE[ext.toLowerCase()] ?? 99
}

// ---------------------------------------------------------------------------
// Video grouping
// ---------------------------------------------------------------------------

export interface VideoOption {
  /** The underlying raw format — passed straight through to the API */
  format: MediaFormat
  /** Human-readable quality label shown in the UI, e.g. "1080p Full HD" */
  qualityLabel: string
  /** Whether this is the recommended "Best available" option */
  isBest: boolean
}

/** Map common heights to friendly labels */
const HEIGHT_LABELS: Record<number, string> = {
  2160: '4K Ultra HD',
  1440: '1440p QHD',
  1080: '1080p Full HD',
  720: '720p HD',
  480: '480p',
  360: '360p',
  240: '240p',
  144: '144p',
}

export function qualityLabel(resolution: string | null): string {
  if (!resolution) return 'Unknown quality'
  const h = resolutionHeight(resolution)
  return HEIGHT_LABELS[h] ?? resolution
}

/**
 * Returns a sorted, deduplicated list of VideoOptions from the raw formats.
 *
 * Deduplication key: resolution + extension.  When two raw formats share the
 * same key, we keep the first one encountered after sorting (highest-quality
 * MP4 first).
 *
 * The first entry in the returned array is also flagged as `isBest`.
 */
export function groupVideoFormats(formats: MediaFormat[]): VideoOption[] {
  const videoFormats = formats.filter((f) => f.type === 'video')

  // Sort: highest height first, then MP4 > WebM > others
  const sorted = [...videoFormats].sort((a, b) => {
    const heightDiff = resolutionHeight(b.resolution) - resolutionHeight(a.resolution)
    if (heightDiff !== 0) return heightDiff
    return extOrder(a.extension) - extOrder(b.extension)
  })

  // Deduplicate by resolution+extension key
  const seen = new Set<string>()
  const unique = sorted.filter((f) => {
    const key = `${f.resolution ?? 'null'}:${f.extension}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique.map((format, index) => ({
    format,
    qualityLabel: qualityLabel(format.resolution),
    isBest: index === 0,
  }))
}

// ---------------------------------------------------------------------------
// Audio grouping
// ---------------------------------------------------------------------------

export interface AudioOption {
  /** The underlying raw format */
  format: MediaFormat
  /** Human-readable label, e.g. "MP3" or "M4A" */
  label: string
  /** Short description shown below the label */
  description: string
  /** Whether this is the recommended default */
  isDefault: boolean
}

/** Preferred audio extensions, in priority order */
const AUDIO_EXT_ORDER = ['mp3', 'm4a', 'opus', 'ogg', 'webm', 'wav']

function audioExtOrder(ext: string): number {
  const idx = AUDIO_EXT_ORDER.indexOf(ext.toLowerCase())
  return idx === -1 ? AUDIO_EXT_ORDER.length : idx
}

const AUDIO_DESCRIPTIONS: Record<string, string> = {
  mp3: 'Universal compatibility',
  m4a: 'High quality, Apple devices',
  opus: 'High efficiency',
  ogg: 'Open format',
  wav: 'Uncompressed audio',
  webm: 'Web audio',
}

/**
 * Returns a sorted, deduplicated list of AudioOptions.
 *
 * The "original" audio track is always listed.  If MP3 conversion is
 * available (audioFormat = "mp3" is accepted by the backend for any audio
 * format), we synthesise an MP3 entry so the user can explicitly choose it.
 *
 * Deduplication key: extension.
 */
export function groupAudioFormats(
  formats: MediaFormat[],
  supportsMP3Conversion: boolean,
): AudioOption[] {
  const audioFormats = formats.filter((f) => f.type === 'audio')

  const sorted = [...audioFormats].sort(
    (a, b) => audioExtOrder(a.extension) - audioExtOrder(b.extension),
  )

  const seen = new Set<string>()
  const unique = sorted.filter((f) => {
    const key = f.extension.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const options: AudioOption[] = unique.map((format, index) => ({
    format,
    label: format.extension.toUpperCase(),
    description: AUDIO_DESCRIPTIONS[format.extension.toLowerCase()] ?? 'Audio track',
    isDefault: index === 0 && !supportsMP3Conversion,
  }))

  // Prepend a synthetic MP3 entry when the backend supports conversion.
  // We use the first available audio format as the underlying format_id;
  // the actual conversion is handled server-side via the audioFormat field.
  if (supportsMP3Conversion && unique.length > 0) {
    const mp3Option: AudioOption = {
      format: { ...unique[0], extension: 'mp3' },
      label: 'MP3',
      description: 'Universal compatibility',
      isDefault: true,
    }
    // Only prepend if MP3 isn't already present as a native format
    if (!seen.has('mp3')) {
      options.unshift(mp3Option)
    } else {
      // Mark the existing MP3 as default
      const existing = options.find((o) => o.format.extension.toLowerCase() === 'mp3')
      if (existing) existing.isDefault = true
    }
  }

  return options
}

// ---------------------------------------------------------------------------
// Download button label
// ---------------------------------------------------------------------------

/**
 * Generates the primary download button label that reflects the user's
 * exact selection, e.g. "Download MP4 · 1080p" or "Download MP3".
 */
export function downloadButtonLabel(
  mediaType: 'video' | 'audio',
  format: MediaFormat | null,
  audioFormat: 'original' | 'mp3',
): string {
  if (!format) return 'Download'

  if (mediaType === 'audio') {
    const ext = audioFormat === 'mp3' ? 'MP3' : format.extension.toUpperCase()
    return `Download ${ext}`
  }

  const ext = format.extension.toUpperCase()
  const quality = format.resolution ? ` · ${qualityLabel(format.resolution)}` : ''
  return `Download ${ext}${quality}`
}
