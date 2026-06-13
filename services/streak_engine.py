"""Streak logic — update on journal log, and read with an 'is it alive?' check.

'Today' is computed in UTC for the MVP (day rolls over at UTC midnight).
"""

import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.streak import Streak
from app.schemas.streak import StreakRead


def _today() -> date:
    return datetime.now(timezone.utc).date()


async def update_streak_on_log(db: AsyncSession, user_id: uuid.UUID) -> Streak:
    """Call after a journal entry is created. Advances or resets the streak.

    Does NOT commit — the caller commits (so it's atomic with the journal write).
    """
    today = _today()
    streak = await db.get(Streak, user_id)

    if streak is None:
        streak = Streak(
            user_id=user_id, current_streak=1, best_streak=1, last_active_date=today
        )
        db.add(streak)
        return streak

    if streak.last_active_date == today:
        return streak  # already logged today — no change

    if streak.last_active_date == today - timedelta(days=1):
        streak.current_streak += 1  # consecutive day
    else:
        streak.current_streak = 1  # gap → streak broken, restart

    streak.best_streak = max(streak.best_streak, streak.current_streak)
    streak.last_active_date = today
    return streak


async def get_streak(db: AsyncSession, user_id: uuid.UUID) -> StreakRead:
    """Read the streak, treating it as broken if no log today or yesterday."""
    today = _today()
    streak = await db.get(Streak, user_id)

    if streak is None or streak.last_active_date is None:
        return StreakRead(current_streak=0, best_streak=0)

    alive = streak.last_active_date in (today, today - timedelta(days=1))
    current = streak.current_streak if alive else 0
    return StreakRead(current_streak=current, best_streak=streak.best_streak)
