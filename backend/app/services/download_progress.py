

def create_progress_hook(manager, download_id: str):
    def progress_hook(data: dict) -> None:
        if data.get("status") != "downloading":
            return
        
        downloading_bytes = data.get("downloading_bytes")
        total_bytes = data.get("total_bytes")
        if not downloading_bytes or not total_bytes:
            return
        
        progress = (downloading_bytes / total_bytes) * 100
        manager.update_progress(download_id, round(progress, 2))
    
    return progress_hook