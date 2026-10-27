from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.media_routes import router as media_router
from app.api.routes.download_routes import router as download_router




app = FastAPI(
    title="Multimedia Downloader",
    description="",
    version= "1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # "https://bramdownloads"
    ],
    allow_credentials=True,
    allow_methods={"POST", "GET"},
    allow_headers={"*"}
)

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Multimedia Downloader"
    }
    


app.include_router(media_router)
app.include_router(download_router)

