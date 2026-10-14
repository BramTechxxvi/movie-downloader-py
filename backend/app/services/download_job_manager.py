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
    
    
    
        