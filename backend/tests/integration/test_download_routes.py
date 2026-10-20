from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch, MagicMock
from app.services.download_job_manager import download_job_manager
from app.services.download_orchestrator import DownloadOrchestrator



client = TestClient(app)




def test_get_download_status_returns_completed_job():
    job = download_job_manager.create_job()

    download_job_manager.complete_job(
        download_id=job.download_id,
        filename="Example Video.mp4",
        filepath="downloads/Example Video.mp4",
    )

    response = client.get(
        f"/api/v1/downloads/{job.download_id}"
    )

    assert response.status_code == 200
    assert response.json()["status"] == "completed"
    assert response.json()["progress"] == 100.0
    assert response.json()["filename"] == "Example Video.mp4"





@patch("app.api.routes.download_routes.download_media")
def test_download_media_returns_400_when_download_fails(mock_download_media):
    mock_download_media.side_effect = ValueError("Unable to download media")
    response = client.post(
        "/api/v1/downloads",
        json={
            "url": "https://www.youtube.com/watch?v=abc123",
            "format_id": "137",
            "media_type": "video"
        }
    )
    assert response.status_code == 400
    assert response.json() == { "detail": "Unable to download media"}
       
    
    
    
    
def test_get_download_status_returns_existing_job():
    job = download_job_manager.create_job()
    download_job_manager.update_progress(job.download_id, 35.5)
    response = client.get(f"/api/v1/downloads/{job.download_id}")
    
    assert response.status_code == 200
    assert response.json()["download_id"] == job.download_id
    assert response.json()["status"] == "downloading"
    assert response.json()["progress"] == 35.5
    
    
    

def test_get_download_status_returns_404_when_job_does_not_exist():
    response = client.get("/api/v1/downloads/does-not-exist")
    assert response.status_code == 404
    
    
    
    

@patch("app.api.routes.download_routes.download_orchestrator")    
def test_start_download_returns_download_id(mock_orchestrator):
    mock_orchestrator.create_download.return_value = {
        "download_id": "download-123",
        "status": "pending"
    }
    response = client.post(
        "/api/v1/downloads",
        json={
            "url": "https://youtube.com/watch?v=abc123",
            "format_id": "137",
            "media_type": "video",
            "audio_format":"original"
        }
    )
    assert response.status_code == 202
    assert response.json() == {
        "download_id": "download-123",
        "status": "pending"
    }
    
    
    


def test_download_file_returns_completed_file(tmp_path):
    file_path = tmp_path / "Example Video.mp4"
    file_path.write_bytes(b"fake-video-content")
    
    job = download_job_manager.create_job()
    download_job_manager.complete_job(
        download_id=job.download_id,
        filename="Example Video.mp4",
        filepath=str(file_path),
    )
    response = client.post(
        f"/api/v1/downloads/{job.download_id}/file"
    )
    assert response.status_code == 200
    assert response.content == b"fake-video-content"
    
    
    
    
    
def test_download_file_returns_400_when_download_is_not_completed():
    job = download_job_manager.create_job()
    response = client.get(f"/api/v1/downloads/{job.download_id}/file")
    assert response.status_code == 400
    
    
    
    

def test_download_file_returns_404_when_job_does_not_exist():
    response = client.get(f"/api/v1/downloads/{"does-not-exist"}/file")
    assert response.status_code == 404