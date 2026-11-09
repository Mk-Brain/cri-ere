
from sqlmodel import Relationship, SQLModel, Field
from datetime import UTC, datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from backend_cri_ere.models.reponseModel import ReponsePublic
from backend_cri_ere.models.visitorModel import Visiteur, VisiteurPublic

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse

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
    nom: str | None = None
    email: str = Field(max_length=254)
    visiteur: VisiteurPublic | None = None
    reponse: ReponsePublic | None = None

class VisitorMessageCreate(VisitorMessageBase):
    id_visiteur: int
    nom: str | None = None
    email: str | None = None

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
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )

    statut: StatutMessage = Field(
        default=StatutMessage.NON_LU
    )
    nom: str | None = Field(default=None, max_length=255)
    email: str = Field(max_length=254)
    id_visiteur: int | None = Field(
        default=None,
        foreign_key="visiteurs.id_visiteur",
    )
    # Relations
    visiteur: Optional[Visiteur] = Relationship(
        back_populates="messages"
    )

    # ✅ Correction : Optional["Reponse"] au lieu de "Reponse | None"
    reponse: Optional["Reponse"] = Relationship(
        back_populates="message"
    )