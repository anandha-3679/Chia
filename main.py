"""Chia API — application entry point."""

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import auth
from app.api import insights as insights_api
from app.api import journal as journal_api
from app.api import streak as streak_api
from app.api import swap as swap_api
from app.core.config import settings
from app.core.database import get_db

# Schema is managed by Alembic migrations (`alembic upgrade head`), not create_all.

app = FastAPI(title=settings.app_name, version=settings.app_version)

# Allow the Next.js frontend (localhost:3000) to call the API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(swap_api.router)
app.include_router(journal_api.router)
app.include_router(streak_api.router)
app.include_router(insights_api.router)


@app.get("/health", tags=["health"])
async def health() -> dict:
    """Liveness check — confirms the API is running."""
    return {"status": "ok"}


@app.get("/health/db", tags=["health"])
async def health_db(db: AsyncSession = Depends(get_db)) -> dict:
    """Readiness check — confirms the database connection works."""
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
