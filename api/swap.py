"""Swap route — POST /swap. Login required.

Generates a personalized healthier alternative, logs it, and returns it.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.swap import Swap
from models.user import User
from schemas.swap import SwapRequest, SwapResponse
from services.swap_engine import generate_swap
from users import current_active_user

router = APIRouter(prefix="/swap", tags=["swap"])


@router.post("", response_model=SwapResponse)
async def create_swap(
    payload: SwapRequest,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
) -> SwapResponse:
    # 1. Ask the AI for a swap personalized to this user's profile.
    result = await generate_swap(payload.craving, user.diet_type, user.goal)

    # 2. Log the suggestion for later insights.
    db.add(
        Swap(
            user_id=user.id,
            craving=payload.craving,
            swap_suggested=result.swap,
            reason=result.reason,
        )
    )
    await db.commit()

    # 3. Return the structured suggestion.
    return result
