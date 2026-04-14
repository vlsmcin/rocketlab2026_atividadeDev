from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.cache import produto_query_cache
from app.database import get_db
from app.models.produto import Produto
from app.views.produtos import ProdutoUpdatePayload, ProdutoWriteResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.put("/{id_produto}", response_model=ProdutoWriteResponse)
def update_produto(id_produto: str, payload: ProdutoUpdatePayload, db: Session = Depends(get_db)):
    produto = db.get(Produto, id_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")

    if "nome_produto" in update_data and (
        update_data["nome_produto"] is None or not update_data["nome_produto"].strip()
    ):
        raise HTTPException(status_code=400, detail="Campos texto nao podem ser vazios")

    if "categoria_produto" in update_data and (
        update_data["categoria_produto"] is None or not update_data["categoria_produto"].strip()
    ):
        raise HTTPException(status_code=400, detail="Campos texto nao podem ser vazios")

    for field, value in update_data.items():
        setattr(produto, field, value)

    db.commit()
    db.refresh(produto)
    produto_query_cache.clear()

    return ProdutoWriteResponse(
        id_produto=produto.id_produto,
        nome_produto=produto.nome_produto,
        categoria_produto=produto.categoria_produto,
        peso_produto_gramas=produto.peso_produto_gramas,
        comprimento_centimetros=produto.comprimento_centimetros,
        largura_centimetros=produto.largura_centimetros,
        altura_centimetros=produto.altura_centimetros,
    )