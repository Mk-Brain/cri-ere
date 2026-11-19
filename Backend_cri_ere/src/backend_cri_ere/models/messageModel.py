from datetime import UTC, datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, ForeignKey, Integer
from sqlmodel import Field, Relationship, SQLModel

from backend_cri_ere.models.visitorModel import Visiteur, VisiteurPublic

if TYPE_CHECKING:
    from backend_cri_ere.models.adminModel import Administrateur


class StatutMessage(str, Enum):
    NON_LU = "NON_LU"
    LU = "LU"
    REPONDU = "REPONDU"


class VisitorMessageBase(SQLModel):
    contenu: str
    date_envoi: datetime
    statut: StatutMessage = Field(default=StatutMessage.NON_LU)


class VisitorMessageReplyCreate(SQLModel):
    contenu: str = Field(min_length=1, max_length=10000)


class VisitorMessageReplyPublic(SQLModel):
    id_message: int
    contenu: str
    date_envoi: datetime
    nom: str | None = None
    email: str
    id_administrateur: str | None = None


class VisitorMessagePublic(VisitorMessageBase):
    id_message: int
    nom: str | None = None
    email: str = Field(max_length=254)
    visiteur: VisiteurPublic | None = None
    reponses: list[VisitorMessageReplyPublic] = Field(default_factory=list)


class VisitorMessageCreate(VisitorMessageBase):
    id_visiteur: int
    nom: str | None = None
    email: str | None = None


class VisitorMessageUpdate(VisitorMessageBase):
    pass


class VisitorMessageUpdateStatus(SQLModel):
    status: StatutMessage


class VisitorMessage(VisitorMessageBase, table=True):
    __tablename__: str = "messages"

    id_message: int | None = Field(default=None, primary_key=True)

    contenu: str

    date_envoi: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )

    statut: StatutMessage = Field(default=StatutMessage.NON_LU)
    nom: str | None = Field(default=None, max_length=255)
    email: str = Field(max_length=254)
    id_visiteur: int | None = Field(
        sa_column=Column(
            Integer,
            ForeignKey("visiteurs.id_visiteur", ondelete="CASCADE"),
            nullable=True,
        )
    )
    id_message_parent: int | None = Field(
        default=None,
        sa_column=Column(
            Integer,
            ForeignKey("messages.id_message", ondelete="CASCADE"),
            nullable=True,
        ),
    )
    id_administrateur: str | None = Field(
        default=None,
        foreign_key="administrateurs.id_administrateur",
    )

    # Relations
    visiteur: Optional[Visiteur] = Relationship(back_populates="messages")
    message_parent: Optional["VisitorMessage"] = Relationship(
        back_populates="reponses",
        sa_relationship_kwargs={
            "remote_side": "VisitorMessage.id_message",
            "foreign_keys": "VisitorMessage.id_message_parent",
        },
    )
    reponses: list["VisitorMessage"] = Relationship(
        back_populates="message_parent",
        sa_relationship_kwargs={
            "foreign_keys": "VisitorMessage.id_message_parent",
            "cascade": "all, delete-orphan",
            "passive_deletes": True,
            "order_by": "VisitorMessage.date_envoi",
        },
    )
    administrateur: Optional["Administrateur"] = Relationship(back_populates="messages")
