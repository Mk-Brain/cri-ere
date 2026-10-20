from sqlmodel import Relationship, SQLModel, Field

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite


class GuideBase(SQLModel):
    nom: str
    prenom: str | None = None
    telephone: str = Field(unique=True)

class GuidePublic(GuideBase):
    id_guide: int
    visites: Any

class GuideCreate(GuideBase):
    pass

class Guide(GuideBase, table=True):
    __tablename__: str = "guides"

    id_guide: int | None = Field(
        default=None,
        primary_key=True
    )

    nom: str
    prenom: str | None = None
    telephone: str = Field(unique=True)

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="guides"
    )