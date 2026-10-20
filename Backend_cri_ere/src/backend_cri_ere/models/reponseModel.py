from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlmodel import Relationship, SQLModel, Field

if TYPE_CHECKING:
    from backend_cri_ere.models.adminModel import Administrateur
    from backend_cri_ere.models.messageModel import VisitorMessage


class ReponseBase(SQLModel):
    contenu: str
    date_envoi: datetime

class ReponsePublic(ReponseBase):
    id_reponse: int
    message: Any
    administrateur: Any

class ReponseCreate(ReponseBase):
    id_message: int
    id_administrateur: int

class Reponse(ReponseBase, table=True):
    __tablename__: str = "reponses"

    id_reponse: int | None = Field(
        default=None,
        primary_key=True
    )

    contenu: str

    date_envoi: datetime

    id_message: int = Field(
    foreign_key="messages.id_message",
    unique=True
)

    id_administrateur: int = Field(
        foreign_key="administrateurs.id_administrateur"
    )

    # Relations
    message: "VisitorMessage" = Relationship(
        back_populates="reponses"
    )

    administrateur: "Administrateur" = Relationship(
        back_populates="reponses"
    )