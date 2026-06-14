"""Streak route — GET /streak. Login required."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.user import User
from schemas.streak import StreakRead
from services.streak_engine import get_streak
from users import current_active_user

router = APIRouter(prefix="/streak", tags=["streak"])


@router.get("", response_model=StreakRead)
async def read_streak(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> StreakRead:
    return await get_streak(db, user.id)
