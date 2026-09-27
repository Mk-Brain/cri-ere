from sqlmodel import Relationship, SQLModel, Field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.messageModel import VisitorMessage
    from backend_cri_ere.models.visitModel import Visite


class Visiteur(SQLModel, table=True):
    __tablename__ = "visiteur"

    id_visiteur: int | None = Field(
        default=None,
        primary_key=True
    )

    nom: str
    prenom: str | None = None
    email: str = Field(unique=True)
    telephone: str = Field(unique=True)

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="visiteur"
    )

    messages: list["VisitorMessage"] = Relationship(
        back_populates="visiteur"
    )