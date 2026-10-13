from fastapi import APIRouter, HTTPException
from app.schemas.download import DownloadMediaRequest, DownloadMediaResponse
from app.services.download_service import download_media




router = APIRouter(
    prefix="/api/v1/downloads",
    tags=["Downloads"]
)




@router.post("", response_model=DownloadMediaResponse)
def download_route(request: DownloadMediaRequest)-> DownloadMediaResponse:
    try:
        result = download_media(
            url=str(request.url), 
            format_id=request.format_id
        )
        return DownloadMediaResponse(**result)
    except  ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))