from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch



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
            "format_id": "137"
        }
    )
    assert response.status_code == 200
    # assert response.json() == {"status": "completed"}
    
    
    
    
    
