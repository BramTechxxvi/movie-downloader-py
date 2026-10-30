import { Download } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-surface-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* Wordmark */}
        <a
          href="/"
          className="focus-ring inline-flex items-center gap-2.5 rounded-lg py-1"
          aria-label="Fetchr — home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <Download size={14} className="text-white" aria-hidden="true" />
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-tight text-slate-100">
            Fetchr
          </span>
        </a>

        {/* Nav hint */}
        <nav aria-label="Main navigation">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
            Free &amp; open source
          </span>
        </nav>
      </div>
    </header>
  )
}
