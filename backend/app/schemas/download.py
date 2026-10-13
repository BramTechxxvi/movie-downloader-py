from pydantic import BaseModel, HttpUrl
from typing import Literal




class DownloadMediaRequest(BaseModel):
    url: HttpUrl
    format_id: str
    media_type: Literal["video", "audio"]
    
    
    
    
class DownloadMediaResponse(BaseModel):
    status: str
    filename: str
    filepath: str