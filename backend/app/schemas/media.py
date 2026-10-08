from pydantic import BaseModel, HttpUrl


class AnalyzeMediaRequest(BaseModel):
    url: HttpUrl
    
    
class AnalyzeMediaResponse(BaseModel):
    provider: str