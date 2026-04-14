import pytest
from fastapi.testclient import TestClient

from app.models.produto import Produto


def test_create_produto_retorna_201(client: TestClient, db_session):
    response = client.post(
        "/produtos",
        json={
            "nome_produto": "Camera 4K",
            "categoria_produto": "eletronicos",
            "peso_produto_gramas": 800,
            "comprimento_centimetros": 12,
            "largura_centimetros": 9,
            "altura_centimetros": 8,
        },
    )

    assert response.status_code == 201
    id_produto = response.json()["id_produto"]
    assert isinstance(id_produto, str)
    assert len(id_produto) == 32

    produto = db_session.get(Produto, id_produto)
    assert produto is not None
    assert produto.nome_produto == "Camera 4K"


def test_create_produto_invalida_cache_de_listagem(client: TestClient):
    primeira_listagem = client.get("/produtos")
    assert primeira_listagem.status_code == 200
    assert primeira_listagem.json() == []

    criacao = client.post(
        "/produtos",
        json={
            "nome_produto": "Produto Cache",
            "categoria_produto": "teste_cache",
        },
    )
    assert criacao.status_code == 201

    segunda_listagem = client.get("/produtos")
    assert segunda_listagem.status_code == 200
    assert len(segunda_listagem.json()) == 1


@pytest.mark.parametrize(
    "payload",
    [
        {
            "nome_produto": "   ",
            "categoria_produto": "eletronicos",
        },
        {
            "nome_produto": "Produto Teste",
            "categoria_produto": "   ",
        },
    ],
)
def test_create_produto_retorna_400_quando_campo_obrigatorio_esta_vazio(
    client: TestClient,
    payload: dict,
):
    response = client.post(
        "/produtos",
        json=payload,
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Campos obrigatorios nao podem ser vazios"}


@pytest.mark.parametrize(
    "payload",
    [
        {
            "categoria_produto": "eletronicos",
        },
        {
            "nome_produto": "Produto Teste",
        },
    ],
)
def test_create_produto_retorna_422_quando_campo_obrigatorio_esta_ausente(
    client: TestClient,
    payload: dict,
):
    response = client.post(
        "/produtos",
        json=payload,
    )

    assert response.status_code == 422
