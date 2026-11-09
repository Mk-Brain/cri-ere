"""Store contact identity on messages and make visitor links optional.

Revision ID: 6af5432b9c01
Revises: 2ca38384e5c4
Create Date: 2026-11-03
"""
from typing import Sequence, Union

from alembic import context, op
import sqlalchemy as sa

revision: str = "6af5432b9c01"
down_revision: Union[str, Sequence[str], None] = "2ca38384e5c4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("messages", sa.Column("nom", sa.String(length=255), nullable=True))
    op.add_column("messages", sa.Column("email", sa.String(length=254), nullable=True))
    op.execute(
        sa.text(
            """
            UPDATE messages
            SET nom = (
                SELECT visiteurs.nom
                FROM visiteurs
                WHERE visiteurs.id_visiteur = messages.id_visiteur
            ),
            email = (
                SELECT visiteurs.email
                FROM visiteurs
                WHERE visiteurs.id_visiteur = messages.id_visiteur
            )
            """
        )
    )
    op.alter_column(
        "messages",
        "email",
        existing_type=sa.String(length=254),
        nullable=False,
    )
    op.alter_column(
        "messages",
        "id_visiteur",
        existing_type=sa.Integer(),
        existing_nullable=False,
        nullable=True,
    )


def downgrade() -> None:
    if not context.is_offline_mode():
        orphan_count = op.get_bind().execute(
            sa.text("SELECT COUNT(*) FROM messages WHERE id_visiteur IS NULL")
        ).scalar_one()
        if orphan_count:
            raise RuntimeError(
                "Cannot downgrade while messages without a visitor exist; "
                "link or remove them first."
            )
    op.alter_column(
        "messages",
        "id_visiteur",
        existing_type=sa.Integer(),
        existing_nullable=True,
        nullable=False,
    )
    op.drop_column("messages", "email")
    op.drop_column("messages", "nom")
