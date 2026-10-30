import json
from typing import Any

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.adminModel import Administrateur
from backend_cri_ere.models.visitModel import Visite, VisteCreate, VisitePublic, VisteUpdate
from backend_cri_ere.services.auth import get_current_user
from backend_cri_ere.utils.decode_query import _decode_query_model
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlmodel import func, select

router = APIRouter(prefix="/api/visites", tags=["visites"])
crudOperator = Repository(Visite)

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


@router.post("/new")
def addvisit(
    visit: VisteCreate,
    user: Administrateur = Depends(get_current_user),
) -> dict[str, Any]:
    new_visit = Visite.model_validate(visit)
    with db_session() as session:
        created_visit = crudOperator.create(session=session, obj_in=new_visit)
        return created_visit.model_dump()


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
