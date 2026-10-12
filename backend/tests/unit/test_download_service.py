from unittest.mock import MagicMock, patch
from app.services.download_service import download_media
import pytest
from yt_dlp.utils import DownloadError






@patch("app.services.download_service.YoutubeDL")
def test_download_media_downloads_selected_format(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.return_value = {
        "id": "abc123",
        "title": "Example Video",
        "ext": "mp4",
        "requested_downloads": [
            { "filepath": "downloads/Example Video.mp4" }
        ]
    }
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    
    result = download_media(
        url="https://www.youtube.com/watch?v=abc123",
        format_id="137"
    )
    mock_ydl.extract_info.assert_called_once_with("https://www.youtube.com/watch?v=abc123", download=True)
    assert result["status"] == "completed"
    
    
    

@patch("app.services.download_service.YoutubeDL")
def test_download_media_saves_file_to_download_directory(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.return_value = {
        "id": "abc123",
        "title": "Example Video",
        "ext": "mp4",
        "requested_downloads": [
            { "filpath": "downloads/Example Video.mp4"}
        ]
    }
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    result = download_media(
        url="https://www.youtube.com/watch?v=abc123",
        format_id= "abc123"
    )
    
    assert result == {
        "status": "completed",
        "filename": "Example Video.mp4",
        "filepath": "downloads/Example Video.mp4"
    }