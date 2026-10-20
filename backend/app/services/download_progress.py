

def create_progress_hook(manager, download_id: str):
    def progress_hook(data: dict) -> None:
        if data.get("status") != "downloading":
            return
        
        downloaded_bytes = data.get("downloaded_bytes", 0)
        total_bytes = data.get("total_bytes") or data.get("total_bytes_estimate")
        if not downloaded_bytes or not total_bytes:
            return
        
        progress = (downloaded_bytes / total_bytes) * 100
        manager.update_progress(download_id, round(progress, 2))
    
    return progress_hook