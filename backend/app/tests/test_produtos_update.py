from fastapi.testclient import TestClient

from app.models.produto import Produto


def test_update_produto_retorna_200(client: TestClient, db_session):
    db_session.add(
        Produto(
            id_produto="prod-crud-2",
            nome_produto="Smartwatch",
            categoria_produto="vestiveis",
            peso_produto_gramas=120,
            comprimento_centimetros=4,
            altura_centimetros=1,
            largura_centimetros=4,
        )
    )
    db_session.commit()

    response = client.put(
        "/produtos/prod-crud-2",
        json={
            "nome_produto": "Smartwatch Pro",
            "categoria_produto": "eletronicos_vestiveis",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["nome_produto"] == "Smartwatch Pro"
    assert data["categoria_produto"] == "eletronicos_vestiveis"

    produto = db_session.get(Produto, "prod-crud-2")
    assert produto is not None
    assert produto.nome_produto == "Smartwatch Pro"


def test_update_produto_retorna_404_quando_nao_existe(client: TestClient):
    response = client.put(
        "/produtos/prod-nao-existe",
        json={"nome_produto": "Sem efeito"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado"}


def test_update_produto_retorna_400_quando_payload_vazio(client: TestClient, db_session):
    db_session.add(
        Produto(
            id_produto="prod-crud-3",
            nome_produto="Caixa de Som",
            categoria_produto="audio",
            peso_produto_gramas=500,
            comprimento_centimetros=20,
            altura_centimetros=10,
            largura_centimetros=10,
        )
    )
    db_session.commit()

    response = client.put("/produtos/prod-crud-3", json={})

    assert response.status_code == 400
    assert response.json() == {"detail": "Nenhum campo para atualizar"}

    produto = db_session.get(Produto, "prod-crud-3")
    assert produto is not None
    assert produto.nome_produto == "Caixa de Som"
    assert produto.categoria_produto == "audio"
