from fastapi import APIRouter, HTTPException
from app.schemas.media import AnalyzeMediaRequest, AnalyzeMediaResponse
from app.services.media_service import analyze_media




router = APIRouter(
    prefix= "/api/v1/media",
    tags=["Media"]
)


@router.post("/analyze", response_model=AnalyzeMediaResponse)
def analyze_media_route(request: AnalyzeMediaRequest,)-> AnalyzeMediaResponse:
    try:
        metadata = analyze_media(str(request.url))
        return AnalyzeMediaResponse(**metadata)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))