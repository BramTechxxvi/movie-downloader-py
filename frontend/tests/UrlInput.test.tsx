import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UrlInput } from '../src/components/UrlInput'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setup(onAnalyze = vi.fn(), loading = false) {
  const user = userEvent.setup()
  render(<UrlInput onAnalyze={onAnalyze} loading={loading} />)
  return {
    user,
    onAnalyze,
    input: () => screen.getByRole('textbox', { name: /media url/i }),
    analyzeBtn: () => screen.getByRole('button', { name: /analyze/i }),
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('UrlInput — rendering', () => {
  it('renders the URL input', () => {
    const { input } = setup()
    expect(input()).toBeInTheDocument()
  })

  it('renders the Analyze button', () => {
    const { analyzeBtn } = setup()
    expect(analyzeBtn()).toBeInTheDocument()
  })

  it('shows "Analyzing…" text and disables the button while loading', () => {
    render(<UrlInput onAnalyze={vi.fn()} loading={true} />)
    expect(screen.getByRole('button', { name: /analyzing/i })).toBeDisabled()
  })

  it('shows the Paste button when the input is empty', () => {
    setup()
    expect(screen.getByRole('button', { name: /paste from clipboard/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Validation — empty / blank
// ---------------------------------------------------------------------------

describe('UrlInput — empty submission', () => {
  it('shows a validation error when submitted empty', async () => {
    const { user, analyzeBtn, onAnalyze } = setup()
    await user.click(analyzeBtn())
    expect(await screen.findByRole('alert')).toHaveTextContent(/paste a url/i)
    expect(onAnalyze).not.toHaveBeenCalled()
  })

  it('shows a validation error when submitted with only whitespace', async () => {
    const { user, input, analyzeBtn, onAnalyze } = setup()
    await user.type(input(), '   ')
    await user.click(analyzeBtn())
    expect(await screen.findByRole('alert')).toHaveTextContent(/paste a url/i)
    expect(onAnalyze).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Validation — invalid URL
// ---------------------------------------------------------------------------

describe('UrlInput — invalid URL', () => {
  it('shows a validation error for a non-URL string', async () => {
    const { user, input, analyzeBtn, onAnalyze } = setup()
    await user.type(input(), 'not-a-url')
    await user.click(analyzeBtn())
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid url/i)
    expect(onAnalyze).not.toHaveBeenCalled()
  })

  it('shows a validation error for a non-http/https protocol', async () => {
    const { user, input, analyzeBtn, onAnalyze } = setup()
    await user.type(input(), 'ftp://example.com/file.mp4')
    await user.click(analyzeBtn())
    expect(await screen.findByRole('alert')).toHaveTextContent(/http/i)
    expect(onAnalyze).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Successful submission
// ---------------------------------------------------------------------------

describe('UrlInput — valid submission', () => {
  it('calls onAnalyze with the trimmed URL', async () => {
    const onAnalyze = vi.fn().mockResolvedValue(undefined)
    const { user, input, analyzeBtn } = setup(onAnalyze)
    await user.type(input(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await user.click(analyzeBtn())
    await waitFor(() =>
      expect(onAnalyze).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ),
    )
  })

  it('calls onAnalyze when the form is submitted via Enter key', async () => {
    const onAnalyze = vi.fn().mockResolvedValue(undefined)
    const { user, input } = setup(onAnalyze)
    await user.type(input(), 'https://example.com/video.mp4{Enter}')
    await waitFor(() =>
      expect(onAnalyze).toHaveBeenCalledWith('https://example.com/video.mp4'),
    )
  })

  it('clears the validation error when the user starts typing', async () => {
    const { user, input, analyzeBtn } = setup()
    // Trigger an error first
    await user.click(analyzeBtn())
    expect(await screen.findByRole('alert')).toHaveTextContent(/paste a url/i)
    // Start typing — error should clear
    await user.type(input(), 'h')
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(''),
    )
  })
})

// ---------------------------------------------------------------------------
// Clear button
// ---------------------------------------------------------------------------

describe('UrlInput — clear button', () => {
  it('shows the clear button when the input has text', async () => {
    const { user, input } = setup()
    await user.type(input(), 'https://example.com')
    expect(screen.getByRole('button', { name: /clear url/i })).toBeInTheDocument()
  })

  it('clears the input when the clear button is clicked', async () => {
    const { user, input } = setup()
    await user.type(input(), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /clear url/i }))
    expect(input()).toHaveValue('')
  })

  it('hides the clear button after clearing', async () => {
    const { user, input } = setup()
    await user.type(input(), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /clear url/i }))
    expect(screen.queryByRole('button', { name: /clear url/i })).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Duplicate submission prevention
// ---------------------------------------------------------------------------

describe('UrlInput — duplicate submission prevention', () => {
  it('disables the submit button while loading', () => {
    render(<UrlInput onAnalyze={vi.fn()} loading={true} />)
    const btn = screen.getByRole('button', { name: /analyzing/i })
    expect(btn).toBeDisabled()
  })

  it('disables the input while loading', () => {
    render(<UrlInput onAnalyze={vi.fn()} loading={true} />)
    expect(screen.getByRole('textbox', { name: /media url/i })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('UrlInput — accessibility', () => {
  beforeEach(() => {
    // Suppress the aria-invalid warning from jsdom for cleaner test output
  })

  it('marks the input as aria-invalid when there is an error', async () => {
    const { user, analyzeBtn, input } = setup()
    await user.click(analyzeBtn())
    await screen.findByRole('alert')
    expect(input()).toHaveAttribute('aria-invalid', 'true')
  })

  it('associates the input with the error message via aria-describedby', async () => {
    const { user, analyzeBtn, input } = setup()
    await user.click(analyzeBtn())
    await screen.findByRole('alert')
    const describedById = input().getAttribute('aria-describedby')
    expect(describedById).toBeTruthy()
    const errorEl = document.getElementById(describedById!)
    expect(errorEl).toBeInTheDocument()
  })

  it('removes aria-invalid once the error is cleared', async () => {
    const { user, input, analyzeBtn } = setup()
    await user.click(analyzeBtn())
    await screen.findByRole('alert')
    await user.type(input(), 'h')
    await waitFor(() =>
      expect(input()).not.toHaveAttribute('aria-invalid', 'true'),
    )
  })
})
