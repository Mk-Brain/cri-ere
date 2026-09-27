from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse
    from backend_cri_ere.models.visitorModel import Visiteur


class StatutMessage(str, Enum):
    NON_LU = "NON_LU"
    LU = "LU"
    REPONDU = "REPONDU"

class VisitorMessage(SQLModel, table=True):
    __tablename__ = "message"

    id_message: int | None = Field(
        default=None,
        primary_key=True
    )

    contenu: str

    date_envoi: datetime

    statut: StatutMessage = Field(
        default=StatutMessage.NON_LU
    )
    id_visiteur: int = Field(
        foreign_key="visiteur.id_visiteur"
    )
    # Relations
    visiteur: "Visiteur" = Relationship(
        back_populates="messages"
    )

    reponse: "Reponse | None" = Relationship(
        back_populates="message"
    )