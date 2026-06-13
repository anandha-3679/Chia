"""Schema for the streak response."""

from pydantic import BaseModel


class StreakRead(BaseModel):
    current_streak: int
    best_streak: int
