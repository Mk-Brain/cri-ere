from sqlmodel import Relationship, SQLModel, Field
from datetime import date
from enum import Enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend_cri_ere.models.courseModel import Parcours
    from backend_cri_ere.models.guideModel import Guide
    from backend_cri_ere.models.timeSlotModel import CreneauHoraire
    from backend_cri_ere.models.visitorModel import Visiteur


class StatutVisite(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    EFFECTUEE = "EFFECTUEE"
    NON_EFFECTUEE = "NON_EFFECTUEE"

class Visite(SQLModel, table=True):
    __tablename__ = "visite"

    id_visite: int | None = Field(
        default=None,
        primary_key=True
    )

    date_visite: date

    statut: StatutVisite = Field(
        default=StatutVisite.EN_ATTENTE
    )

    nombre_personnes: int

    # Clés étrangères
    id_visiteur: int = Field(
        foreign_key="visiteur.id_visiteur"
    )

    id_parcours: int = Field(
        foreign_key="parcours.id_parcours"
    )

    id_creneau: int = Field(
        foreign_key="creneau_horaire.id_creneau"
    )

    id_guide: int = Field(
        foreign_key="guide.id_guide"
    )

    # Relations
    visiteur: "Visiteur" = Relationship(
        back_populates="visites"
    )

    parcours: "Parcours" = Relationship(
        back_populates="visites"
    )

    creneau: "CreneauHoraire" = Relationship(
        back_populates="visites"
    )

    guide: "Guide" = Relationship(
        back_populates="visites"
    )