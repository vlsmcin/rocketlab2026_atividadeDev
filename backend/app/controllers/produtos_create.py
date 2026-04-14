from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4

from app.database import get_db
from app.models.produto import Produto
from app.views.produtos import ProdutoWritePayload, ProdutoWriteResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.post("", response_model=ProdutoWriteResponse, status_code=status.HTTP_201_CREATED)
def create_produto(payload: ProdutoWritePayload, db: Session = Depends(get_db)):
    if not payload.nome_produto.strip() or not payload.categoria_produto.strip():
        raise HTTPException(status_code=400, detail="Campos obrigatorios nao podem ser vazios")

    id_produto = uuid4().hex

    while db.get(Produto, id_produto) is not None:
        id_produto = uuid4().hex

    produto = Produto(id_produto=id_produto, **payload.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)

    return ProdutoWriteResponse(
        id_produto=produto.id_produto,
        nome_produto=produto.nome_produto,
        categoria_produto=produto.categoria_produto,
        peso_produto_gramas=produto.peso_produto_gramas,
        comprimento_centimetros=produto.comprimento_centimetros,
        largura_centimetros=produto.largura_centimetros,
        altura_centimetros=produto.altura_centimetros,
    )