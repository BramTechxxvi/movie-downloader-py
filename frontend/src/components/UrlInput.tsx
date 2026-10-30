import { useState, type FormEvent } from "react";
import { Link, Loader2 } from "lucide-react";

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  loading: boolean;
}

export function UrlInput({ onAnalyze, loading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    await onAnalyze(url.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`
          flex items-center gap-3 rounded-2xl glass-card px-4 py-3
          transition-all duration-200
          focus-within:border-brand-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]
        `}
      >
        {/* Icon */}
        <Link
          size={18}
          className="shrink-0 text-slate-500 transition-colors duration-200 group-focus-within:text-brand-400"
          aria-hidden="true"
        />

        {/* Input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a video or audio URL…"
          required
          className="
            min-w-0 flex-1 bg-transparent text-slate-100 placeholder-slate-500
            text-sm outline-none
          "
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="
            shrink-0 inline-flex items-center gap-2
            rounded-xl bg-brand-600 px-5 py-2.5
            text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-brand-500 active:scale-95
            disabled:cursor-not-allowed disabled:opacity-40
            focus-ring
          "
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
    </form>
  );
}
