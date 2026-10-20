from pathlib import Path


def delete_file(filepath: str) -> bool:
    path = Path(filepath)

    if not path.exists():
        return False

    path.unlink()

    return True