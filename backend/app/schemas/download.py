from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import Literal




class DownloadMediaRequest(BaseModel):
    url: HttpUrl
    format_id: str = Field(min_length=1, max_length=100)
    media_type: Literal["video", "audio"]
    audio_format: Literal["original", "mp3"] = "original"
    
    
    @field_validator("format_id")
    @classmethod
    def validate_format_id(cls, value:str)-> str:
        id = value.strip()
        if not id:
            raise ValueError("Format ID canot be empty")
        return id
    
    

    
class DownloadStatusResponse(BaseModel):
    download_id: str
    status: str
    progress: float
    filename: str|None = None
    error: str |None=None
    
    
    
    
    
class StartDownloadResponse(BaseModel):
    download_id: str
    status: str