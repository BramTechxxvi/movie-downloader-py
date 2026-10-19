


class DownloadOrchestrator:
    def __init__(self, job_manager):
        self.job_manager = job_manager
        
        
        
    
    def create_download(self)-> dict:
        job = self.job_manager.create_job()
        return {
            "download_id": job.download_id,
            "status": job.status
        }