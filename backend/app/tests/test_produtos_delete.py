from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import Consumidor, ItemPedido, Pedido, Produto, Vendedor


def test_delete_produto_remove_referencias_em_cascata(client: TestClient, db_session):
    db_session.add_all(
        [
            Consumidor(
                id_consumidor="cons-del-1",
                prefixo_cep="01000",
                nome_consumidor="Cliente Delete",
                cidade="Sao Paulo",
                estado="SP",
            ),
            Vendedor(
                id_vendedor="vend-del-1",
                nome_vendedor="Loja Delete",
                prefixo_cep="02000",
                cidade="Sao Paulo",
                estado="SP",
            ),
            Pedido(
                id_pedido="ped-del-1",
                id_consumidor="cons-del-1",
                status="entregue",
            ),
            Produto(
                id_produto="prod-del-1",
                nome_produto="Produto para Deletar",
                categoria_produto="teste",
                peso_produto_gramas=100,
                comprimento_centimetros=10,
                altura_centimetros=10,
                largura_centimetros=10,
            ),
            ItemPedido(
                id_pedido="ped-del-1",
                id_item=1,
                id_produto="prod-del-1",
                id_vendedor="vend-del-1",
                preco_BRL=99.9,
                preco_frete=9.9,
            ),
        ]
    )
    db_session.commit()

    response = client.delete("/produtos/prod-del-1")

    assert response.status_code == 204
    assert db_session.get(Produto, "prod-del-1") is None

    itens = db_session.execute(
        select(ItemPedido).where(ItemPedido.id_produto == "prod-del-1")
    ).scalars().all()
    assert itens == []


def test_delete_produto_retorna_404_quando_nao_existe(client: TestClient):
    response = client.delete("/produtos/prod-nao-existe")

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado"}
