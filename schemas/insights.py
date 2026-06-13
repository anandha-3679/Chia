"""Schemas for weekly insights."""

from typing import Optional

from pydantic import BaseModel, Field


class InsightsText(BaseModel):
    """AI-generated portion (structured output from Groq)."""

    summary: str = Field(..., description="One upbeat sentence summarizing the week.")
    improvement_tip: str = Field(
        ..., description="One short, actionable tip for next week."
    )


class WeeklyInsights(BaseModel):
    summary: str
    total_swaps: int
    top_craving: Optional[str] = None
    active_days: int  # distinct days logged this week (out of 7)
    improvement_tip: str
