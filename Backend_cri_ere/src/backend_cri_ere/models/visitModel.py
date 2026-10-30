from backend_cri_ere.models.courseModel import ParcoursPublic
from backend_cri_ere.models.guideModel import GuidePublic
from backend_cri_ere.models.timeSlotModel import CreneauHorairePublic
from backend_cri_ere.models.visitorModel import VisiteurPublic
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
class VisiteBase(SQLModel):
    date_visite: date
    statut: StatutVisite = Field(
        default=StatutVisite.EN_ATTENTE
    )
    nombre_personnes: int
    

#modele de visite retourner par l'api
class VisitePublic(VisiteBase):
    id_visite: int
    id_visiteur: int
    id_parcours: int
    id_creneau: int
    id_guide: int    
    visiteur: "VisiteurPublic"
    parcours: "ParcoursPublic"
    creneau: "CreneauHorairePublic"
    guide: "GuidePublic"

#model de visite pour la creation d'une nouvelle visite
class VisteCreate(VisiteBase):
    id_visiteur: int
    id_parcours: int
    id_creneau: int
    id_guide: int

#model de visite pour la mise à jour d'une  visite
class VisteUpdate(VisiteBase):
    date_visite: date | None = None
    statut: StatutVisite | None = None
    nombre_personnes: int | None = None
    id_visiteur: int | None = None
    id_parcours: int | None = None
    id_creneau: int | None = None
    id_guide: int | None = None


#model de table visites
class Visite(VisiteBase, table=True):
    __tablename__: str = "visites"

    id_visite: int | None = Field(
        default=None,
        primary_key=True
    )

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