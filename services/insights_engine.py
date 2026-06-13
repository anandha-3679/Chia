"""Weekly insights — deterministic stats from the journal + AI-written text.

Stats cover the last 7 rolling days (UTC). Only the summary/tip are AI-generated;
all numbers are computed in SQL so they're always accurate.
"""

import uuid
from datetime import datetime, timedelta, timezone

from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.output import PromptedOutput
from pydantic_ai.providers.groq import GroqProvider
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.journal import Journal
from app.schemas.insights import InsightsText, WeeklyInsights

# --- AI agent for the friendly summary + tip ---
_model = GroqModel(
    settings.groq_model,
    provider=GroqProvider(api_key=settings.groq_api_key),
)

INSIGHTS_PROMPT = """\
You are Chia, an encouraging nutrition coach writing a short weekly recap.

Given the user's week of healthier-food-swap activity, produce:
- summary: ONE upbeat, specific sentence celebrating their week. Reference the
  numbers naturally (don't just restate them).
- improvement_tip: ONE short, actionable, kind tip to do better next week.

Be motivating and concise. Make no medical claims.
"""

insights_agent = Agent(
    _model,
    output_type=PromptedOutput(InsightsText),
    system_prompt=INSIGHTS_PROMPT,
    retries=2,
)


async def _generate_text(
    total_swaps: int, top_craving: str | None, active_days: int
) -> InsightsText:
    prompt = (
        f"Swaps logged this week: {total_swaps}\n"
        f"Active days: {active_days} out of 7\n"
        f"Most common craving: {top_craving or 'none'}\n"
        "Write the weekly summary and improvement tip."
    )
    result = await insights_agent.run(prompt)
    return result.output


async def get_weekly_insights(db: AsyncSession, user_id: uuid.UUID) -> WeeklyInsights:
    since = datetime.now(timezone.utc) - timedelta(days=7)
    base = (Journal.user_id == user_id, Journal.created_at >= since)

    # total entries + distinct active days (UTC) in one query
    totals = select(
        func.count(Journal.id),
        func.count(func.distinct(func.date(func.timezone("UTC", Journal.created_at)))),
    ).where(*base)
    total_swaps, active_days = (await db.execute(totals)).one()

    if total_swaps == 0:
        return WeeklyInsights(
            summary="No logs yet this week — log your first swap to get started!",
            total_swaps=0,
            top_craving=None,
            active_days=0,
            improvement_tip="Try logging one food swap today to kick off a streak.",
        )

    # most common craving this week
    top = (
        select(Journal.craving)
        .where(*base)
        .group_by(Journal.craving)
        .order_by(func.count(Journal.id).desc())
        .limit(1)
    )
    top_craving = (await db.execute(top)).scalar_one_or_none()

    text = await _generate_text(total_swaps, top_craving, active_days)
    return WeeklyInsights(
        summary=text.summary,
        total_swaps=total_swaps,
        top_craving=top_craving,
        active_days=active_days,
        improvement_tip=text.improvement_tip,
    )
