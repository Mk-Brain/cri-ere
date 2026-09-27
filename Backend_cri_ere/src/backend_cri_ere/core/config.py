from pathlib import Path
from typing import List
from pydantic import AnyHttpUrl, MySQLDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend CRI ERE"
    
    # 1. Gestion des origines CORS (Listes)
    # Pydantic parse automatiquement les chaînes JSON ou séparées par des virgules
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:5173",
    ]

    # 2. Paramètres individuels de la base de données
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str
    DB_NAME: str

    # 3. Propriété calculée pour fabriquer l'URL de BDD SQLAlchemy dynamiquement
    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()