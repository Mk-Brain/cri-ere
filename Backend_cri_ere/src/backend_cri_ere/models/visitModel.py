from sqlmodel import Relationship, SQLModel, Field
from datetime import date
from enum import Enum
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from backend_cri_ere.models.courseModel import Parcours
    from backend_cri_ere.models.guideModel import Guide
    from backend_cri_ere.models.timeSlotModel import CreneauHoraire
    from backend_cri_ere.models.visitorModel import Visiteur


class StatutVisite(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    EFFECTUEE = "EFFECTUEE"
    NON_EFFECTUEE = "NON_EFFECTUEE"

#model de base
class VisteBase(SQLModel):
    date_visite: date
    statut: StatutVisite = Field(
        default=StatutVisite.EN_ATTENTE
    )
    nombre_personnes: int
    

#modele de visite retourner par l'api
class VistePublic(VisteBase):
    id_visite: int
    visiteur: Any
    parcour: Any
    creneau: Any
    guide: Any

#model de visite pour la creation d'une nouvelle visite
class VisteCreate(VisteBase):
    id_visiteur: int
    id_parcours: int
    id_creneau: int
    id_guide: int


#model de table visites
class Visite(SQLModel, table=True):
    __tablename__: str = "visites"

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
        foreign_key="visiteurs.id_visiteur"
    )

    id_parcours: int = Field(
        foreign_key="parcours.id_parcours"
    )

    id_creneau: int = Field(
        foreign_key="creneaux.id_creneau"
    )

    id_guide: int = Field(
        foreign_key="guides.id_guide"
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