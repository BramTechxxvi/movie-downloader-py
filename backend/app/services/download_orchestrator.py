from app.services.download_service import download_media
from app.services.download_progress import create_progress_hook
from app.services.download_job_manager import download_job_manager
import logging




logger = logging.getLogger(__name__)



class DownloadOrchestrator:
    def __init__(self, job_manager):
        self.job_manager = job_manager
        
        
        
    
    def create_download(self)-> dict:
        job = self.job_manager.create_job()
        return {
            "download_id": job.download_id,
            "status": job.status
        }
        
        
    
    def execute_download(
        self, download_id: str, url: str, format_id: str,
        media_type: str, audio_format: str)-> None:
        
        progress_hook = create_progress_hook(
            manager=self.job_manager, download_id=download_id)
        
        try:
            result = download_media(
                url=url, format_id=format_id, media_type=media_type,
                audio_format=audio_format, progress_hook=progress_hook
            )
            self.job_manager.complete_job(
                download_id=download_id,
                filename=result["filename"],
                filepath=result["filepath"],
            )
        except ValueError as error:
            logger.warning("Download %s failed: %s", download_id, error)
            self.job_manager.fail_job(
                download_id, "Unable to download this media. "
                "Check the URL and selected format, then try again."
            )
        except Exception:
            logger.exception("UNexpected error while processing %s", download_id)
            self.job_manager.fail_job(
                download_id, 
                "Unexpected error occurred while downloading this media."
            )
            
            

download_orchestrator = DownloadOrchestrator(job_manager=download_job_manager)