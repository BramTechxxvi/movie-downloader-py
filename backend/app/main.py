from fastapi import FastAPI
from app.api.routes.media_routes import router as media_router
from app.api.routes.download_routes import router as download_router




app = FastAPI(
    title="Multimedia Downloader",
    description="",
    version= "1.0.0",
)

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Multimedia Downloader"
    }
    


app.include_router(media_router)
app.include_router(download_router)


