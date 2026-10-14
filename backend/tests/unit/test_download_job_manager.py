from app.services.download_job_manager import DownloadJobManager
from app.models.download_job import DownloadStatus






def test_create_job_returns_pending_download_job():
    manager = DownloadJobManager()
    job = manager.create_job()
    
    assert job.download_id is not None
    assert job.status == DownloadStatus.PENDING
    assert job.progress == 0.0
    
    
    
    
def test_get_job_returns_existing_job():
    manager = DownloadJobManager()
    created_job = manager.create_job()
    
    retrieved_job = manager.get_job(created_job.download_id)
    assert retrieved_job == created_job
    
    
    
    
def test_get_job_returns_none_when_job_does_not_exist():
    manager = DownloadJobManager()
    result = manager.get_job("not-existing-job")
    assert result is None
    
    
    
    
def test_update_progress_changes_progress_and_status():
    manager = DownloadJobManager()
    job = manager.create_job()
    
    updated_job = manager.update_progress(job.download_id, 42.5)
    assert updated_job is not None
    
    assert updated_job.progress == 42.5
    assert updated_job.status == DownloadStatus.DOWNLOADING
    
    
    
    
    
def test_complete_job_marks_job_as_completed():
    manager = DownloadJobManager()
    job = manager.create_job()
    
    completed_job = manager.complete_job(
        download_id= job.download_id,
        filename= "Example Video.mp4",
        filepath= "downloads/Example Video.mp4"
    )
    assert completed_job is not None
    assert completed_job.status == DownloadStatus.COMPLETED
    assert completed_job.progress == 100.0
    assert completed_job.filename == "Example Video.mp4"
    assert completed_job.filepath == "downloads/Example Video.mp4"