import json
from typing import Any

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import Administrateur
from backend_cri_ere.models.guideModel import (
    Guide,
    GuideCreate,
    GuidePublic,
    GuideUpdate,
)
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlmodel import func, select

router = APIRouter(prefix="/api/guides", tags=["guides"])
crudOperator = Repository(Guide)

GUIDE_FIELDS = {
    "id_guide": Guide.id_guide,
    "nom": Guide.nom,
    "prenom": Guide.prenom,
    "telephone": Guide.telephone,
}


@router.get("/")
def get_guides(
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
        column = GUIDE_FIELDS.get(field)
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
        column = GUIDE_FIELDS.get(item.get("field"))
        direction = item.get("sort")
        if column is not None and direction in {"asc", "desc"}:
            sort_expressions.append(
                column.asc() if direction == "asc" else column.desc()
            )

    with db_session() as session:
        count_statement = select(func.count(Guide.id_guide))
        statement = select(Guide)
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
            statement = statement.order_by(Guide.id_guide)
        statement = statement.offset(page * pageSize).limit(pageSize)
        guides = session.exec(statement).all()

        payload = {
            "items": [
                GuidePublic.model_validate(guide) for guide in guides
            ],
            "itemCount": total_count,
        }
    print(payload)
    return payload


@router.get("/{id_guide}")
def get_guide(
    id_guide: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        guide = crudOperator.get(session, id_guide)
        if guide is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de guide invalide",
            )
        return guide.model_dump()


@router.post("/new")
def addguide(
    guide: GuideCreate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    new_guide = Guide.model_validate(guide)
    with db_session() as session:
        created = crudOperator.create(session=session, obj_in=new_guide)
        return created.model_dump()


@router.patch("/edit/{id_guide}")
def updateguide(
    id_guide: int,
    guide: GuideUpdate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    with db_session() as session:
        db_guide = crudOperator.get(session, id_guide)
        if db_guide is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de guide invalide",
            )
        updated = crudOperator.update(session, db_guide, guide)
        return updated.model_dump()


@router.delete("/delete/{id_guide}")
def deleteguide(
    id_guide: int,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, str]:
    with db_session() as session:
        if not crudOperator.delete(session, id_guide):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Identifiant de guide invalide",
            )

    return {"message": "suppression réussie"}