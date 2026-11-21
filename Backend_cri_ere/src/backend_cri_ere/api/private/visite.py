import logging
from datetime import date
from typing import Any
from pydantic import BaseModel, Field, field_validator

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import  Administrateur
from backend_cri_ere.models.courseModel import Parcours
from backend_cri_ere.models.guideModel import Guide
from backend_cri_ere.models.timeSlotModel import CreneauHoraire
from backend_cri_ere.models.visitModel import (
    StatutVisite,
    Visite,
    VisitePublic,
    VisiteStatusUpdate,
    VisteUpdate,
)
from backend_cri_ere.models.visitorModel import Visiteur
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
from pydantic import EmailStr
from sqlmodel import func, select

router = APIRouter(prefix="/api/visites", tags=["visites"])
crudOperator = Repository(Visite)
logger = logging.getLogger(__name__)


class VisitEmailRequest(BaseModel):
    sujet: str = Field(min_length=1, max_length=255)
    contenu: str = Field(min_length=1, max_length=10000)

    @field_validator("sujet", "contenu")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Ce champ ne peut pas être vide.")
        return value


class VisitEmailResponse(BaseModel):
    message: str


class PrivateVisitorInput(BaseModel):
    nom: str = Field(min_length=1, max_length=255)
    prenom: str | None = Field(default=None, max_length=255)
    email: EmailStr = Field(max_length=254)
    telephone: str = Field(min_length=1, max_length=50)

    @field_validator("nom", "telephone")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Ce champ ne peut pas être vide.")
        return value

    @field_validator("prenom", mode="after")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None


class PrivateVisitInput(BaseModel):
    date_visite: date
    nombre_personnes: int = Field(ge=1)
    id_parcours: int
    id_creneau: int
    id_guide: int


class PrivateVisitCreationInput(BaseModel):
    visiteur: PrivateVisitorInput
    visite: PrivateVisitInput

"""dictionnaire de colonnes autorisées pour aplliquer les filtres et les tri"""
VISIT_FIELDS = {
    "id_visite": Visite.id_visite,
    "date_visite": Visite.date_visite,
    "statut": Visite.statut,
    "nombre_personnes": Visite.nombre_personnes,
    "id_visiteur": Visite.id_visiteur,
    "id_parcours": Visite.id_parcours,
    "id_creneau": Visite.id_creneau,
    "id_guide": Visite.id_guide,
}



"""recuprération des visites filtrées, trée et paginéés"""
@router.get("/")
def get_visites(
    page: int = Query(0, ge=0),
    pageSize: int = Query(10, gt=0),
    sort: str | None = None,
    filter: str | None = None,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    sort_model = _decode_query_model(sort, [])
    filter_model = _decode_query_model(filter, {"items": []})
    filters = filter_model.get("items", [])
    predicates = [] #  accumule les conditions SQL

    for item in filters:
        field = item.get("field")
        operator = item.get("operator")
        value = item.get("value")
        column = VISIT_FIELDS.get(field)
        if column is None or operator is None:
            continue
        if operator == "isEmpty":
            predicates.append(column.is_(None))
        elif operator == "isNotEmpty":
            predicates.append(column.is_not(None))
        elif value is None:
            continue
        elif operator in {"equals", "is", "="}:
            predicates.append(column == value)
        elif operator in {"not", "doesNotEqual", "!="}:
            predicates.append(column != value)
        elif operator == "contains":
            predicates.append(column.contains(str(value), autoescape=True))
        elif operator == "startsWith":
            predicates.append(column.startswith(str(value), autoescape=True))
        elif operator == "endsWith":
            predicates.append(column.endswith(str(value), autoescape=True))
        elif operator == ">":
            predicates.append(column > value)
        elif operator == ">=":
            predicates.append(column >= value)
        elif operator == "<":
            predicates.append(column < value)
        elif operator == "<=":
            predicates.append(column <= value)
        elif operator == "isAnyOf" and isinstance(value, list):
            predicates.append(column.in_(value))

    sort_expressions = []
    for item in sort_model:
        column = VISIT_FIELDS.get(item.get("field"))
        direction = item.get("sort")
        if column is not None and direction in {"asc", "desc"}:
            sort_expressions.append(
                column.asc() if direction == "asc" else column.desc()
            )

    with db_session() as session:
        count_statement = select(func.count(Visite.id_visite))
        statement = select(Visite)
        if predicates:
            logic = filter_model.get("logicOperator", "and")
            condition = (
                or_(*predicates)
                if logic == "or"
                else and_(*predicates)
            )
            count_statement = count_statement.where(condition)
            statement = statement.where(condition)
        total_count = session.exec(count_statement).one()
        if sort_expressions:
            statement = statement.order_by(*sort_expressions)
        else:
            statement = statement.order_by(Visite.id_visite)
        statement = statement.offset(page * pageSize).limit(pageSize)
        visites = session.exec(statement).all()

        payload = {
            "items": [
                VisitePublic.model_validate(visite) for visite in visites
            ],
            "itemCount": total_count,
        }
    print(payload)
    return payload

"""récupération d'une visite par son identifiant"""
@router.get("/{id_visite}")
def get_visite(
    id_visite: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        visite = crudOperator.get(session, id_visite)
        if visite is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visite invalide",
            )
        return visite.model_dump()

""" Ajout d'une nouvelle visite"""
@router.post("/new", status_code=status.HTTP_201_CREATED)
def addvisit(
    creation: PrivateVisitCreationInput,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    request_visit = creation.visite
    request_visitor = creation.visiteur
    if request_visit.date_visite < date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="La date de visite ne peut pas être dans le passé.",
        )

    email = str(request_visitor.email).strip().lower()
    telephone = request_visitor.telephone.strip()

    try:
        with db_session() as session:
            parcours = session.get(Parcours, request_visit.id_parcours)
            creneau = session.get(CreneauHoraire, request_visit.id_creneau)
            guide = session.get(Guide, request_visit.id_guide)
            if parcours is None or creneau is None or guide is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Le parcours, le créneau ou le guide sélectionné est introuvable.",
                )

            existing_visitors = session.exec(
                select(Visiteur).where(
                    or_(
                        func.lower(Visiteur.email) == email,
                        Visiteur.telephone == telephone,
                    )
                )
            ).all()

            if len(existing_visitors) > 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ces coordonnées sont déjà associées à plusieurs visiteurs.",
                )

            visiteur = existing_visitors[0] if existing_visitors else None
            if visiteur is not None:
                visiteur.email = email
                visiteur.telephone = telephone
                visiteur.nom = request_visitor.nom
                visiteur.prenom = request_visitor.prenom
                visiteur_id = visiteur.id_visiteur
            else:
                visiteur = Visiteur(
                    nom=request_visitor.nom,
                    prenom=request_visitor.prenom,
                    email=email,
                    telephone=telephone,
                )
                session.add(visiteur)
                session.flush()
                visiteur_id = visiteur.id_visiteur

            created_visit = Visite(
                date_visite=request_visit.date_visite,
                statut=StatutVisite.EN_ATTENTE,
                nombre_personnes=request_visit.nombre_personnes,
                id_visiteur=visiteur_id,
                id_parcours=request_visit.id_parcours,
                id_creneau=request_visit.id_creneau,
                id_guide=request_visit.id_guide,
            )
            session.add(created_visit)
            session.flush()
            session.commit()

            return created_visit.model_dump()
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ces coordonnées sont déjà associées à un autre visiteur.",
        ) from error

""" Mise à jour d'une visite existante """
@router.patch("/edit/{id_visite}")
def updatevisit(
    id_visite: int,
    visit: VisteUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        db_visit = crudOperator.get(session, id_visite)
        if db_visit is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visite invalide",
            )
        updated_visit = crudOperator.update(session, db_visit, visit)
        return updated_visit.model_dump()

""" Suppression d'une visite existante """
@router.delete("/delete/{id_visite}")
def deletevisit(
    id_visite: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, str]:
    with db_session() as session:
        if not crudOperator.delete(session, id_visite):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visite invalide",
            )

    return {"message": "suppression réussie"}


""" Mise à jour du statut d'une visite existante """
@router.patch("/{id}/status")
def update_visit_status(
    id: int,
    status_update: VisiteStatusUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        visite = crudOperator.get(session, id)
        if visite is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visite invalide",
            )
        visite.statut = status_update.status
        session.flush()
        return visite.model_dump()

