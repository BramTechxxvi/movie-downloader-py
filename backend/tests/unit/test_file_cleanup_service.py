from app.services.file_cleanup_service import delete_file



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