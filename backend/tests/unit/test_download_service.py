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
        format_id="137",
        media_type="video"
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
            { "filepath": "downloads/Example Video.mp4"}
        ]
    }
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    result = download_media(
        url="https://www.youtube.com/watch?v=abc123",
        format_id= "abc123",
        media_type="video"
    )
    
    assert result == {
        "status": "completed",
        "filename": "Example Video.mp4",
        "filepath": "downloads/Example Video.mp4"
    }
    
    
    
    
    
@patch("app.services.download_service.YoutubeDL")
def test_download_media_raises_value_error_when_download_fails(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.side_effect = DownloadError("Download failed")
    
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    with pytest.raises(ValueError, match="Unable to download media"):
        download_media(
            url="https://www.youtube.com/watch?v=abc123",
            format_id="137",
            media_type="video"
        )
        
        
        
        
@patch("app.services.download_service.YoutubeDL")
def test_download_media_uses_selected_video_and_best_audio(mock_youtube_ydl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.return_value = {
        "id": "abc123",
        "title": "Example Video",
        "ext": "mp4",
        "requested_downloads": [
            {
                "filepath": "downloads/Example Video.mp4"
            }
        ]
    }
    mock_youtube_ydl.return_value.__enter__.return_value = mock_ydl
    download_media(
        url="https://www.youtube.com/watch?v=abc123", 
        format_id="137",
        media_type="video"
    )
    options = mock_youtube_ydl.call_args.args[0]
    
    assert options["format"] == "137+bestaudio/best"
    assert options["merge_output_format"]== "mp4"
    
    
    
    
    
@patch("app.services.download_sevice.YoutubeDL")
def test_uses_selected_audio_format(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_ydl.extract_info.return_value = {
        "id": "abc123",
        "title": "Example audio",
        "ext": "m4a",
        "requested_downloads": [
            {
                "filepath": "downloads/Example Audio.m4a"
            }
        ]
    }
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    download_media(
        url= "https://www.youtube.com/watch?v=abc123",
        format_id="140",
        media_type="audio"
    )
    options = mock_youtube_dl.call_args.args[0]
    assert options["format"] =="140"