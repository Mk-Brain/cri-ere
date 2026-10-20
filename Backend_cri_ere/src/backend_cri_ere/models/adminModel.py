from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.reponseModel import Reponse


class AdminBase(SQLModel):
    nom: str
    prenom: str | None = None
    email: str = Field(unique=True, nullable=False)

class AdminPublic(AdminBase):
    id_administrateur : int

class AdminCreate(AdminBase):
    password: str

class Administrateur(AdminBase, table=True):
    __tablename__: str = "administrateurs"

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
        back_populates="administrateurs"
    )