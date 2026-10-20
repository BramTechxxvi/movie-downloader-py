from pathlib import Path
from datetime import datetime, timedelta, timezone




def delete_file(filepath: str) -> bool:
    path = Path(filepath)

    if not path.exists():
        return False

    path.unlink()

    return True




def is_expired(completed_at: datetime, lifetime_minutes: int)-> bool:
    expires_at = completed_at + timedelta(minutes=lifetime_minutes)
    return datetime.now(timezone.utc) >= expires_at