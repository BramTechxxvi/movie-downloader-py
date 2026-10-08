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
        "formats": info.get("formats", [])
    }