from backend_cri_ere.crud.database import db_session
from backend_cri_ere.models.timeSlotModel import CreneauHorairePublic
from fastapi import APIRouter


router = APIRouter(prefix="/api/creneaux", tags=["creneaux"])


@router.get("/", response_model=list[CreneauHorairePublic])
def get_creneaux():
    with db_session() as session:
        creneaux = session.query(CreneauHorairePublic).all()
    return creneaux