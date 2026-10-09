from yt_dlp import YoutubeDL




def download_media(url: str, format_id: str)->dict:
    options = { "format": format_id, "quiet": True }
    with YoutubeDL(options) as ydl:
        ydl.download([url])
    return { "status": "completed" }