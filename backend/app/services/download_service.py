from yt_dlp import YoutubeDL
from pathlib import Path
from yt_dlp.utils import DownloadError





DOWNLOAD_DIR = Path("downloads")





def download_media(
    url: str, format_id: str, media_type: str, 
    audio_format: str = "original", progress_hook=None)-> dict:
    
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    if media_type == "video":
        selected_format = f"{format_id}+bestaudio/best"
    else:
        selected_format = format_id
        
    options = {
        "format": selected_format,
        "quiet": True,
        "outtmpl": str(DOWNLOAD_DIR / "%(title)s.%(ext)s")
    }
    
    if progress_hook is not None:
        options["progress_hooks"] = [progress_hook]
    
    if media_type =="video":
        options["merge_output_format"] = "mp4"
    
    if media_type == "audio" and audio_format == "mp3":
        options["postprocessors"] = [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192"
            }
        ]
    
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