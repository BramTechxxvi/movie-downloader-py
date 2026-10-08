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