from unittest.mock import MagicMock, patch
from app.services.media_service import analyze_media, normalize_formats






@patch("app.services.media_service.YoutubeDL")
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
    
    assert result["provider"] == "youtube"
    assert result["id"] == "abc123"
    assert result["title"] == "Example Video"
    assert result["thumbnail"] == "https://example.com/thumb.jnp"
    assert result["duration"] == 120
    assert result["uploader"] == "Example Channel"
    
    
    
    
def test_normalize_formats_returns_clean_format_data():
    formats = [
        {
            "format_id": "137",
            "ext": "mp4",
            "height": 1080,
            "vcodec": "avc1.640028",
            "acodec": "none",
        },
        {
            "format_id": "140",
            "ext": "m4a",
            "height": None,
            "vcodec": "none",
            "acodec": "mp4a.40.2",
        }
    ]
    result = normalize_formats(formats)
    assert result == [
        {
            "format_id": "137",
            "type": "video",
            "resolution": "1080p",
            "extension": "mp4",
        },
        {
            "format_id": "140",
            "type": "audio",
            "resolution": None,
            "extension": "m4a"
        }
    ]