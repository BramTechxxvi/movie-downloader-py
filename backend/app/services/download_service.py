from yt_dlp import YoutubeDL
from pathlib import Path
from yt_dlp.utils import DownloadError
from app.core.config import settings
from typing import Callable
from app.services.url_validation import validate_public_http_url




DOWNLOAD_DIR = settings.download_dir



class MediaDownloadError(Exception):
    """Raised when media cannot be downloaded successfully."""



def download_media(
    url: str, format_id: str, media_type: str, 
    audio_format: str = "original", progress_hook: Callable | None=None)-> dict:

    if not format_id or not format_id.strip():
        raise ValueError("A valid format ID is required.")
    
    if media_type not in {"video", "audio"}:
        raise ValueError("Unsupported media type.")

    if audio_format not in {"original", "mp3"}:
        raise ValueError("Unsupported audio format.")
    
    url = validate_public_http_url(url)
        
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    if media_type == "video":
        selected_format = f"{format_id}+bestaudio/best"
    else:
        selected_format = format_id
        
    options = {
        "format": selected_format,
        "quiet": True,
        "outtmpl": str(DOWNLOAD_DIR / "%(title)s.%(ext)s"),
        "js_runtimes":{"node": {}},
        "noplaylist": True
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
            info = ydl.extract_info(url, download=False)
            
            if not info or not isinstance(info, dict):
                raise MediaDownloadError("The provider returned invalid downoad information.")
            
            formats = info.get("formats") or []
            selected = next((item for item in formats if item.get("format_id") == format_id), None)
            if selected is None:
                raise ValueError("The selected format is not available for this media.")
            
            vcodec = selected.get("vcodec")
            acodec = selected.get("acodec")
            
            if media_type == "audio" and (
                vcodec not in (None, "none")
                or acodec in (None, "none")
            ):
                raise ValueError("THe selected format is not an audio-only format.")
            
            if media_type == "video":
                selected_format = (
                    format_id 
                    if acodec not in (None, "none")
                    else f"{format_id}+bestaudio"
                )
            else:
                selected_format = format_id
                
            ydl.params["format"] = selected_format 
            downloaded_info = ydl.process_ie_result(info, download=True)
            filepath = Path(ydl.prepare_filename(downloaded_info))
            
            if media_type == "audio" and audio_format == "mp3":
                filepath = filepath.with_suffix(".mp3")
            
            elif media_type == "video" and info.get("requested_formats"):
                filepath = filepath.with_suffix(".mp4")
                
    except DownloadError as error:
        raise MediaDownloadError(
            "Unable to download this media. It may be unavailable ",
            "or the selected format may not br supported."
        ) from error
        
    download_root = DOWNLOAD_DIR.resolve()
    filepath = filepath.resolve()
    
    try:
        filepath.relative_to(download_root)
    except ValueError as error:
        raise MediaDownloadError("The downloaded file is outside the permitted download directory.")from error
    
    if not filepath.is_file():
        raise MediaDownloadError("The download finished without producing the expected file.")
        
    return {
        "status": "completed",
        "filename": filepath.name,
        "filepath": str(filepath)
    }