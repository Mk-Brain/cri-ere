from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite

class ParcoursBase(SQLModel):
    nom: str
    description: str | None = None

class ParcoursPublic(ParcoursBase):
    id_parcours : int
    visites : Any

class ParcoursCreate(ParcoursBase):
    pass

class Parcours(ParcoursBase, table=True):
    __tablename__: str = "parcours"

    id_parcours: int | None = Field(
        default=None,
        primary_key=True
    )

    nom: str
    description: str | None = None

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="parcours"
    )