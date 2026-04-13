from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.categoria_imagem import CategoriaImagem
from app.models.consumidor import Consumidor
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.views.produtos import AvaliacaoView, ProdutoDetailView, ProdutoListView, VendedorView

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

    produtos_base = (
        select(
            Produto.id_produto,
            Produto.nome_produto,
            Produto.categoria_produto,
        )
        .where(*filtros)
        .subquery()
    )

    query = (
        select(
            produtos_base.c.id_produto,
            produtos_base.c.nome_produto,
            produtos_base.c.categoria_produto,
            CategoriaImagem.url_imagem,
            func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacao"),
            func.count(AvaliacaoPedido.id_avaliacao).label("quantidade_avaliacoes"),
        )
        .select_from(produtos_base)
        .outerjoin(
            CategoriaImagem,
            produtos_base.c.categoria_produto == CategoriaImagem.categoria_produto,
        )
        .outerjoin(ItemPedido, produtos_base.c.id_produto == ItemPedido.id_produto)
        .outerjoin(AvaliacaoPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .group_by(
            produtos_base.c.id_produto,
            produtos_base.c.nome_produto,
            produtos_base.c.categoria_produto,
            CategoriaImagem.url_imagem,
        )
        .offset(offset)
        .limit(limit)
    )
    produtos = db.execute(query).all()

    return [
        ProdutoListView(
            id_produto=id_produto,
            nome_produto=nome_produto,
            categoria_produto=categoria_produto,
            url_imagem=url_imagem,
            media_avaliacao=round(media_avaliacao, 2) if media_avaliacao is not None else None,
            quantidade_avaliacoes=quantidade_avaliacoes,
        )
        for id_produto, nome_produto, categoria_produto, url_imagem, media_avaliacao, quantidade_avaliacoes in produtos
    ]


@router.get("/{id_produto}")
def get_produto_by_id(id_produto: str, db: Session = Depends(get_db)):
    produto_base = (
        select(
            Produto.id_produto,
            Produto.nome_produto,
            Produto.categoria_produto,
            Produto.peso_produto_gramas,
            Produto.comprimento_centimetros,
            Produto.largura_centimetros,
            Produto.altura_centimetros,
        )
        .where(Produto.id_produto == id_produto)
        .subquery()
    )

    detalhe_query = (
        select(
            produto_base.c.id_produto,
            produto_base.c.nome_produto,
            produto_base.c.categoria_produto,
            produto_base.c.peso_produto_gramas,
            produto_base.c.comprimento_centimetros,
            produto_base.c.largura_centimetros,
            produto_base.c.altura_centimetros,
            CategoriaImagem.url_imagem,
            func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacao"),
            func.count(AvaliacaoPedido.id_avaliacao).label("quantidade_avaliacoes"),
        )
        .select_from(produto_base)
        .outerjoin(
            CategoriaImagem,
            produto_base.c.categoria_produto == CategoriaImagem.categoria_produto,
        )
        .outerjoin(ItemPedido, produto_base.c.id_produto == ItemPedido.id_produto)
        .outerjoin(AvaliacaoPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)
        .group_by(
            produto_base.c.id_produto,
            produto_base.c.nome_produto,
            produto_base.c.categoria_produto,
            produto_base.c.peso_produto_gramas,
            produto_base.c.comprimento_centimetros,
            produto_base.c.largura_centimetros,
            produto_base.c.altura_centimetros,
            CategoriaImagem.url_imagem,
        )
    )

    detalhe = db.execute(detalhe_query).one_or_none()

    if detalhe is None:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")

    itens_produto = (
        select(
            ItemPedido.id_pedido,
            ItemPedido.id_vendedor,
            ItemPedido.preco_BRL,
        )
        .where(ItemPedido.id_produto == id_produto)
        .subquery()
    )

    avaliacoes_query = (
        select(
            AvaliacaoPedido.id_avaliacao,
            AvaliacaoPedido.avaliacao,
            Consumidor.nome_consumidor,
            AvaliacaoPedido.titulo_comentario,
            AvaliacaoPedido.comentario,
        )
        .select_from(itens_produto)
        .join(Pedido, Pedido.id_pedido == itens_produto.c.id_pedido)
        .join(AvaliacaoPedido, AvaliacaoPedido.id_pedido == Pedido.id_pedido)
        .join(Consumidor, Consumidor.id_consumidor == Pedido.id_consumidor)
        .distinct()
    )

    vendedores_query = (
        select(
            Vendedor.id_vendedor,
            Vendedor.nome_vendedor,
            func.min(itens_produto.c.preco_BRL).label("preco_brl"),
            Vendedor.cidade,
            Vendedor.estado,
        )
        .select_from(itens_produto)
        .join(Vendedor, Vendedor.id_vendedor == itens_produto.c.id_vendedor)
        .group_by(
            Vendedor.id_vendedor,
            Vendedor.nome_vendedor,
            Vendedor.cidade,
            Vendedor.estado,
        )
    )

    avaliacoes = db.execute(avaliacoes_query).all()
    vendedores = db.execute(vendedores_query).all()

    return ProdutoDetailView(
        id_produto=detalhe.id_produto,
        nome_produto=detalhe.nome_produto,
        categoria_produto=detalhe.categoria_produto,
        peso_produto_gramas=detalhe.peso_produto_gramas,
        comprimento_centimetros=detalhe.comprimento_centimetros,
        largura_centimetros=detalhe.largura_centimetros,
        altura_centimetros=detalhe.altura_centimetros,
        url_imagem=detalhe.url_imagem,
        media_avaliacao=round(detalhe.media_avaliacao, 2) if detalhe.media_avaliacao is not None else None,
        quantidade_avaliacoes=detalhe.quantidade_avaliacoes,
        avaliacoes=[
            AvaliacaoView(
                id_avaliacao=id_avaliacao,
                avaliacao=avaliacao,
                nome_consumidor=nome_consumidor,
                titulo_comentario=titulo_comentario,
                comentario=comentario,
            )
            for id_avaliacao, avaliacao, nome_consumidor, titulo_comentario, comentario in avaliacoes
        ]
        or None,
        vendedores=[
            VendedorView(
                id_vendedor=id_vendedor,
                nome_vendedor=nome_vendedor,
                preco_brl=preco_brl,
                cidade=cidade,
                estado=estado,
            )
            for id_vendedor, nome_vendedor, preco_brl, cidade, estado in vendedores
        ]
        or None,
    )