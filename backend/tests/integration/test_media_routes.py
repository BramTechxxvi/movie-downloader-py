from fastapi.testclient import TestClient
from app.main import app



client = TestClient(app)


def test_analyze_media_returns_detected_provider():
    response = client.post(
        "api/v1/media/analyze", 
        json={
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    )
    assert response.status_code == 200
    assert response.json() == {"provider": "youtube"}