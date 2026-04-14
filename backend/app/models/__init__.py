# Importa todos os models para que o SQLAlchemy e o Alembic os registrem
from app.models.consumidor import Consumidor
from app.models.produto import Produto
from app.models.categoria_imagem import CategoriaImagem
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.user import User

__all__ = [
    "Consumidor",
    "Produto",
    "CategoriaImagem",
    "Vendedor",
    "Pedido",
    "ItemPedido",
    "AvaliacaoPedido",
    "User",
]
