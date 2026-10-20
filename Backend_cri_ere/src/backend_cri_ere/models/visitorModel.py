from sqlmodel import Relationship, SQLModel, Field
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.messageModel import VisitorMessage
    from backend_cri_ere.models.visitModel import Visite


class VisiteurBase(SQLModel):
    nom: str
    prenom: str | None = None
    email: str = Field(unique=True)
    telephone: str = Field(unique=True)

class VisiteurPublic(VisiteurBase):
    id_visiteur: int
    visites: Any
    messages: Any

class VisiteurCreate(VisiteurBase):
    pass

class Visiteur(VisiteurBase, table=True):
    __tablename__: str = "visiteurs"

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
        back_populates="visiteurs"
    )

    messages: list["VisitorMessage"] = Relationship(
        back_populates="visiteurs"
    )