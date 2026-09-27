from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite

class Parcours(SQLModel, table=True):
    __tablename__ = "parcours"

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