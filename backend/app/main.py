from fastapi import FastAPI
from app.api.routes.media_routes import router as media_router




app = FastAPI(
    title="Multiledia Downloader",
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


