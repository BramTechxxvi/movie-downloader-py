from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from app.schemas.download import ( DownloadMediaRequest, DownloadStatusResponse, StartDownloadResponse)
from app.services.download_orchestrator import download_orchestrator
from app.services.download_job_manager import download_job_manager
from pathlib import Path
from fastapi.responses import FileResponse




router = APIRouter(
    prefix="/api/v1/downloads",
    tags=["Downloads"]
)




@router.post("", response_model=StartDownloadResponse, 
            status_code=status.HTTP_202_ACCEPTED)
def download_route(request: DownloadMediaRequest,
    background_tasks: BackgroundTasks)-> StartDownloadResponse:
    
    job = download_orchestrator.create_download()
    background_tasks.add_task(
        download_orchestrator.execute_download,
        download_id=job["download_id"],
        url=str(request.url),
        format_id=request.format_id,
        media_type=request.media_type,
        audio_format=request.audio_format,
    )
    return StartDownloadResponse(**job)
    
    
    
    

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