from fastapi import APIRouter
from app.schemas.download import DownloadMediaRequest, DownloadMediaResponse
from app.services.download_service import download_media




router = APIRouter(
    prefix="/api/v1/downloads",
    tags=["Downloads"]
)