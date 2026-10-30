import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormatSelector, type FormatSelection } from '../components/FormatSelector'
import type { MediaFormat } from '../types/media'

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

function mkVideo(id: string, resolution: string | null, ext: string): MediaFormat {
  return { format_id: id, type: 'video', resolution, extension: ext }
}
function mkAudio(id: string, ext: string): MediaFormat {
  return { format_id: id, type: 'audio', resolution: null, extension: ext }
}

const MIXED_FORMATS: MediaFormat[] = [
  mkVideo('v_1080_mp4', '1080p', 'mp4'),
  mkVideo('v_720_mp4',  '720p',  'mp4'),
  mkVideo('v_480_mp4',  '480p',  'mp4'),
  mkVideo('v_1080_webm','1080p', 'webm'),
  mkAudio('a_m4a',      'm4a'),
]

const VIDEO_ONLY: MediaFormat[] = [
  mkVideo('v_1080', '1080p', 'mp4'),
  mkVideo('v_720',  '720p',  'mp4'),
]

const AUDIO_ONLY: MediaFormat[] = [
  mkAudio('a_m4a',  'm4a'),
  mkAudio('a_opus', 'opus'),
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setup(formats: MediaFormat[] = MIXED_FORMATS, onSelect = vi.fn()) {
  const user = userEvent.setup()
  render(<FormatSelector formats={formats} onSelect={onSelect} />)
  return { user, onSelect }
}

function videoTab() { return screen.getByRole('radio', { name: /video/i }) }
function audioTab() { return screen.getByRole('radio', { name: /audio/i }) }

// ---------------------------------------------------------------------------
// Initial render
// ---------------------------------------------------------------------------

describe('FormatSelector — initial render', () => {
  it('renders with Video selected by default', () => {
    setup()
    expect(videoTab()).toHaveAttribute('aria-checked', 'true')
    expect(audioTab()).toHaveAttribute('aria-checked', 'false')
  })

  it('shows a Quality heading in video mode', () => {
    setup()
    expect(screen.getByText(/quality/i)).toBeInTheDocument()
  })

  it('renders video quality options', () => {
    setup(VIDEO_ONLY)
    expect(screen.getByRole('radio', { name: /1080p full hd/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /720p hd/i })).toBeInTheDocument()
  })

  it('marks the highest-quality option with a "Best" label', () => {
    setup(VIDEO_ONLY)
    // The Best badge is inside the button for the 1080p option
    const qualityGroup = screen.getByRole('radiogroup', { name: /video quality/i })
    expect(within(qualityGroup).getByText('Best')).toBeInTheDocument()
  })

  it('shows an empty state when there are no video formats', () => {
    setup(AUDIO_ONLY)
    expect(screen.getByText(/no video formats available/i)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Video/Audio toggle
// ---------------------------------------------------------------------------

describe('FormatSelector — type toggle', () => {
  it('switches to audio mode when the Audio tab is clicked', async () => {
    const { user } = setup()
    await user.click(audioTab())
    expect(audioTab()).toHaveAttribute('aria-checked', 'true')
    expect(videoTab()).toHaveAttribute('aria-checked', 'false')
  })

  it('shows a Format heading in audio mode', async () => {
    const { user } = setup()
    await user.click(audioTab())
    expect(screen.getByText(/format/i)).toBeInTheDocument()
  })

  it('calls onSelect(null) when switching type', async () => {
    const { user, onSelect } = setup()
    await user.click(audioTab())
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('shows audio format options after switching', async () => {
    const { user } = setup()
    await user.click(audioTab())
    // MP3 synthetic entry should be visible (backend supports conversion)
    expect(screen.getByRole('radio', { name: /mp3/i })).toBeInTheDocument()
  })

  it('switches back to video mode', async () => {
    const { user } = setup()
    await user.click(audioTab())
    await user.click(videoTab())
    expect(videoTab()).toHaveAttribute('aria-checked', 'true')
  })

  it('does nothing when clicking the already-active tab', async () => {
    const { user, onSelect } = setup()
    const callsBefore = onSelect.mock.calls.length
    await user.click(videoTab())
    expect(onSelect.mock.calls.length).toBe(callsBefore)
  })
})

// ---------------------------------------------------------------------------
// Video quality selection
// ---------------------------------------------------------------------------

describe('FormatSelector — video quality selection', () => {
  it('calls onSelect with the chosen format when a quality card is clicked', async () => {
    const { user, onSelect } = setup(VIDEO_ONLY)
    const btn720 = screen.getByRole('radio', { name: /720p hd/i })
    await user.click(btn720)
    const lastCall: FormatSelection = onSelect.mock.lastCall[0]
    expect(lastCall.format.resolution).toBe('720p')
    expect(lastCall.audioFormat).toBe('original')
  })

  it('marks the selected quality card as aria-checked', async () => {
    const { user } = setup(VIDEO_ONLY)
    const btn720 = screen.getByRole('radio', { name: /720p hd/i })
    await user.click(btn720)
    expect(btn720).toHaveAttribute('aria-checked', 'true')
  })

  it('deselects the previous quality card when a new one is picked', async () => {
    const { user } = setup(VIDEO_ONLY)
    const btn1080 = screen.getByRole('radio', { name: /1080p full hd/i })
    const btn720 = screen.getByRole('radio', { name: /720p hd/i })
    await user.click(btn720)
    expect(btn1080).toHaveAttribute('aria-checked', 'false')
  })
})

// ---------------------------------------------------------------------------
// Audio format selection
// ---------------------------------------------------------------------------

describe('FormatSelector — audio format selection', () => {
  beforeEach(async () => {
    // Switch to audio mode before each test in this block
  })

  it('shows a Recommended badge on the default audio option', async () => {
    const { user } = setup()
    await user.click(audioTab())
    const audioGroup = screen.getByRole('radiogroup', { name: /audio format/i })
    expect(within(audioGroup).getByText('Recommended')).toBeInTheDocument()
  })

  it('calls onSelect with mp3 audioFormat when MP3 is chosen', async () => {
    const { user, onSelect } = setup()
    await user.click(audioTab())
    const mp3Btn = screen.getByRole('radio', { name: /mp3/i })
    await user.click(mp3Btn)
    const lastCall: FormatSelection = onSelect.mock.lastCall[0]
    expect(lastCall.audioFormat).toBe('mp3')
  })

  it('calls onSelect with original audioFormat when a native format is chosen', async () => {
    const { user, onSelect } = setup()
    await user.click(audioTab())
    // M4A is a native format — not the synthetic MP3
    const m4aBtn = screen.getByRole('radio', { name: /m4a/i })
    await user.click(m4aBtn)
    const lastCall: FormatSelection = onSelect.mock.lastCall[0]
    expect(lastCall.audioFormat).toBe('original')
  })

  it('marks the clicked audio option as aria-checked', async () => {
    const { user } = setup()
    await user.click(audioTab())
    const mp3Btn = screen.getByRole('radio', { name: /mp3/i })
    await user.click(mp3Btn)
    expect(mp3Btn).toHaveAttribute('aria-checked', 'true')
  })

  it('shows an empty state when there are no audio formats', async () => {
    const { user } = setup(VIDEO_ONLY)
    await user.click(audioTab())
    expect(screen.getByText(/no audio formats available/i)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Advanced toggle
// ---------------------------------------------------------------------------

describe('FormatSelector — advanced toggle', () => {
  it('hides the advanced toggle when all formats fit within the cap', () => {
    setup(VIDEO_ONLY) // 2 formats < cap of 4
    expect(screen.queryByRole('button', { name: /more format/i })).not.toBeInTheDocument()
  })

  it('shows the advanced toggle when there are more than 4 video formats', () => {
    const manyFormats: MediaFormat[] = [
      mkVideo('v1', '1080p', 'mp4'),
      mkVideo('v2', '720p',  'mp4'),
      mkVideo('v3', '480p',  'mp4'),
      mkVideo('v4', '360p',  'mp4'),
      mkVideo('v5', '240p',  'mp4'), // 5th — triggers toggle
    ]
    setup(manyFormats)
    expect(screen.getByRole('button', { name: /more format/i })).toBeInTheDocument()
  })

  it('expands to show all formats when the toggle is clicked', async () => {
    const manyFormats: MediaFormat[] = [
      mkVideo('v1', '1080p', 'mp4'),
      mkVideo('v2', '720p',  'mp4'),
      mkVideo('v3', '480p',  'mp4'),
      mkVideo('v4', '360p',  'mp4'),
      mkVideo('v5', '240p',  'mp4'),
    ]
    const { user } = setup(manyFormats)
    await user.click(screen.getByRole('button', { name: /more format/i }))
    expect(screen.getByRole('radio', { name: /240p/i })).toBeInTheDocument()
  })

  it('collapses back when the toggle is clicked a second time', async () => {
    const manyFormats: MediaFormat[] = [
      mkVideo('v1', '1080p', 'mp4'),
      mkVideo('v2', '720p',  'mp4'),
      mkVideo('v3', '480p',  'mp4'),
      mkVideo('v4', '360p',  'mp4'),
      mkVideo('v5', '240p',  'mp4'),
    ]
    const { user } = setup(manyFormats)
    const toggle = screen.getByRole('button', { name: /more format/i })
    await user.click(toggle)
    await user.click(screen.getByRole('button', { name: /fewer formats/i }))
    expect(screen.queryByRole('radio', { name: /240p/i })).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Format deduplication (integration with formatUtils)
// ---------------------------------------------------------------------------

describe('FormatSelector — format deduplication', () => {
  it('does not show duplicate quality cards for the same resolution+extension', () => {
    const dupes: MediaFormat[] = [
      mkVideo('v1a', '1080p', 'mp4'),
      mkVideo('v1b', '1080p', 'mp4'), // duplicate
      mkVideo('v2',  '720p',  'mp4'),
    ]
    setup(dupes)
    // Should only show one 1080p mp4 card
    const cards = screen.getAllByRole('radio', { name: /1080p full hd/i })
    expect(cards).toHaveLength(1)
  })
})
