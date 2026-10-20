from typing import Generic, Sequence, Type, TypeVar

from sqlmodel import SQLModel, Session, select


ModelType = TypeVar("ModelType", bound=SQLModel)

class Repository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, session: Session, id: int) -> ModelType | None:
        return session.get(self.model, id)

    def create(self, session: Session, obj_in: ModelType) -> ModelType:
        session.add(obj_in)
        session.flush()
        return obj_in

    def update(self, session: Session, db_obj: ModelType, obj_in: ModelType) -> ModelType:
        for k, v in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, k, v)
        session.flush()
        return db_obj

    def delete(self, session: Session, id: int) -> bool:
        obj = self.get(session, id)
        if obj:
            session.delete(obj)
            session.flush()
            return True
        return False

    def list(self, session: Session) -> Sequence[ModelType]:
        req = select(self.model)
        return session.exec(req).all()