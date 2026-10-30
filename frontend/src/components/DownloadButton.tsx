import { ArrowDownToLine, Loader2 } from 'lucide-react'
import type { FormatSelection } from './FormatSelector'
import { downloadButtonLabel } from '../lib/formatUtils'

interface DownloadButtonProps {
  selection: FormatSelection
  loading: boolean
  onClick: () => void
}

export function DownloadButton({ selection, loading, onClick }: DownloadButtonProps) {
  const label = downloadButtonLabel(
    selection.format.type,
    selection.format,
    selection.audioFormat,
  )

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="btn-primary focus-ring w-full py-3.5 text-base"
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          Starting download…
        </>
      ) : (
        <>
          <ArrowDownToLine size={17} aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  )
}
