import logging
from typing import Any
from html import escape
import json
from backend_cri_ere.api.private.visite import VisitEmailRequest, VisitEmailResponse
import resend
from backend_cri_ere.core.config import settings
from backend_cri_ere.models.visitorModel import Visiteur
from resend.exceptions import ResendError
from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import AdminPublic, Administrateur
from backend_cri_ere.models.visitorModel import (
    Visiteur,
    VisiteurCreate,
    VisiteurPublic,
    VisiteurUpdate,
)
from backend_cri_ere.models.messageModel import StatutMessage, VisitorMessage
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import and_, or_
from sqlmodel import func, select

router = APIRouter(prefix="/api/visiteurs", tags=["visiteurs"])
crudOperator = Repository(Visiteur)
logger = logging.getLogger(__name__)

"""dictionnaire de colonnes autorisées pour appliquer les filtres et les tris"""
VISITEUR_FIELDS = {
    "id_visiteur": Visiteur.id_visiteur,
    "nom": Visiteur.nom,
    "prenom": Visiteur.prenom,
    "email": Visiteur.email,
    "telephone": Visiteur.telephone,
}


"""récupération des visiteurs filtrés, triés et paginés"""


@router.get("/")
def get_visiteurs(
    page: int = Query(0, ge=0),
    pageSize: int = Query(10, gt=0),
    sort: str | None = None,
    filter: str | None = None,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    sort_model = _decode_query_model(sort, [])
    filter_model = _decode_query_model(filter, {"items": []})
    filters = filter_model.get("items", [])
    predicates = []

    for item in filters:
        field = item.get("field")
        operator = item.get("operator")
        value = item.get("value")
        column = VISITEUR_FIELDS.get(field)
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
        column = VISITEUR_FIELDS.get(item.get("field"))
        direction = item.get("sort")
        if column is not None and direction in {"asc", "desc"}:
            sort_expressions.append(
                column.asc() if direction == "asc" else column.desc()
            )

    with db_session() as session:
        count_statement = select(func.count(Visiteur.id_visiteur))
        statement = select(Visiteur)
        if predicates:
            logic = filter_model.get("logicOperator", "and")
            condition = or_(*predicates) if logic == "or" else and_(*predicates)
            count_statement = count_statement.where(condition)
            statement = statement.where(condition)
        total_count = session.exec(count_statement).one()
        if sort_expressions:
            statement = statement.order_by(*sort_expressions)
        else:
            statement = statement.order_by(Visiteur.id_visiteur)
        statement = statement.offset(page * pageSize).limit(pageSize)
        visiteurs = session.exec(statement).all()

        payload = {
            "items": [
                VisiteurPublic.model_validate(visiteur) for visiteur in visiteurs
            ],
            "itemCount": total_count,
        }
    print(payload)
    return payload


class VisitorLookupResponse(BaseModel):
    nom: str
    prenom: str | None = None
    email: str


@router.get("/check", response_model=VisitorLookupResponse)
def get_visiteur_by_phone(
    phone: str,
) -> VisitorLookupResponse:
    phone = phone.strip() if phone else ""
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un numéro de téléphone est requis.",
        )

    with db_session() as session:
        visiteurs = session.exec(
            select(Visiteur).where(Visiteur.telephone == phone).limit(2)
        ).all()
        if len(visiteurs) != 1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Visiteur introuvable.",
            )
        visiteur = visiteurs[0]
        return VisitorLookupResponse(
            nom=visiteur.nom,
            prenom=visiteur.prenom,
            email=visiteur.email,
        )


@router.get("/{id_visiteur}")
def get_visiteur(
    id_visiteur: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        visiteur = crudOperator.get(session, id_visiteur)
        if visiteur is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visiteur invalide",
            )
        return visiteur.model_dump()

@router.post("/new")
def addvisiteur(
    visiteur: VisiteurCreate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    new_visiteur = Visiteur.model_validate(visiteur)
    with db_session() as session:
        sql = select(Visiteur).where(Visiteur.email == new_visiteur.email).limit(1)
        user_db = session.exec(sql).first()
        if user_db:
            print(f"Un visiteur avec l'email {user_db.email} existe déjà.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un visiteur avec cet email existe déjà.",
            )
        created_visiteur = crudOperator.create(session=session, obj_in=new_visiteur)
        return created_visiteur.model_dump()

# TODO: corrriger les problèe de token expiré

@router.patch("/{id_visiteur}")
def updatevisiteur(
    id_visiteur: int,
    visiteur: VisiteurUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        db_visiteur = crudOperator.get(session, id_visiteur)
        if db_visiteur is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visiteur invalide",
            )
        updated_visiteur = crudOperator.update(session, db_visiteur, visiteur)
        return updated_visiteur.model_dump()


@router.delete("/{id_visiteur}")
def deletevisiteur(
    id_visiteur: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, str]:
    with db_session() as session:
        if not crudOperator.delete(session, id_visiteur):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visiteur invalide",
            )

    return {"message": "suppression réussie"}


""" Envoyer un mail à un visiteur  """


@router.post("/{id_visiteur}/email", response_model=VisitEmailResponse)
def send_visit_email(
    id_visiteur: int,
    request: VisitEmailRequest,
    user: AdminPublic = Depends(get_current_user),
) -> VisitEmailResponse:
    with db_session() as session:
        visiteur = session.exec(
            select(Visiteur).where(Visiteur.id_visiteur == id_visiteur)
        ).first()
        if visiteur is None or visiteur.id_visiteur is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visiteur invalide.",
            )
        if not visiteur.email:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Aucune adresse e-mail n’est associée à ce visiteur.",
            )
        recipient_email = visiteur.email
        recipient_name = visiteur.prenom or visiteur.nom
        visitor_id = visiteur.id_visiteur

    resend.api_key = settings.RESEND_API_KEY
    escaped_name = escape(recipient_name)
    escaped_subject = escape(request.sujet)
    escaped_content = escape(request.contenu).replace("\n", "<br>")
    params: resend.Emails.SendParams = {
        "from": "CRI-ERE <admin@criere.aclclouds.online>",
        "to": [recipient_email],
        "subject": request.sujet,
        "text": f"Bonjour {recipient_name},\n\n{request.contenu}\n\nL’équipe du CRI-ERE",
        "html": (
            f"<p>Bonjour {escaped_name},</p>"
            f"<h2>{escaped_subject}</h2>"
            f"<p>{escaped_content}</p>"
            "<p>L’équipe du CRI-ERE</p>"
        ),
    }

    try:
        resend.Emails.send(params=params)
    except ResendError as error:
        logger.exception("Resend failed to send email for visitor %s", id_visiteur)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Le courriel n’a pas pu être envoyé. Réessayez plus tard.",
        ) from error

    sent_message = VisitorMessage(
        contenu=request.contenu,
        statut=StatutMessage.REPONDU,
        nom=f"{user.prenom} {user.nom}" if user.prenom else user.nom,
        email=user.email,
        id_visiteur=visitor_id,
        id_administrateur=user.id_administrateur,
    )
    with db_session() as session:
        session.add(sent_message)
        session.flush()

    return VisitEmailResponse(message="Le courriel a été envoyé et historisé.")


# TODO: Ajouter une selecteur pour le code du pays avant les numeros de téléphone
# TODO: Ajouteter un rappel email auto pour la visite