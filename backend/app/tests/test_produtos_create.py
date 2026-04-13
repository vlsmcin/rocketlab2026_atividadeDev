from fastapi.testclient import TestClient

from app.models.produto import Produto


def test_create_produto_retorna_201(client: TestClient, db_session):
    response = client.post(
        "/produtos",
        json={
            "id_produto": "prod-crud-1",
            "nome_produto": "Camera 4K",
            "categoria_produto": "eletronicos",
            "peso_produto_gramas": 800,
            "comprimento_centimetros": 12,
            "largura_centimetros": 9,
            "altura_centimetros": 8,
        },
    )

    assert response.status_code == 201
    assert response.json()["id_produto"] == "prod-crud-1"

    produto = db_session.get(Produto, "prod-crud-1")
    assert produto is not None
    assert produto.nome_produto == "Camera 4K"


def test_create_produto_retorna_409_para_id_duplicado(client: TestClient, db_session):
    db_session.add(
        Produto(
            id_produto="prod-dup-1",
            nome_produto="Produto Original",
            categoria_produto="geral",
            peso_produto_gramas=100,
            comprimento_centimetros=10,
            altura_centimetros=10,
            largura_centimetros=10,
        )
    )
    db_session.commit()

    response = client.post(
        "/produtos",
        json={
            "id_produto": "prod-dup-1",
            "nome_produto": "Produto Duplicado",
            "categoria_produto": "geral",
        },
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Produto ja existe"}


def test_create_produto_retorna_400_quando_campos_obrigatorios_vazios(client: TestClient):
    response = client.post(
        "/produtos",
        json={
            "id_produto": "   ",
            "nome_produto": "",
            "categoria_produto": "  ",
        },
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Campos obrigatorios nao podem ser vazios"}
