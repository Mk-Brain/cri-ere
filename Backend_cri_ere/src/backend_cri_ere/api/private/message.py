import json
from typing import Any

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import Administrateur
from backend_cri_ere.models.visitorModel import Visiteur
from backend_cri_ere.models.messageModel import (
    VisitorMessage,
    VisitorMessageCreate,
    VisitorMessagePublic,
    VisitorMessageUpdate,
)
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlmodel import func, select

router = APIRouter(prefix="/api/messages", tags=["messages"])
crudOperator = Repository(VisitorMessage)

MESSAGE_FIELDS = {
    "id_message": VisitorMessage.id_message,
    "contenu": VisitorMessage.contenu,
    "date_envoi": VisitorMessage.date_envoi,
    "statut": VisitorMessage.statut,
    "nom": VisitorMessage.nom,
    "email": VisitorMessage.email,
    "id_visiteur": VisitorMessage.id_visiteur,
}


@router.get("/")
def get_messages(
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
        column = MESSAGE_FIELDS.get(field)
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
        column = MESSAGE_FIELDS.get(item.get("field"))
        direction = item.get("sort")
        if column is not None and direction in {"asc", "desc"}:
            sort_expressions.append(
                column.asc() if direction == "asc" else column.desc()
            )

    with db_session() as session:
        count_statement = select(func.count(VisitorMessage.id_message))
        statement = select(VisitorMessage)
        if predicates:
            logic = filter_model.get("logicOperator", "and")
            condition = or_(*predicates) if logic == "or" else and_(*predicates)
            count_statement = count_statement.where(condition)
            statement = statement.where(condition)
        total_count = session.exec(count_statement).one()
        if sort_expressions:
            statement = statement.order_by(*sort_expressions)
        else:
            statement = statement.order_by(VisitorMessage.id_message)
        statement = statement.offset(page * pageSize).limit(pageSize)
        messages = session.exec(statement).all()

        payload = {
            "items": [
                VisitorMessagePublic.model_validate(message) for message in messages
            ],
            "itemCount": total_count,
        }
    print(payload)
    return payload


@router.get("/{id_message}")
def get_message(
    id_message: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        message = crudOperator.get(session, id_message)
        if message is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de message invalide",
            )
        return message.model_dump()


@router.post("/new")
def addmessage(
    message: VisitorMessageCreate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        visiteur = session.get(Visiteur, message.id_visiteur)
        if visiteur is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de visiteur invalide",
            )
        new_message = VisitorMessage(
            contenu=message.contenu,
            date_envoi=message.date_envoi,
            statut=message.statut,
            id_visiteur=message.id_visiteur,
            nom=message.nom or visiteur.nom,
            email=message.email or visiteur.email,
        )
        created = crudOperator.create(session=session, obj_in=new_message)
        return created.model_dump()


@router.patch("/edit/{id_message}")
def updatemessage(
    id_message: int,
    message: VisitorMessageUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        db_message = crudOperator.get(session, id_message)
        if db_message is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de message invalide",
            )
        updated = crudOperator.update(session, db_message, message)
        return updated.model_dump()


@router.delete("/delete/{id_message}")
def deletemessage(
    id_message: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, str]:
    with db_session() as session:
        if not crudOperator.delete(session, id_message):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de message invalide",
            )

    return {"message": "suppression réussie"}
