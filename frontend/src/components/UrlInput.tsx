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
            type="" 
            />

        </form>
    )

}