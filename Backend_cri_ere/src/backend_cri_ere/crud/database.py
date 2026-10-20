from contextlib import contextmanager
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session
from backend_cri_ere.core.config import settings


db_url = settings.SQLALCHEMY_DATABASE_URI

engine = create_engine(db_url, pool_pre_ping=True)


@contextmanager
def db_session():
    session = Session(engine,)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()