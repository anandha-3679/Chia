"""User ORM model — backed by FastAPI Users' UUID base table, plus profile fields.

Base table provides: id (UUID), email, hashed_password,
is_active, is_superuser, is_verified.

Profile fields (added in the Profile module): name, goal, diet_type.
goal / diet_type are stored as plain strings; the allowed values are validated
at the API layer via Enums in app/schemas/user.py.
"""

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    goal: Mapped[str | None] = mapped_column(String(50), nullable=True)
    diet_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
