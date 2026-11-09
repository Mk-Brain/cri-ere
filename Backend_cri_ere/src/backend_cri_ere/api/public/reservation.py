from datetime import date
from html import escape
from typing import Any

from backend_cri_ere.core.config import Settings
from backend_cri_ere.crud.database import db_session
from backend_cri_ere.crud.repo import Repository
from backend_cri_ere.models.courseModel import Parcours
from backend_cri_ere.models.guideModel import Guide
from backend_cri_ere.models.timeSlotModel import CreneauHoraire
from backend_cri_ere.models.visitModel import StatutVisite, Visite
from backend_cri_ere.models.visitorModel import Visiteur
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
import resend
from sqlalchemy import or_, not_
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from pydantic import EmailStr, StringConstraints
from typing import Annotated

router = APIRouter(prefix="/api/reservation", tags=["reservation"])

core_setting = Settings()

resend.api_key = core_setting.RESEND_API_KEY
# Contraintes réutilisables : strip automatique + longueur
RequiredText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=255),
]

OptionalText = Annotated[
    str | None,
    StringConstraints(strip_whitespace=True, max_length=255),
]


class PublicVisitorInput(BaseModel):
    nom: RequiredText
    prenom: OptionalText = None
    email: EmailStr = Field(max_length=254)
    telephone: RequiredText = Field(max_length=50)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("prenom", mode="after")
    @classmethod
    def empty_prenom_to_none(cls, value: str | None) -> str | None:
        # StringConstraints(strip_whitespace=True) a déjà nettoyé ;
        # une chaîne vide devient None.
        return value or None


class PublicVisitInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    date_visite: date
    nombre_personnes: int = Field(ge=1)
    id_parcours: int
    id_creneau: int
    id_guide: int


class PublicReservationInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    visiteur: PublicVisitorInput
    visite: PublicVisitInput




@router.get("/options")
def get_reservation_options(reservationDate: str) -> dict[str, list[dict[str, Any]]]:
    """Retourne les parcours, créneaux et guides disponibles pour le formulaire public."""
    dte = date.fromisoformat(reservationDate)
    with db_session() as session:
        parcours = session.exec(select(Parcours).order_by(Parcours.id_parcours)).all()
        # récupérer les créneaux libres
        creneaux = (
            session.exec(
                select(CreneauHoraire).where(
                    not_(
                        CreneauHoraire.id_creneau.in_(
                            select(Visite.id_creneau).where(
                                Visite.statut == StatutVisite.EN_ATTENTE,
                                Visite.date_visite == dte,
                            )
                        )
                    )
                ).order_by(CreneauHoraire.heure_debut)
                            
            ).all()
            
        )

        guides = (
            session.exec(
                select(Guide).where(
                    not_(
                        Guide.id_guide.in_(
                            select(Visite.id_guide).where(
                                Visite.statut == StatutVisite.EN_ATTENTE,
                                Visite.date_visite == dte,
                            )
                        )
                    )
                ).order_by(Guide.id_guide)
            )
            .all()
        )

        return {
            "parcours": [
                {
                    "id_parcours": item.id_parcours,
                    "nom": item.nom,
                    "description": item.description,
                }
                for item in parcours
            ],
            "creneaux": [
                {
                    "id_creneau": item.id_creneau,
                    "heure_debut": item.heure_debut,
                    "heure_fin": item.heure_fin,
                }
                for item in creneaux
            ],
            "guides": [
                {
                    "id_guide": item.id_guide,
                    "nom": item.nom,
                    "prenom": item.prenom,
                    "telephone": item.telephone,
                }
                for item in guides
            ],
        }



@router.post("/", status_code=status.HTTP_201_CREATED)
def create_public_reservation(
    reservation: PublicReservationInput,
) -> dict[str, Any]:
    """Crée une réservation et réutilise la fiche d'un visiteur déjà connu."""
    if reservation.visite.date_visite < date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="La date de visite ne peut pas être dans le passé.",
        )
# TODO: verrifier la date côte client

    email = reservation.visiteur.email
    telephone = reservation.visiteur.telephone.strip()
    request_data = reservation.visite

    try:
        with db_session() as session:
            parcours = session.get(Parcours, request_data.id_parcours)
            creneau = session.get(CreneauHoraire, request_data.id_creneau)
            guide = session.get(Guide, request_data.id_guide)
            if parcours is None or creneau is None or guide is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Le parcours, le créneau ou le guide sélectionné est introuvable.",
                )

            existing_visitors = session.exec(
                select(Visiteur).where(
                    or_(
                        Visiteur.email.ilike(email),
                        Visiteur.telephone == telephone,
                    )
                )
            ).all()
            if len(existing_visitors) > 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "L'adresse e-mail et le téléphone correspondent à des "
                        "visiteurs différents. Contactez l'équipe pour corriger vos informations."
                    ),
                )

            if existing_visitors:
                visiteur = existing_visitors[0]
                if (
                    visiteur.email.strip().lower() != email
                    or visiteur.telephone.strip() != telephone
                ):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=(
                            "L'adresse e-mail ou le téléphone est déjà associé à "
                            "un autre profil. Vérifiez vos informations."
                        ),
                    )
            else:
                visiteur = Visiteur(
                    nom=reservation.visiteur.nom,
                    prenom=reservation.visiteur.prenom,
                    email=email,
                    telephone=telephone,
                )
                session.add(visiteur)
                session.flush()

            visite = Visite(
                date_visite=request_data.date_visite,
                nombre_personnes=request_data.nombre_personnes,
                id_visiteur=visiteur.id_visiteur,
                id_parcours=request_data.id_parcours,
                id_creneau=request_data.id_creneau,
                id_guide=request_data.id_guide,
            )
            session.add(visite)
            session.flush()

            greeting_name = visiteur.prenom or visiteur.nom
            visitor_name = escape(greeting_name)
            course_name = escape(parcours.nom)
            guide_name = escape(
                f"{guide.prenom} {guide.nom}" if guide.prenom else guide.nom
            )
            visit_date = visite.date_visite.strftime("%d/%m/%Y")
            start_time = creneau.heure_debut.strftime("%H:%M")
            end_time = creneau.heure_fin.strftime("%H:%M")
            people_label = (
                "personne" if visite.nombre_personnes == 1 else "personnes"
            )
            text_body = (
                f"Bonjour {greeting_name},\n\n"
                "Votre demande de réservation au CRI-ERE a bien été enregistrée.\n\n"
                f"Date : {visit_date}\n"
                f"Horaire : {start_time} – {end_time}\n"
                f"Visite : {parcours.nom}\n"
                f"Nombre de visiteurs : {visite.nombre_personnes} {people_label}\n"
                f"Guide : {guide.prenom + ' ' if guide.prenom else ''}{guide.nom}\n\n"
                "Nous vous remercions pour votre intérêt et vous souhaitons une "
                "agréable visite.\n\n"
                "L’équipe du CRI-ERE"
            )
            html_body = (
                f"<p>Bonjour {visitor_name},</p>"
                "<p>Votre demande de réservation au CRI-ERE a bien été enregistrée.</p>"
                "<p><strong>Récapitulatif de votre visite</strong></p>"
                "<ul>"
                f"<li><strong>Date :</strong> {visit_date}</li>"
                f"<li><strong>Horaire :</strong> {start_time} – {end_time}</li>"
                f"<li><strong>Visite :</strong> {course_name}</li>"
                f"<li><strong>Nombre de visiteurs :</strong> "
                f"{visite.nombre_personnes} {people_label}</li>"
                f"<li><strong>Guide :</strong> {guide_name}</li>"
                "</ul>"
                "<p>Nous vous remercions pour votre intérêt et vous souhaitons une "
                "agréable visite.</p>"
                "<p>L’équipe du CRI-ERE</p>"
            )
            params: resend.Emails.SendParams = {
                "from": "CRI-ERE <onboarding@resend.dev>",
                "to": [visiteur.email],
                "subject": "Confirmation de votre demande de visite au CRI-ERE",
                "text": text_body,
                "html": html_body,
            }
            try:
                email: resend.Emails.SendResponse = resend.Emails.send(params=params)
                print(email)
            except Exception as e:
                print(f"Erreur lors de l'envoi de l'email : {e}")

            return {
                "id_visite": visite.id_visite,
                "date_visite": visite.date_visite,
                "statut": visite.statut,
                "nombre_personnes": visite.nombre_personnes,
                "id_visiteur": visite.id_visiteur,
                "id_parcours": visite.id_parcours,
                "id_creneau": visite.id_creneau,
                "id_guide": visite.id_guide,
                "visiteur": {
                    "id_visiteur": visiteur.id_visiteur,
                    "nom": visiteur.nom,
                    "prenom": visiteur.prenom,
                    "email": visiteur.email,
                    "telephone": visiteur.telephone,
                },
            }
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ces coordonnées sont déjà associées à un autre visiteur.",
        ) from error


# TODO: ajouter une table accapagnants pour enregistres les autre personnes de la visite
# TODO: ajouter une tâche d'arrière plan pour changer automatiquement le status des visites non effectuées
# TODO: ajouter un lien securisé pour permettre au visiteur de consulter, modifier ou annuler sa réservation