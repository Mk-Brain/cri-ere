import json
from typing import Any

from fastapi import HTTPException, status
"""function de décodage des paramettre json de tri et de filtres envoyé par le frontend"""
def _decode_query_model(value: str | None, default: Any) -> Any:
    if value is None:
        return default
    try:
        return json.loads(value)
    except json.JSONDecodeError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paramètre de tri ou de filtre invalide",
        ) from error