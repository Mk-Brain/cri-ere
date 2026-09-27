from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Relationship, SQLModel, Field

if TYPE_CHECKING:
    from backend_cri_ere.models.adminModel import Administrateur
    from backend_cri_ere.models.messageModel import VisitorMessage

class Reponse(SQLModel, table=True):
    __tablename__ = "reponse"

    id_reponse: int | None = Field(
        default=None,
        primary_key=True
    )

    contenu: str

    date_envoi: datetime

    id_message: int = Field(
    foreign_key="message.id_message",
    unique=True
)

    id_administrateur: int = Field(
        foreign_key="administrateur.id_administrateur"
    )

    # Relations
    message: "VisitorMessage" = Relationship(
        back_populates="reponse"
    )

    administrateur: "Administrateur" = Relationship(
        back_populates="reponses"
    )