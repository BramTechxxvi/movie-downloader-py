from uuid import uuid4
from app.models.download_job import DownloadJOb, DownloadStatus
from datetime import datetime, timezone



class DownloadJobManager:
    def __init__(self):
        self._jobs: dict[str, DownloadJOb] = {}
        
    
    _ALLOWED_TRANSITIONS = {
        DownloadStatus.PENDING: {
            DownloadStatus.DOWNLOADING, DownloadStatus.FAILED,
        },
        DownloadStatus.DOWNLOADING: {
            DownloadStatus.COMPLETED, DownloadStatus.FAILED,
        },
        DownloadStatus.COMPLETED: set(),
        DownloadStatus.FAILED: set()
    }
    
    
    
    def _transition_job(self, download_id: str, new_status: DownloadStatus):
        job = self.get_job(download_id)
        if job is None:
            return None
        
        allowed_statuses = self._ALLOWED_TRANSITIONS[job.status]
        if new_status not in allowed_statuses:
            raise ValueError(
                f"Invalid download state transition: "
                f"{job.status} -> {new_status}"
            )
        
        job.status = new_status
        return job
    
    
    
    
    def start_job(self, download_id: str):
        return self._transition_job(download_id, DownloadStatus.COMPLETED)   
    
    

    def create_job(self) -> DownloadJOb:
        download_id = str(uuid4())
        job = DownloadJOb(
            download_id=download_id,
            status= DownloadStatus.PENDING,
        )
        self._jobs[download_id] = job
        
        return job
    
    
    
    def get_job(self, download_id: str) -> DownloadJOb | None:
        return self._jobs.get(download_id)
    
    
    
    def update_progress(self, download_id: str, progress: float) -> DownloadJOb |None:
        job = self.get_job(download_id)
        if job is None:
            return None
        
        if job.status == DownloadStatus.PENDING:
            job=self.start_job(download_id)
            
        elif job.status != DownloadStatus.DOWNLOADING:
            raise ValueError(f"Cannot update progress for a job in state {job.status}")
        
        job.progress = max(0.0, min(progress, 100.0))
        return job
    
    
    
    
    def complete_job(
        self, download_id: str, 
        filename: str, filepath: str )-> DownloadJOb |None:
        
        job = self._transition_job(download_id, DownloadStatus.DOWNLOADING)
        if job is None:
            return None
        
        job.progress = 100.0
        job.filename = filename
        job.filepath = filepath
        job.error = None
        job.completed_at = datetime.now(timezone.utc)
        
        return job
    
    
    
        
        
    def fail_job(self, download_id: str, error: str)-> DownloadJOb |None:
        job = self._transition_job(download_id, DownloadStatus.FAILED)
        if job is None:
            return None
        
        job.error = error
        job.completed_at = datetime.now(timezone.utc)
        
        return job 
    
    
download_job_manager = DownloadJobManager()