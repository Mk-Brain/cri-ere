from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .core.config import settings
from backend_cri_ere.api.private.visite import router as visite_router
from backend_cri_ere.api.private.parcours import router as parcours_router
from backend_cri_ere.api.private.guides import router as guides_router
from backend_cri_ere.api.private.creneau import router as creneaux_router
from backend_cri_ere.api.private.message import router as messages_router
from backend_cri_ere.api.private.visiteur import router as visiteur_router
from backend_cri_ere.api.public.contact import router as contact_router
from backend_cri_ere.api.public.reservation import router as reservation_router

import backend_cri_ere.services.firebase
import backend_cri_ere.models

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
app.include_router(messages_router)
app.include_router(visiteur_router)
app.include_router(reservation_router)
app.include_router(contact_router)
# Injection de la liste CORS configurée
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
print(f"BACKEND_CORS_ORIGINS: {settings.BACKEND_CORS_ORIGINS}")


@app.get("/")
def read_root():
    return {
        "message": f"Bienvenu sur l'API {settings.PROJECT_NAME} !",
    }


@app.get("/health")
def check_health():
    return {"message": "OK"}


def start():
    uvicorn.run("backend_cri_ere.main:app", host="127.0.0.1", port=8000, reload=True)
