from pathlib import Path
from pydantic_settings import BaseSettings




class Settings(BaseSettings):
    app_name: str = "Media Downloader API"
    download_dir: Path = Path("downloads")
    download_fie_ttl_minutes: int = 30
    
    
    class Config:
        env_file = ".env"
        
        
settings = Settings()