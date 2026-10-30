
from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any, Optional

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse
    from backend_cri_ere.models.visitorModel import Visiteur
    from backend_cri_ere.models.reponseModel import ReponsePublic
    from backend_cri_ere.models.visitorModel import VisiteurPublic

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
    visiteur: "VisiteurPublic"
    reponse: "ReponsePublic"

class VisitorMessageCreate(VisitorMessageBase):
    id_visiteur: int

class VisitorMessageUpdate(VisitorMessageBase):
    pass
    

class VisitorMessage(VisitorMessageBase, table=True):
    __tablename__: str = "messages"

    id_message: int | None = Field(
        default=None,
        primary_key=True
    )

    contenu: str

    date_envoi: datetime = Field(
        default=datetime.utcnow
    )

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

    # ✅ Correction : Optional["Reponse"] au lieu de "Reponse | None"
    reponse: Optional["Reponse"] = Relationship(
        back_populates="message"
    )