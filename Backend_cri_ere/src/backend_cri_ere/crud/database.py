from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session
from backend_cri_ere.core.config import settings


db_url = settings.SQLALCHEMY_DATABASE_URI

engine = create_engine(db_url, pool_pre_ping=True)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

