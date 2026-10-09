from fastapi import APIRouter
from app.schemas.media import AnalyzeMediaRequest, AnalyzeMediaResponse
from app.services.media_service import detect_provider, analyze_media




router = APIRouter(
    prefix= "/api/v1/media",
    tags=["Media"]
)


@router.post("/analyze", response_model=AnalyzeMediaResponse)
def analyze_media(request: AnalyzeMediaRequest,)-> AnalyzeMediaResponse:
    metadata = analyze_media(str(request.url))
    return AnalyzeMediaResponse(**metadata)