from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite

class Guide(SQLModel, table=True):
    __tablename__ = "guide"

    id_guide: int | None = Field(
        default=None,
        primary_key=True
    )

    nom: str
    prenom: str | None = None
    telephone: str = Field(unique=True)

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="guide"
    )