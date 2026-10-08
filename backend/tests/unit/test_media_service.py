from unittest.mock import MagicMock, patch
from app.services.media_service import analyze_media






@patch("app.services.media_services.YoutubeDL")
def test_analyze_media_returns_video_metatdata(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.return_value = {
        "id": "abc123",
        "title": "Example Video",
        "thumbnail": "https://example.com/thumb.jnp",
        "duration": 120,
        "uploader": "Example Channel",
        "formats": [],
    }
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    result = analyze_media("https://www.youtube.com/watch?v=abc123")
    
    assert result["id"] == "abc123"
    assert result["title"] == "Example Video"
    assert result["thumbnail"] == "https://example.com/thumb.jnp"
    assert result["duration"] == 120
    assert result["uploader"] == "Example Channel"