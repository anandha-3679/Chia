"""Streak route — GET /streak. Login required."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.schemas.streak import StreakRead
from app.services.streak_engine import get_streak
from app.users import current_active_user

router = APIRouter(prefix="/streak", tags=["streak"])


@router.get("", response_model=StreakRead)
async def read_streak(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StreakRead:
    return await get_streak(db, user.id)
