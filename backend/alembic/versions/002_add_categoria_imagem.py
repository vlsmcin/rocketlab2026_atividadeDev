"""add_categoria_imagem

Revision ID: c6b8e09c4498
Revises: 001
Create Date: 2026-04-11 13:03:21.964816

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c6b8e09c4498'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "categoria_imagens",
        sa.Column("categoria_produto", sa.String(100), primary_key=True),
        sa.Column("url_imagem", sa.String(255), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("categoria_imagens")

