from urllib.parse import urlparse
from yt_dlp import YoutubeDL





YOUTUBE_DOMAINS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be"
}

REDNOTE_DOMAINS = {
    "rednote.com",
    "www.rednote.com",
    "xiaohongshu.com",
    "www.xiaohongshu.com",    
}

PROTECTED_DOMAINS = {
    "disneyplus.com",
    "www.disneyplus.com",
    "hulu.com",
    "www.hulu.com",
}


def detect_provider(url: str)-> str:
    pased_url = urlparse(url)
    hostname = pased_url.hostname
    
    if hostname in YOUTUBE_DOMAINS:
        return "youtube"
    if hostname in REDNOTE_DOMAINS:
        return "rednote"
    if hostname in PROTECTED_DOMAINS:
        return "protected"
    
    return "generic"



def analyze_media(url: str)-> dict:
    options = {
        "quiet": True,
        "no_warnings": True
    }
    with YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)
        
    return {
        "id": info.get("id"),
        "title": info.get("title"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "uploader": info.get("uploader"),
        "formats": normalize_formats(info.get("formats", []))
    }
    
    
    

def normalize_formats(formats: list[dict])->list[dict]:
    normalized = []
    for media_format in formats:
        vcodec = media_format.get("vcodec")
        acodec = media_format.get("acodec")
        height = media_format.get("height")
        
        if vcodec != "none":
            media_type = "video"
            resolution = f"{height}p" if height else None
        elif acodec != "none":
            media_type = "audio"
            resolution = None
        else:
            continue
        
        normalized.append({
            "format_id": media_format.get("format_id"),
            "type": media_type,
            "resolution": resolution,
            "extension": media_format.get("ext")
        })
    
    return normalized