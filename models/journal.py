"""Journal ORM model — a user's food-swap log entries."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Journal(Base):
    __tablename__ = "journal"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    craving: Mapped[str] = mapped_column(String(255))
    swap_taken: Mapped[str] = mapped_column(String(255))
    # mood is an optional string; the frontend decides the value (emoji or key).
    mood: Mapped[str | None] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
