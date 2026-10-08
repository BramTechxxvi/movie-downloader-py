from fastapi import APIRouter
from app.schemas.media import AnalyzeMediaRequest, AnalyzeMediaResponse
from app.services.media_service import detect_provider




router = APIRouter(
    prefix= "/api/v1/media",
    tags=["Media"]
)


@router.post("/analyze", response_model=AnalyzeMediaResponse)
def analyze_media(request: AnalyzeMediaRequest,)-> AnalyzeMediaResponse:
    provider = detect_provider(str(request.url))
    return AnalyzeMediaResponse(provider=provider)