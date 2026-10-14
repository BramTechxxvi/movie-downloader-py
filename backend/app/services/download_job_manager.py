from uuid import uuid4
from app.models.download_job import DownloadJOb, DownloadStatus




class DownloadJobManager:
    def __init__(self):
        self._jobs: dict[str, DownloadJOb] = {}
        
        
        
        
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
        
        job.status = DownloadStatus.DOWNLOADING
        job.progress = progress
        
        return job
    
    
    
    
    def complete_job(
        self, download_id: str, 
        filename: str, filepath: str )-> DownloadJOb |None:
        
        job = self.get_job(download_id)
        if job is None:
            return None
        
        job.status = DownloadStatus.COMPLETED
        job.progress = 100.0
        job.filename = filename
        job.filepath = filepath
        job.error = None
        
        return job
    
    
    
        
        
        