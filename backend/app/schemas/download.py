from pydantic import BaseModel, HttpUrl
from typing import Literal




class DownloadMediaRequest(BaseModel):
    url: HttpUrl
    format_id: str
    media_type: Literal["video", "audio"]
    audio_format: Literal["original", "mp3"] = "original"
    
    
    
class DownloadMediaResponse(BaseModel):
    status: str
    filename: str
    filepath: str
    
    
    
    
class DownloadStatusResponse(BaseModel):
    download_id: str
    status: str
    progress: float
    filename: str|None = None
    error: str |None=None
    
    
    
    
    
class StartDownloadResponse(BaseModel):
    download_id: str
    status: str