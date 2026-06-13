"""Journal routes — log and read food-swap entries. Login required."""

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.journal import Journal
from app.models.user import User
from app.schemas.journal import JournalCreate, JournalRead
from app.services.streak_engine import update_streak_on_log
from app.users import current_active_user

router = APIRouter(prefix="/journal", tags=["journal"])


@router.post("", response_model=JournalRead, status_code=status.HTTP_201_CREATED)
async def create_entry(
    payload: JournalCreate,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Journal:
    entry = Journal(
        user_id=user.id,
        craving=payload.craving,
        swap_taken=payload.swap_taken,
        mood=payload.mood,
    )
    db.add(entry)
    # Update the streak in the same transaction so they can't disagree.
    await update_streak_on_log(db, user.id)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("", response_model=list[JournalRead])
async def list_entries(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> list[Journal]:
    result = await db.execute(
        select(Journal)
        .where(Journal.user_id == user.id)
        .order_by(Journal.created_at.desc())
    )
    return list(result.scalars().all())
