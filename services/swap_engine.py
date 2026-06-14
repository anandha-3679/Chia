"""Swap engine — a PydanticAI agent running on Groq (Llama 3.1 8B Instant).

The agent is forced to return a `SwapResponse` (structured output), so the API
never has to parse free-form text. Personalization (diet + goal) is injected
into the user prompt at call time.
"""

from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.output import PromptedOutput
from pydantic_ai.providers.groq import GroqProvider

from core.config import settings
from schemas.swap import SwapResponse

SYSTEM_PROMPT = """\
You are Chia, a practical and friendly nutrition coach.

When the user names a food they're craving, suggest ONE healthier alternative
that satisfies the SAME craving — keep the same kind of satisfaction (crunch,
sweetness, creaminess, savouriness).

Rules:
- The swap must be a real, widely available food and genuinely healthier than
  the craving (less oil, added sugar, refined carbs, or calories).
- "reason" is ONE short phrase, max ~12 words, on why it's a good swap.
- "alternatives" is 2-3 other healthier options, names only.
- Respect the user's dietary preference STRICTLY:
    * vegetarian (veg) -> never suggest meat or fish.
    * vegan -> never suggest any animal product (meat, fish, dairy, eggs, honey).
    * non-veg -> anything is fine.
- Tailor to the user's goal when given (e.g. lower-calorie for weight loss).
- If the craving is already healthy, affirm it briefly and still offer a
  complementary healthy option.
- If the input is not a food, gently say so in "swap" and give general healthy
  snack alternatives.

Be concise and realistic. Make no medical claims.
"""

_model = GroqModel(
    settings.groq_model,
    provider=GroqProvider(api_key=settings.groq_api_key),
)

# PromptedOutput (plain JSON) instead of tool-calling: the 8B model is far more
# reliable returning JSON text than emitting well-formed tool calls.
swap_agent = Agent(
    _model,
    output_type=PromptedOutput(SwapResponse),
    system_prompt=SYSTEM_PROMPT,
    retries=2,  # retry output validation up to 2x if the model returns bad JSON
)


async def generate_swap(
    craving: str,
    diet_type: str | None,
    goal: str | None,
) -> SwapResponse:
    """Ask the agent for a personalized healthier swap."""
    user_prompt = (
        f"Craving: {craving}\n"
        f"Dietary preference: {diet_type or 'no preference given'}\n"
        f"Goal: {goal or 'general healthy eating'}\n"
        f"Suggest the best healthier swap."
    )
    result = await swap_agent.run(user_prompt)
    return result.output
