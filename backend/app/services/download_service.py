from yt_dlp import YoutubeDL
from pathlib import Path
from yt_dlp.utils import DownloadError





DOWNLOAD_DIR = Path("downloads")





def download_media(url: str, format_id: str)->dict:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    options = {
        "format": f"{format_id}+bestaudio/best", 
        "quiet": True,
        "outtmpl": str(DOWNLOAD_DIR / "%(title)s.%(ext)s"),
        "merge_output_format": "mp4"
    }
    
    try:
        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url, download=True)
    except DownloadError as error:
        raise ValueError("Unable to download media", error)
    
    requested_downloads = info.get("requested_downloads", [])
    
    if requested_downloads:
        filepath = requested_downloads[0].get("filepath")
    else:
        filepath = ydl.prepare_filename(info)
        
    path = Path(filepath)
    return {
        "status": "completed",
        "filename": path.name,
        "filepath": str(path)
    }