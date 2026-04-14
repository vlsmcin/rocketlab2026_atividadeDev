from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.cache import produto_query_cache
from app.database import get_db
from app.models.item_pedido import ItemPedido
from app.models.produto import Produto

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.delete("/{id_produto}", status_code=status.HTTP_204_NO_CONTENT)
def delete_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.get(Produto, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    # Remove referencias diretas ao produto antes da exclusao do registro principal.
    db.execute(delete(ItemPedido).where(ItemPedido.id_produto == id_produto))
    db.delete(produto)
    db.commit()
    produto_query_cache.clear()