"""Insights route — GET /insights/weekly. Login required."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.user import User
from schemas.insights import WeeklyInsights
from services.insights_engine import get_weekly_insights
from users import current_active_user

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/weekly", response_model=WeeklyInsights)
async def weekly_insights(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> WeeklyInsights:
    return await get_weekly_insights(db, user.id)
