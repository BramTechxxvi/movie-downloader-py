from dataclasses import dataclass
from enum import StrEnum



class DownloadStatus(StrEnum):
    PENDING = "pending"
    DOWNLOADING = "downloading"
    COMPLETED = "completed"
    FAILED = "failed"
    
    
    
@dataclass
class DownloadJOb:
    download_id: str
    status: DownloadStatus
    progress: float = 0.0
    filename: str | None = None
    filepath: str | None = None
    error: str | None = None