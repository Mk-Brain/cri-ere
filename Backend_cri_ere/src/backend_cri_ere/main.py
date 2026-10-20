from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .core.config import settings
from backend_cri_ere.api.visite import router as visite_router
from backend_cri_ere.api.parcours import router as parcours_router
from backend_cri_ere.api.guides import router as guides_router
from backend_cri_ere.api.creneau import router as creneaux_router

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(
    visite_router,
)
app.include_router(
    parcours_router,
)
app.include_router(
    guides_router,
)
app.include_router(
    creneaux_router,
)

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
        "message": f"Bienvenu sur l'API {settings.PROJECT_NAME} !",
    }

@app.get("/health")
def check_health():
    return {
        "message" : "OK"
    }


def start():
    uvicorn.run("backend_cri_ere.main:app", host="127.0.0.1", port=8000, reload=True)
