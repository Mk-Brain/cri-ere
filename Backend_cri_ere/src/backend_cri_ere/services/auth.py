from backend_cri_ere.crud.database import db_session
from backend_cri_ere.models.adminModel import Administrateur
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError

# Utilisation du schéma Bearer Token de FastAPI
security = HTTPBearer()

# 2. Créez une dépendance pour vérifier le jeton Firebase
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
    except FirebaseError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Jeton d'authentification invalide ou expiré : {error}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    with db_session() as session:
        user_info = session.get(Administrateur, decoded_token["uid"])
    if user_info is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiant de l’administrateur invalide.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_info
