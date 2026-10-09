from unittest.mock import MagicMock, patch
from app.api.routes.download_routes import download_route




@patch("app.services.download_service.YoutubeDL")
def test_download_media_downloads_selected_format(mock_youtube_dl):
    mock_ydl = MagicMock()
    mock_youtube_dl.return_value.__enter__.return_value = mock_ydl
    
    result = download_route(
        url="https://www.youtube.com/watch?v=abc123",
        format_id="137"
    )
    mock_ydl.download.assert_called_once_with(["https://www.youtube.com/watch?v=abc123"])
    assert result["status"] == "completed"