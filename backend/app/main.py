from fastapi import FastAPI


app = FastAPI(
    title="Multiledia Downloader",
    description="",
    version= "1.0.0",
)


app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Multimedia Downloader"
    }