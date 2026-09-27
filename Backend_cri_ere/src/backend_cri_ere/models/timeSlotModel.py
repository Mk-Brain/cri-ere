from sqlmodel import Relationship, SQLModel, Field
from datetime import time
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.visitModel import Visite


class CreneauHoraire(SQLModel, table=True):
    __tablename__ = "creneau_horaire"

    id_creneau: int | None = Field(
        default=None,
        primary_key=True
    )

    heure_debut: time
    heure_fin: time

    # Relations
    visites: list["Visite"] = Relationship(
        back_populates="creneau"
    )