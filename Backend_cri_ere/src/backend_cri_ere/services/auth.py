from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


security = HTTPBearer()

# 2. La fonction de dépendance pour sécuriser vos routes
def get_current_user(cred: HTTPAuthorizationCredentials = Depends(security)):
    token = cred.credentials
    try:
        # Le SDK Firebase vérifie la signature et la validité du jeton
        decoded_token = auth.verify_id_token(token)
        # Si le token est valide, on récupère le dictionnaire contenant les infos de l'utilisateur
        return decoded_token
    except Exception:
        # Si le token est expiré, falsifié ou manquant
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Jeton d'authentification invalide ou expiré",
        )