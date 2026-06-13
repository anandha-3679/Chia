"""Schemas for journal entries (create + read)."""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class JournalCreate(BaseModel):
    craving: str = Field(..., min_length=1, max_length=255)
    swap_taken: str = Field(..., min_length=1, max_length=255)
    mood: Optional[str] = Field(
        None,
        max_length=20,
        description="Optional mood — an emoji or mood key chosen on the frontend.",
    )


class JournalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    craving: str
    swap_taken: str
    mood: Optional[str] = None
    created_at: datetime
