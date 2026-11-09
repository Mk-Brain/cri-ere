from typing import Any

from backend_cri_ere.crud.database import db_session
from backend_cri_ere.models.messageModel import VisitorMessage
from backend_cri_ere.models.visitorModel import Visiteur
from fastapi import APIRouter, HTTPException, status
from pydantic import AliasChoices, BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

router = APIRouter(prefix="/api/contact", tags=["contact"])


class PublicContactInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nom: str = Field(min_length=1, max_length=255)
    email: EmailStr = Field(max_length=254)
    contenu: str = Field(
        min_length=1,
        max_length=10000,
        validation_alias=AliasChoices("contenu", "message"),
    )

    @field_validator("nom", "contenu")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Ce champ ne peut pas être vide.")
        return value

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value


@router.post("", status_code=status.HTTP_201_CREATED)
def create_contact_message(
    contact: PublicContactInput,
) -> dict[str, Any]:
    """Enregistre le message et le rattache au visiteur si son e-mail est connu."""
    try:
        with db_session() as session:
            visiteur = session.exec(
                select(Visiteur).where(Visiteur.email.ilike(contact.email))
            ).first()
            message = VisitorMessage(
                nom=contact.nom,
                email=contact.email,
                contenu=contact.contenu,
                id_visiteur=visiteur.id_visiteur if visiteur is not None else None,
            )
            session.add(message)
            session.flush()

            return {
                "message": "Le message a été envoyé avec succès.",
            }
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Le message n'a pas pu être enregistré.",
        ) from error
