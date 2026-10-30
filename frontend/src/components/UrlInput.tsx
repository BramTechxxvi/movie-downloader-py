import { useState, useRef, type FormEvent } from 'react'
import { Clipboard, Search, X, Loader2 } from 'lucide-react'

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>
  loading: boolean
}

export function UrlInput({ onAnalyze, loading }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validate(value: string): string | null {
    if (!value.trim()) return 'Please paste a URL first.'
    try {
      const parsed = new URL(value.trim())
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'Only http and https URLs are supported.'
      }
    } catch {
      return 'That doesn\'t look like a valid URL.'
    }
    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const err = validate(url)
    if (err) {
      setValidationError(err)
      inputRef.current?.focus()
      return
    }
    setValidationError(null)
    await onAnalyze(url.trim())
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setUrl(text.trim())
        setValidationError(null)
        inputRef.current?.focus()
      }
    } catch {
      // Clipboard API unavailable — silently ignore, user can paste manually
    }
  }

  function handleChange(value: string) {
    setUrl(value)
    if (validationError) setValidationError(null)
  }

  function handleClear() {
    setUrl('')
    setValidationError(null)
    inputRef.current?.focus()
  }

  const hasError = Boolean(validationError)
  const errorId = 'url-error'

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`input-surface flex items-center gap-2 px-3 py-2.5 ${
            hasError ? 'border-red-500! shadow-[0_0_0_3px_rgba(239,68,68,0.18)]!' : ''
          }`}
        >
          {/* Search icon */}
          <Search
            size={16}
            className="shrink-0 text-slate-500"
            aria-hidden="true"
          />

          {/* URL input */}
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Paste a media link here…"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            aria-label="Media URL"
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={loading}
          />

          {/* Clear button — only when there is text */}
          {url && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="focus-ring shrink-0 rounded p-0.5 text-slate-500 hover:text-slate-300"
              aria-label="Clear URL"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}

          {/* Paste from clipboard */}
          {!url && !loading && (
            <button
              type="button"
              onClick={handlePaste}
              className="btn-ghost shrink-0 px-2.5 py-1.5 text-xs"
              aria-label="Paste from clipboard"
            >
              <Clipboard size={13} aria-hidden="true" />
              Paste
            </button>
          )}

          {/* Analyze submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary shrink-0 px-4 py-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <Search size={14} aria-hidden="true" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Validation error — aria-live so screen readers announce it */}
      <div
        id={errorId}
        role="alert"
        aria-live="polite"
        className={`text-sm text-red-400 transition-all duration-200 ${
          hasError ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {validationError ?? ''}
      </div>
    </div>
  )
}
