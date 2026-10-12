from yt_dlp import YoutubeDL
from pathlib import Path





DOWNLOAD_DIR = Path("downloads")





def download_media(url: str, format_id: str)->dict:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    options = {
        "format": format_id, 
        "quiet": True,
        "outtmpl": str(DOWNLOAD_DIR / "%(title)s.%(ext)s")
    }
    
    with YoutubeDL(options) as ydl:
        info = ydl.exract(url, download=True)
    requested_downloads = info.get("requested_downloads", [])
    
    if requested_downloads:
        filepath = requested_downloads[0].get("filepath")
    else:
        filepath = ydl.prepare_filename(info)
        
    path = Path(filepath)
    return {
        "status": "completed",
        "filename": "",
        "filepath": str(path)
    }