from app.services.file_cleanup_service import delete_file, is_expired
from datetime import datetime, timedelta, timezone


def test_delete_file_removes_existing_file(tmp_path):
    file_path = tmp_path / "video.mp4"
    file_path.write_bytes(b"fake-video")

    result = delete_file(str(file_path))

    assert result is True
    assert file_path.exists() is False
    
    
    
    
def test_delete_file_removes_existing_file(tmp_path):
    file_path = tmp_path / "video.mp4"
    file_path.write_bytes(b"fake-video")

    result = delete_file(str(file_path))

    assert result is True
    assert file_path.exists() is False
    



def test_is_expired_returns_true_for_old_download():
    completed_at = (
        datetime.now(timezone.utc)
        - timedelta(minutes=30)
    )

    result = is_expired(
        completed_at=completed_at,
        lifetime_minutes=15,
    )

    assert result is True