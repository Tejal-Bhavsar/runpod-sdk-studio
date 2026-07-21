import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import pods, serverless, sdk, metrics, assistant, search
from app.websockets import streaming

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="RunPod SDK Studio & Serverless Playground Backend API built for RunPod Full-Stack Engineer showcase."
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(pods.router)
app.include_router(serverless.router)
app.include_router(sdk.router)
app.include_router(metrics.router)
app.include_router(assistant.router)
app.include_router(search.router)
app.include_router(streaming.router)

# Serve frontend static assets in production if compiled dist folder exists
static_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "mock_mode": settings.MOCK_MODE,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
