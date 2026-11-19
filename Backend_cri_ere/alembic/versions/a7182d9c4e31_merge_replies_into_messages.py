"""Merge replies into the messages table.

Revision ID: a7182d9c4e31
Revises: 6af5432b9c01
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "a7182d9c4e31"
down_revision: Union[str, Sequence[str], None] = "6af5432b9c01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "messages",
        sa.Column("id_message_parent", sa.Integer(), nullable=True),
    )
    op.add_column(
        "messages",
        sa.Column("id_administrateur", sa.String(length=255), nullable=True),
    )
    op.create_foreign_key(
        "fk_messages_parent",
        "messages",
        "messages",
        ["id_message_parent"],
        ["id_message"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_messages_administrateur",
        "messages",
        "administrateurs",
        ["id_administrateur"],
        ["id_administrateur"],
    )

    op.execute(
        sa.text(
            """
            INSERT INTO messages (
                contenu,
                date_envoi,
                statut,
                nom,
                email,
                id_visiteur,
                id_message_parent,
                id_administrateur
            )
            SELECT
                reponses.contenu,
                reponses.date_envoi,
                'REPONDU',
                administrateurs.nom,
                administrateurs.email,
                messages.id_visiteur,
                reponses.id_message,
                reponses.id_administrateur
            FROM reponses
            JOIN messages ON messages.id_message = reponses.id_message
            JOIN administrateurs
                ON administrateurs.id_administrateur = reponses.id_administrateur
            """
        )
    )
    op.execute(
        sa.text(
            """
            UPDATE messages
            SET statut = 'REPONDU'
            WHERE id_message IN (SELECT id_message FROM reponses)
            """
        )
    )
    op.drop_table("reponses")


def downgrade() -> None:
    connection = op.get_bind()
    duplicate_replies = connection.execute(
        sa.text(
            """
            SELECT id_message_parent
            FROM messages
            WHERE id_message_parent IS NOT NULL
            GROUP BY id_message_parent
            HAVING COUNT(*) > 1
            """
        )
    ).first()
    replies_without_admin = connection.execute(
        sa.text(
            """
            SELECT COUNT(*)
            FROM messages
            WHERE id_message_parent IS NOT NULL
              AND id_administrateur IS NULL
            """
        )
    ).scalar_one()
    if duplicate_replies or replies_without_admin:
        raise RuntimeError(
            "Cannot restore the one-reply table while messages have multiple "
            "replies or replies without an administrator."
        )

    op.create_table(
        "reponses",
        sa.Column("id_reponse", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("contenu", sa.String(), nullable=False),
        sa.Column("date_envoi", sa.DateTime(), nullable=False),
        sa.Column("id_message", sa.Integer(), nullable=False, unique=True),
        sa.Column("id_administrateur", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(
            ["id_message"],
            ["messages.id_message"],
            name="fk_reponses_message",
        ),
        sa.ForeignKeyConstraint(
            ["id_administrateur"],
            ["administrateurs.id_administrateur"],
            name="fk_reponses_administrateur",
        ),
    )
    op.execute(
        sa.text(
            """
            INSERT INTO reponses (contenu, date_envoi, id_message, id_administrateur)
            SELECT contenu, date_envoi, id_message_parent, id_administrateur
            FROM messages
            WHERE id_message_parent IS NOT NULL
            """
        )
    )
    op.execute(
        sa.text("DELETE FROM messages WHERE id_message_parent IS NOT NULL")
    )
    op.drop_constraint("fk_messages_parent", "messages", type_="foreignkey")
    op.drop_constraint(
        "fk_messages_administrateur",
        "messages",
        type_="foreignkey",
    )
    op.drop_column("messages", "id_message_parent")
    op.drop_column("messages", "id_administrateur")
