from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Injection de la liste CORS configurée
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
def read_root():
    return {
        "db_uri_configured": bool(settings.SQLALCHEMY_DATABASE_URI),
        "cors_origins": settings.BACKEND_CORS_ORIGINS,
    }


def start():
    uvicorn.run("backend_cri_ere.main:app", host="127.0.0.1", port=8000, reload=True)