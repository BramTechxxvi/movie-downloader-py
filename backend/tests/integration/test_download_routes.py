from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch
from app.services.download_job_manager import download_job_manager



client = TestClient(app)




@patch("app.api.routes.download_routes.download_media")
def test_download_media_returns_completed_status(mock_download_media):
    mock_download_media.return_value = { 
        "status": "completed",
        "filename": "Example Video.mp4",
        "filepath": "downloads/Example Video.mp4"
    }
    response = client.post(
        "/api/v1/downloads",
        json= { 
            "url": "https://www.youtube.com/watch?v=abc123", 
            "format_id": "137",
            "media_type": "video"
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == "completed"





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
    
    
    
    

@patch("app.api.routes.download_routes.start_download")    
def test_start_download_reurns_download_id(mock_start_download):
    mock_start_download.return_value = {
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