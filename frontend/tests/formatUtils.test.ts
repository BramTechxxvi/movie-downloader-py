import { describe, it, expect } from 'vitest'
import {
  resolutionHeight,
  qualityLabel,
  groupVideoFormats,
  groupAudioFormats,
  downloadButtonLabel,
} from '../src/lib/formatUtils'
import type { MediaFormat } from '../src/types/media'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVideo(
  format_id: string,
  resolution: string | null,
  extension: string,
): MediaFormat {
  return { format_id, type: 'video', resolution, extension }
}

function makeAudio(format_id: string, extension: string): MediaFormat {
  return { format_id, type: 'audio', resolution: null, extension }
}

// ---------------------------------------------------------------------------
// resolutionHeight
// ---------------------------------------------------------------------------

describe('resolutionHeight', () => {
  it('extracts numeric height from a resolution string', () => {
    expect(resolutionHeight('1080p')).toBe(1080)
    expect(resolutionHeight('720p')).toBe(720)
    expect(resolutionHeight('480p')).toBe(480)
    expect(resolutionHeight('2160p')).toBe(2160)
  })

  it('returns 0 for null resolution', () => {
    expect(resolutionHeight(null)).toBe(0)
  })

  it('returns 0 for strings that contain no leading digits', () => {
    expect(resolutionHeight('HD')).toBe(0)
  })

  it('handles resolution strings with extra content after the number', () => {
    expect(resolutionHeight('1080p60')).toBe(1080)
  })
})

// ---------------------------------------------------------------------------
// qualityLabel
// ---------------------------------------------------------------------------

describe('qualityLabel', () => {
  it('maps known heights to friendly labels', () => {
    expect(qualityLabel('1080p')).toBe('1080p Full HD')
    expect(qualityLabel('720p')).toBe('720p HD')
    expect(qualityLabel('2160p')).toBe('4K Ultra HD')
    expect(qualityLabel('480p')).toBe('480p')
    expect(qualityLabel('360p')).toBe('360p')
    expect(qualityLabel('1440p')).toBe('1440p QHD')
  })

  it('falls back to the raw resolution string for unknown heights', () => {
    expect(qualityLabel('540p')).toBe('540p')
    expect(qualityLabel('1920x1080')).toBe('1920x1080')
  })

  it('returns a fallback string for null resolution', () => {
    expect(qualityLabel(null)).toBe('Unknown quality')
  })
})

// ---------------------------------------------------------------------------
// groupVideoFormats
// ---------------------------------------------------------------------------

describe('groupVideoFormats', () => {
  it('returns an empty array when there are no video formats', () => {
    const formats: MediaFormat[] = [makeAudio('a1', 'm4a')]
    expect(groupVideoFormats(formats)).toHaveLength(0)
  })

  it('sorts by resolution descending', () => {
    const formats = [
      makeVideo('v360', '360p', 'mp4'),
      makeVideo('v1080', '1080p', 'mp4'),
      makeVideo('v720', '720p', 'mp4'),
    ]
    const result = groupVideoFormats(formats)
    expect(result.map((o) => o.format.format_id)).toEqual(['v1080', 'v720', 'v360'])
  })

  it('prefers MP4 over WebM at the same resolution', () => {
    const formats = [
      makeVideo('v_webm', '1080p', 'webm'),
      makeVideo('v_mp4', '1080p', 'mp4'),
    ]
    const result = groupVideoFormats(formats)
    expect(result[0].format.extension).toBe('mp4')
    expect(result[1].format.extension).toBe('webm')
  })

  it('deduplicates formats with identical resolution and extension', () => {
    const formats = [
      makeVideo('v1', '1080p', 'mp4'),
      makeVideo('v2', '1080p', 'mp4'), // duplicate key
      makeVideo('v3', '720p', 'mp4'),
    ]
    const result = groupVideoFormats(formats)
    // Only one 1080p mp4 and one 720p mp4 should remain
    expect(result).toHaveLength(2)
    expect(result[0].format.resolution).toBe('1080p')
    expect(result[1].format.resolution).toBe('720p')
  })

  it('keeps both MP4 and WebM at the same resolution after deduplication', () => {
    const formats = [
      makeVideo('v_mp4', '1080p', 'mp4'),
      makeVideo('v_webm', '1080p', 'webm'),
    ]
    const result = groupVideoFormats(formats)
    expect(result).toHaveLength(2)
  })

  it('marks only the first entry as isBest', () => {
    const formats = [
      makeVideo('v360', '360p', 'mp4'),
      makeVideo('v1080', '1080p', 'mp4'),
      makeVideo('v720', '720p', 'mp4'),
    ]
    const result = groupVideoFormats(formats)
    expect(result[0].isBest).toBe(true)
    expect(result[1].isBest).toBe(false)
    expect(result[2].isBest).toBe(false)
  })

  it('marks a single format as both first and isBest', () => {
    const formats = [makeVideo('v1', '720p', 'mp4')]
    const result = groupVideoFormats(formats)
    expect(result).toHaveLength(1)
    expect(result[0].isBest).toBe(true)
  })

  it('attaches the correct qualityLabel', () => {
    const formats = [makeVideo('v1', '1080p', 'mp4')]
    const result = groupVideoFormats(formats)
    expect(result[0].qualityLabel).toBe('1080p Full HD')
  })

  it('ignores audio-type formats', () => {
    const formats = [makeAudio('a1', 'm4a'), makeVideo('v1', '720p', 'mp4')]
    const result = groupVideoFormats(formats)
    expect(result).toHaveLength(1)
    expect(result[0].format.format_id).toBe('v1')
  })
})

// ---------------------------------------------------------------------------
// groupAudioFormats
// ---------------------------------------------------------------------------

describe('groupAudioFormats', () => {
  it('returns an empty array when there are no audio formats', () => {
    const formats: MediaFormat[] = [makeVideo('v1', '720p', 'mp4')]
    expect(groupAudioFormats(formats, false)).toHaveLength(0)
  })

  it('sorts audio formats by preferred extension order', () => {
    const formats = [
      makeAudio('a_ogg', 'ogg'),
      makeAudio('a_m4a', 'm4a'),
    ]
    const result = groupAudioFormats(formats, false)
    expect(result[0].format.extension).toBe('m4a')
    expect(result[1].format.extension).toBe('ogg')
  })

  it('deduplicates audio formats with the same extension', () => {
    const formats = [makeAudio('a1', 'm4a'), makeAudio('a2', 'm4a')]
    const result = groupAudioFormats(formats, false)
    expect(result).toHaveLength(1)
  })

  it('marks the first entry as isDefault when MP3 conversion is not supported', () => {
    const formats = [makeAudio('a1', 'm4a'), makeAudio('a2', 'ogg')]
    const result = groupAudioFormats(formats, false)
    expect(result[0].isDefault).toBe(true)
    expect(result[1].isDefault).toBe(false)
  })

  it('prepends a synthetic MP3 entry when supportsMP3Conversion is true', () => {
    const formats = [makeAudio('a1', 'm4a')]
    const result = groupAudioFormats(formats, true)
    expect(result[0].label).toBe('MP3')
    expect(result[0].isDefault).toBe(true)
  })

  it('does not duplicate MP3 when it already exists as a native format', () => {
    const formats = [makeAudio('a_mp3', 'mp3'), makeAudio('a_m4a', 'm4a')]
    const result = groupAudioFormats(formats, true)
    const mp3Entries = result.filter((o) => o.label === 'MP3')
    expect(mp3Entries).toHaveLength(1)
  })

  it('marks native MP3 as default when it exists and conversion is enabled', () => {
    const formats = [makeAudio('a_mp3', 'mp3'), makeAudio('a_m4a', 'm4a')]
    const result = groupAudioFormats(formats, true)
    const mp3 = result.find((o) => o.format.extension.toLowerCase() === 'mp3')
    expect(mp3?.isDefault).toBe(true)
  })

  it('ignores video-type formats', () => {
    const formats = [makeVideo('v1', '720p', 'mp4'), makeAudio('a1', 'm4a')]
    const result = groupAudioFormats(formats, false)
    expect(result).toHaveLength(1)
    expect(result[0].format.format_id).toBe('a1')
  })

  it('assigns a description string to every audio option', () => {
    const formats = [makeAudio('a1', 'm4a'), makeAudio('a2', 'opus')]
    const result = groupAudioFormats(formats, false)
    result.forEach((o) => {
      expect(typeof o.description).toBe('string')
      expect(o.description.length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// downloadButtonLabel
// ---------------------------------------------------------------------------

describe('downloadButtonLabel', () => {
  it('returns "Download" when format is null', () => {
    expect(downloadButtonLabel('video', null, 'original')).toBe('Download')
    expect(downloadButtonLabel('audio', null, 'mp3')).toBe('Download')
  })

  it('includes the extension and quality label for video', () => {
    const format = makeVideo('v1', '1080p', 'mp4')
    expect(downloadButtonLabel('video', format, 'original')).toBe(
      'Download MP4 · 1080p Full HD',
    )
  })

  it('omits quality for video formats with no resolution', () => {
    const format = makeVideo('v1', null, 'mp4')
    expect(downloadButtonLabel('video', format, 'original')).toBe('Download MP4')
  })

  it('uses the audioFormat override for audio type', () => {
    const format = makeAudio('a1', 'm4a')
    expect(downloadButtonLabel('audio', format, 'mp3')).toBe('Download MP3')
  })

  it('uses the native extension for audio when audioFormat is "original"', () => {
    const format = makeAudio('a1', 'm4a')
    expect(downloadButtonLabel('audio', format, 'original')).toBe('Download M4A')
  })

  it('uppercases the extension', () => {
    const format = makeVideo('v1', '720p', 'webm')
    expect(downloadButtonLabel('video', format, 'original')).toContain('WEBM')
  })
})
