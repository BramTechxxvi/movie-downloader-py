from pydantic import BaseModel, HttpUrl





class AnalyzeMediaRequest(BaseModel):
    url: HttpUrl
    
    
    
class MediaFormat(BaseModel):
    format_id: str
    type: str
    resolution: str |None=None
    extension: str |None=None
    
    
    
class AnalyzeMediaResponse(BaseModel):
    provider: str
    id: str |None=None
    title: str |None=None
    thumbnail: str |None=None
    duration: int | float |None=None
    uploader: str |None=None
    formats: list[MediaFormat]
    