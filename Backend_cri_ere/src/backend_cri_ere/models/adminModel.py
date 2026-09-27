from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse


class Administrateur(SQLModel, table=True):
    __tablename__ = "administrateur"

    id_administrateur: int | None = Field(
        default=None,
        primary_key=True
    )

    nom: str
    prenom: str | None = None
    email: str = Field(unique=True, nullable=False)
    password: str

    # Relations
    reponses: list["Reponse"] = Relationship(
        back_populates="administrateur"
    )