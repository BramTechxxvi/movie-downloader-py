from unittest.mock import MagicMock
from app.services.download_progress import create_progress_hook







def test_progress_hook_updates_download_progress():
    manager = MagicMock()
    hook = create_progress_hook(manager, download_id="download-123")
    hook ({
        "status": "downloading",
        "downloaded_bytes":50.0,
        "total_bytes": 100
    })
    manager.update_progress.assert_called_once_with("download-123", 50.0)
    
    
    
    

def test_progress_hook_ignores_progress_when_total_size_is_missing():
    manager = MagicMock()
    hook = create_progress_hook(manager, download_id="download-123")
    hook({
        "status": "downloading",
        "downloading_bytes": 50,
    })
    manager.update_progress.assert_not_called()
    
    
    
    
    
def test_progress_hook_uses_total_bytes_estimate():
    manager = MagicMock()

    hook = create_progress_hook(
        manager,
        "download-123",
    )

    hook({
        "status": "downloading",
        "downloaded_bytes": 50,
        "total_bytes": None,
        "total_bytes_estimate": 100,
    })

    manager.update_progress.assert_called_once_with(
        "download-123",
        50.0,
    )