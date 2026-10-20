from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse
    from backend_cri_ere.models.visitorModel import Visiteur


class StatutMessage(str, Enum):
    NON_LU = "NON_LU"
    LU = "LU"
    REPONDU = "REPONDU"


class VisitorMessageBase(SQLModel):
    contenu: str
    date_envoi: datetime
    statut: StatutMessage = Field(
            default=StatutMessage.NON_LU
        )


class VisitorMessagePublic(VisitorMessageBase):
    id_message: int
    visiteur: Any
    reponse: Any

class VisitorMessageCreate(VisitorMessageBase):
    id_visiteur: int    

class VisitorMessage(VisitorMessageBase, table=True):
    __tablename__: str = "messages"

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
        foreign_key="visiteurs.id_visiteur"
    )
    # Relations
    visiteur: "Visiteur" = Relationship(
        back_populates="messages"
    )

    reponse: "Reponse | None" = Relationship(
        back_populates="messages"
    )