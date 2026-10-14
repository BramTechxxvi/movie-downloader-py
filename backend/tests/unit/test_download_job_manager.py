from app.services.download_job_manager import DownloadJobManager
from app.models.download_job import DownloadStatus






def test_create_job_returns_pending_download_job():
    manager = DownloadJobManager()
    job = manager.create_job()
    
    assert job.download_id is not None
    assert job.status == DownloadStatus.PENDING
    assert job.progress == 0.0