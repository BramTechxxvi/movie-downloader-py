from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from app.schemas.download import (
    DownloadMediaRequest, DownloadMediaResponse, 
    DownloadStatusResponse, StartDownloadResponse
    )
from app.services.download_orchestrator import download_orchestrator
# from app.services.download_job_manager import download_job_manager




router = APIRouter(
    prefix="/api/v1/downloads",
    tags=["Downloads"]
)




@router.post("", response_model=DownloadMediaResponse)
def download_route(request: DownloadMediaRequest)-> DownloadMediaResponse:
    try:
        result = download_media(
            url=str(request.url), 
            format_id=request.format_id,
            media_type=request.media_type,
            audio_format=request.audio_format
        )
        return DownloadMediaResponse(**result)
    except  ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    
    
    
    

@router.get("/{download_id}", response_model=DownloadStatusResponse)
def get_download_status(download_id: str) -> DownloadStatusResponse:
    job = download_job_manager.get_job(download_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Download not found")
    
    return DownloadStatusResponse(
        download_id=job.download_id,
        status=job.status,
        progress=job.progress,
        filename=job.filename,
        error= job.error
    )