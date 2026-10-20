from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict




class Settings(BaseSettings):
    app_name: str = "Media Downloader API"
    download_dir: Path = Path("downloads")
    download_file_ttl_minutes: int = 30
    
    
    model_config = SettingsConfigDict(
        env_file = ".env",
        extra="forbid"
    )
        
settings = Settings()