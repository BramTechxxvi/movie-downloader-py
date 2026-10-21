import { useState, type FormEvent} from "react";




interface UrlInputProps{
    onAnalyze:(url: string) =>Promise<void>;
    loading: boolean
}



export function UrlInput({onAnalyze, loading}: UrlInputProps) {
    const [url, setUrl] = useState("");

    async function handleSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(!url.trim()) {
            return;
        }
        await onAnalyze(url.trim())
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="flex w-flex flex-col gap-3 sm:flex-row"
        >
            <input 
            type="url"
            value={url}
            onChange={(event)=> setUrl(event.target.value)}
            placeholder="Paste a video or media URL"
            className="flex-1 rounded-xl border border-gray-30 px-4py-3 outline-none"
            required
            />

            <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white 
            disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Analyzing...." : "Analyze"}
            </button>
        </form>
    )

}