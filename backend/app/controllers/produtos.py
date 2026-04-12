from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.categoria_imagem import CategoriaImagem
from app.models.item_pedido import ItemPedido
from app.models.produto import Produto
from app.views.produtos import ProdutoListView

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("")
def get_produtos(
    title: str | None = None,
    categoria: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    filtros = []

    if title:
        filtros.append(Produto.nome_produto.ilike(f"%{title}%"))

    if categoria:
        filtros.append(Produto.categoria_produto.ilike(f"%{categoria}%"))

    query = (
        select(
            Produto.id_produto,
            Produto.nome_produto,
            Produto.categoria_produto,
            CategoriaImagem.url_imagem,
            func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacao"),
            func.count(AvaliacaoPedido.id_avaliacao).label("quantidade_avaliacoes"),
        )
        .outerjoin(
            CategoriaImagem,
            Produto.categoria_produto == CategoriaImagem.categoria_produto,
        )
        .outerjoin(ItemPedido, Produto.id_produto == ItemPedido.id_produto)
        .outerjoin(AvaliacaoPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .where(*filtros)
        .group_by(
            Produto.id_produto,
            Produto.nome_produto,
            Produto.categoria_produto,
            CategoriaImagem.url_imagem,
        )
        .offset(offset)
        .limit(limit)
    )
    produtos = db.execute(query).all()

    return [
        ProdutoListView(
            id_produto = id_produto,
            nome_produto = nome_produto,
            categoria_produto = categoria_produto,
            url_imagem = url_imagem,
            media_avaliacao = round(media_avaliacao, 2) if media_avaliacao is not None else None,
            quantidade_avaliacoes = quantidade_avaliacoes
        )
        for id_produto, nome_produto, categoria_produto, url_imagem, media_avaliacao, quantidade_avaliacoes in produtos
    ]
