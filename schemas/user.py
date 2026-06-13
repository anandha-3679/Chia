"""Pydantic schemas for user read / create / update (FastAPI Users).

Profile fields are included here. goal / diet_type use Enums so the API only
accepts valid values.
"""

import uuid
from enum import Enum
from typing import Optional

from fastapi_users import schemas


class Goal(str, Enum):
    lose_weight = "lose_weight"
    healthy_eating = "healthy_eating"


class DietType(str, Enum):
    veg = "veg"
    non_veg = "non_veg"
    vegan = "vegan"


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Returned to clients — never includes the password."""

    name: Optional[str] = None
    goal: Optional[Goal] = None
    diet_type: Optional[DietType] = None
    reminder_time: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    """Signup payload — email + password (name optional at signup)."""

    name: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    """Update payload — all fields optional (used by PATCH /users/me)."""

    name: Optional[str] = None
    goal: Optional[Goal] = None
    diet_type: Optional[DietType] = None
    reminder_time: Optional[str] = None
