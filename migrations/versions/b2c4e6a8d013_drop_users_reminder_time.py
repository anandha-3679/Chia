"""drop users.reminder_time

Revision ID: b2c4e6a8d013
Revises: 5f7e2d8a3910
Create Date: 2026-06-14 09:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c4e6a8d013'
down_revision: Union[str, Sequence[str], None] = '5f7e2d8a3910'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop the reminder_time column.

    Uses IF EXISTS because the column may already have been dropped manually
    in the dev database; this keeps `alembic upgrade head` idempotent.
    """
    op.execute('ALTER TABLE users DROP COLUMN IF EXISTS reminder_time')


def downgrade() -> None:
    """Recreate the reminder_time column."""
    op.add_column(
        'users',
        sa.Column('reminder_time', sa.String(length=5), nullable=True),
    )
