from backend_cri_ere.crud.database import db_session
from backend_cri_ere.models.visitModel import Visite, VisteCreate
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import Session, select, func
from typing import Any

router = APIRouter(prefix="/api/visites", tags=["visites"])

@router.get("/")
def get_visites(
    page: int = Query(0, ge=0),
    pageSize: int = Query(10, gt=0),
) -> dict[str, Any]:
    with db_session() as session:
        # Compter le nombre total d'éléments en BDD
        total_count = session.exec(select(func.count(Visite.id_visite))).one()
        
        # Récupérer la sous-liste paginée
        statement = select(Visite).offset(page * pageSize).limit(pageSize)
        visites = session.exec(statement).all()

    return {
        "items": visites,
        "itemCount": total_count
    }

@router.post("/new")
def addvisit(visit : VisteCreate)-> dict[str, str]:
    db_visit = Visite.model_validate(visit)
    with db_session() as session:
        try:
            session.add(db_visit)
        except :
            raise HTTPException(status_code=500, detail="Echec d'insertion dans la base de données")

    return {
        "message" : "insertion réussie"
    }