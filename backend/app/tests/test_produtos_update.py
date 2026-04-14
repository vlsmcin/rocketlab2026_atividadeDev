import pytest
from fastapi.testclient import TestClient

from app.models.produto import Produto


def test_update_produto_retorna_200(client: TestClient, db_session, admin_headers):
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
        headers=admin_headers,
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


def test_update_produto_retorna_404_quando_nao_existe(client: TestClient, admin_headers):
    response = client.put(
        "/produtos/prod-nao-existe",
        headers=admin_headers,
        json={"nome_produto": "Sem efeito"},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado"}


def test_update_produto_invalida_cache_de_detalhe(client: TestClient, db_session, admin_headers):
    db_session.add(
        Produto(
            id_produto="prod-cache-upd",
            nome_produto="Nome Antigo",
            categoria_produto="audio",
            peso_produto_gramas=100,
            comprimento_centimetros=10,
            altura_centimetros=5,
            largura_centimetros=5,
        )
    )
    db_session.commit()

    detalhe_antes = client.get("/produtos/prod-cache-upd")
    assert detalhe_antes.status_code == 200
    assert detalhe_antes.json()["nome_produto"] == "Nome Antigo"

    atualizacao = client.put(
        "/produtos/prod-cache-upd",
        headers=admin_headers,
        json={"nome_produto": "Nome Novo"},
    )
    assert atualizacao.status_code == 200

    detalhe_depois = client.get("/produtos/prod-cache-upd")
    assert detalhe_depois.status_code == 200
    assert detalhe_depois.json()["nome_produto"] == "Nome Novo"


def test_update_produto_retorna_400_quando_payload_vazio(client: TestClient, db_session, admin_headers):
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

    response = client.put("/produtos/prod-crud-3", headers=admin_headers, json={})

    assert response.status_code == 400
    assert response.json() == {"detail": "Nenhum campo para atualizar"}

    produto = db_session.get(Produto, "prod-crud-3")
    assert produto is not None
    assert produto.nome_produto == "Caixa de Som"
    assert produto.categoria_produto == "audio"


@pytest.mark.parametrize(
    "payload",
    [
        {"nome_produto": "   "},
        {"categoria_produto": "   "},
    ],
)
def test_update_produto_retorna_400_quando_texto_esta_vazio(
    client: TestClient,
    db_session,
    admin_headers,
    payload: dict,
):
    db_session.add(
        Produto(
            id_produto="prod-crud-4",
            nome_produto="Headset",
            categoria_produto="audio",
            peso_produto_gramas=300,
            comprimento_centimetros=18,
            altura_centimetros=9,
            largura_centimetros=17,
        )
    )
    db_session.commit()

    response = client.put("/produtos/prod-crud-4", headers=admin_headers, json=payload)

    assert response.status_code == 400
    assert response.json() == {"detail": "Campos texto nao podem ser vazios"}

    produto = db_session.get(Produto, "prod-crud-4")
    assert produto is not None
    assert produto.nome_produto == "Headset"
    assert produto.categoria_produto == "audio"
