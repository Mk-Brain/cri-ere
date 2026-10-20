from sqlmodel import Relationship, SQLModel, Field
from datetime import time
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite


class CreneauHoraireBase(SQLModel):
    heure_debut: time
    heure_fin: time

class CreneauHorairePublic(CreneauHoraireBase):
    id_creneau: int
    visites: Any

class CreneauHoraireCreate(CreneauHoraireBase):
    pass

class CreneauHoraire(CreneauHoraireBase, table=True):
    __tablename__: str = "creneaux"

    id_creneau: int | None = Field(
        default=None,
        primary_key=True
    )

    heure_debut: time
    heure_fin: time

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="creneaux"
    )