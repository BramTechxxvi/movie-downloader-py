from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch



client = TestClient(app)


@patch("app.api.routes.media.analyze_media")
def test_analyze_media_returns_metadata(mock_analyze_media):
    mock_analyze_media.return_value = {
        "provider": "youtube",
        "id": "abc123",
        "title": "Example Video",
        "thumbnail": "https://example.com/thumb.jpeg",
        "duration": 120,
        "uploader": "Example Channel",
        "formats": [
            {
                "format_id": "137",
                "type": "video",
                "resolution": "1080p",
                "extension": "mp4"
            },
        ],
    }
    response = client.post(
        "/api/v1/media/analyze", 
        json={ "url": "https://www.youtube.com/watch?v=abc123" }
    )
    assert response.status_code == 200
    assert response.json() == {
        "provider": "youtube",
        "id": "abc123",
        "title": "Example Video",
        "thumbnail": "https://example.com/thumb.jpeg",
        "duration": 120,
        "uploader": "Example Channel",
        "formats": [
            {
                "format_id": "137",
                "type": "video",
                "resolution": '1080p',
                'extension': "mp4"
            }
        ]
        }
    
    
    
def test_analyze_media_rejects_invalid_url():
    response = client.post(
        "/api/v1/media/analyze",
        json={ "url": "not-a-valid-url" }
    )
    assert response.status_code == 422
    
    
    
