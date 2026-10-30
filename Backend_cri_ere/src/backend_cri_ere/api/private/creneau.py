import json
from typing import Any

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import Administrateur
from backend_cri_ere.models.timeSlotModel import (
    CreneauHoraire,
    CreneauHoraireCreate,
    CreneauHorairePublic,
    CreneauHoraireUpdate,
)
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlmodel import func, select

router = APIRouter(prefix="/api/creneaux", tags=["creneaux"])
crudOperator = Repository(CreneauHoraire)

CRENEAU_FIELDS = {
    "id_creneau": CreneauHoraire.id_creneau,
    "heure_debut": CreneauHoraire.heure_debut,
    "heure_fin": CreneauHoraire.heure_fin,
}


@router.get("/")
def get_creneaux(
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
        column = CRENEAU_FIELDS.get(field)
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
        column = CRENEAU_FIELDS.get(item.get("field"))
        direction = item.get("sort")
        if column is not None and direction in {"asc", "desc"}:
            sort_expressions.append(
                column.asc() if direction == "asc" else column.desc()
            )

    with db_session() as session:
        count_statement = select(func.count(CreneauHoraire.id_creneau))
        statement = select(CreneauHoraire)
        if predicates:
            logic = filter_model.get("logicOperator", "and")
            condition = or_(*predicates) if logic == "or" else and_(*predicates)
            count_statement = count_statement.where(condition)
            statement = statement.where(condition)
        total_count = session.exec(count_statement).one()
        if sort_expressions:
            statement = statement.order_by(*sort_expressions)
        else:
            statement = statement.order_by(CreneauHoraire.id_creneau)
        statement = statement.offset(page * pageSize).limit(pageSize)
        creneaux = session.exec(statement).all()
        payload = {
            "items": [
                CreneauHorairePublic.model_validate(creneau) for creneau in creneaux
            ],
            "itemCount": total_count,
        }
    print(payload)
    return payload


@router.get("/{id_creneau}")
def get_creneau(
    id_creneau: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        creneau = crudOperator.get(session, id_creneau)
        if creneau is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de créneau invalide",
            )
        return creneau.model_dump()


@router.post("/new")
def addcreneau(
    creneau: CreneauHoraireCreate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    new_creneau = CreneauHoraire.model_validate(creneau)
    with db_session() as session:
        created = crudOperator.create(session=session, obj_in=new_creneau)
        return created.model_dump()


@router.patch("/edit/{id_creneau}")
def updatecreneau(
    id_creneau: int,
    creneau: CreneauHoraireUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        db_creneau = crudOperator.get(session, id_creneau)
        if db_creneau is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de créneau invalide",
            )
        updated = crudOperator.update(session, db_creneau, creneau)
        return updated.model_dump()


@router.delete("/delete/{id_creneau}")
def deletecreneau(
    id_creneau: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, str]:
    with db_session() as session:
        if not crudOperator.delete(session, id_creneau):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de créneau invalide",
            )

    return {"message": "suppression réussie"}
