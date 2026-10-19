from unittest.mock import MagicMock
from app.services.download_orchestrator import DownloadOrchestrator



def test_start_download_creates_pending_job():
    manager = MagicMock()
    job = MagicMock()
    job.download_id = "download-123"
    job.status = "pending"
    
    manager.create_job.return_value = job
    orchestrator = DownloadOrchestrator(job_manager=manager)
    result = orchestrator.create_download()
    
    manager.create_job.assert_called_once()
    assert result  == {
        "download_id": "dowload-123",
        "status": "pending"
    }
    