"""Schemas for the swap engine — request in, structured AI response out."""

from pydantic import BaseModel, Field


class SwapRequest(BaseModel):
    craving: str = Field(..., min_length=1, max_length=255, examples=["chips"])


class SwapResponse(BaseModel):
    """Structured output the LLM is forced to return."""

    swap: str = Field(..., description="The single best healthier alternative food.")
    reason: str = Field(
        ...,
        description="One short phrase (~10-12 words) on why it's a good swap.",
    )
    alternatives: list[str] = Field(
        ...,
        description="2-3 other healthier options (names only).",
    )
