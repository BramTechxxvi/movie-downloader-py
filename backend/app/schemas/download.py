from pydantic import BaseModel, HttpUrl


class DownloadMediaRequest(BaseModel):
    url: HttpUrl
    format_id: str
    
    
    
    
class DownloadMediaResponse(BaseModel):
    status: str