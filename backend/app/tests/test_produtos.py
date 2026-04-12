from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.controllers.produtos import router as produtos_router
from app.database import Base, get_db
from app.models import AvaliacaoPedido, CategoriaImagem, Consumidor, ItemPedido, Pedido, Produto, Vendedor


@pytest.fixture
def db_session(tmp_path: Path):
	db_path = tmp_path / "test_produtos.db"
	engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
	TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

	Base.metadata.create_all(bind=engine)

	session = TestingSessionLocal()
	try:
		yield session
	finally:
		session.close()
		Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
	app = FastAPI()
	app.include_router(produtos_router)

	def override_get_db():
		try:
			yield db_session
		finally:
			pass

	app.dependency_overrides[get_db] = override_get_db
	return TestClient(app)


def test_get_produtos_retorna_lista_vazia(client: TestClient):
	response = client.get("/produtos")

	assert response.status_code == 200
	assert response.json() == []


def test_get_produtos_retorna_dados_agregados(client: TestClient, db_session):
	db_session.add_all(
		[
			Consumidor(
				id_consumidor="cons-1",
				prefixo_cep="01000",
				nome_consumidor="Cliente Teste",
				cidade="Sao Paulo",
				estado="SP",
			),
			Produto(
				id_produto="prod-1",
				nome_produto="Cafeteira Pro",
				categoria_produto="eletrodomesticos",
				peso_produto_gramas=1200,
				comprimento_centimetros=30,
				altura_centimetros=40,
				largura_centimetros=20,
			),
			CategoriaImagem(
				categoria_produto="eletrodomesticos",
				url_imagem="https://example.com/eletro.jpg",
			),
			Vendedor(
				id_vendedor="vend-1",
				nome_vendedor="Loja Teste",
				prefixo_cep="02000",
				cidade="Sao Paulo",
				estado="SP",
			),
			Pedido(
				id_pedido="ped-1",
				id_consumidor="cons-1",
				status="entregue",
			),
			ItemPedido(
				id_pedido="ped-1",
				id_item=1,
				id_produto="prod-1",
				id_vendedor="vend-1",
				preco_BRL=199.9,
				preco_frete=19.9,
			),
			AvaliacaoPedido(
				id_avaliacao="ava-1",
				id_pedido="ped-1",
				avaliacao=5,
			),
			AvaliacaoPedido(
				id_avaliacao="ava-2",
				id_pedido="ped-1",
				avaliacao=4,
			),
		]
	)
	db_session.commit()

	response = client.get("/produtos")

	assert response.status_code == 200
	data = response.json()
	assert len(data) == 1
	assert data[0]["id_produto"] == "prod-1"
	assert data[0]["nome_produto"] == "Cafeteira Pro"
	assert data[0]["categoria_produto"] == "eletrodomesticos"
	assert data[0]["url_imagem"] == "https://example.com/eletro.jpg"
	assert data[0]["media_avaliacao"] == 4.5
	assert data[0]["quantidade_avaliacoes"] == 2


def test_get_produtos_filtra_por_title_e_categoria(client: TestClient, db_session):
	db_session.add_all(
		[
			Produto(
				id_produto="prod-10",
				nome_produto="Mouse Gamer",
				categoria_produto="informatica_acessorios",
				peso_produto_gramas=300,
				comprimento_centimetros=10,
				altura_centimetros=5,
				largura_centimetros=6,
			),
			Produto(
				id_produto="prod-20",
				nome_produto="Teclado Mecanico",
				categoria_produto="informatica_acessorios",
				peso_produto_gramas=800,
				comprimento_centimetros=45,
				altura_centimetros=4,
				largura_centimetros=15,
			),
		]
	)
	db_session.commit()

	response = client.get(
		"/produtos",
		params={"title": "mouse", "categoria": "informatica", "limit": 10, "offset": 0},
	)

	assert response.status_code == 200
	data = response.json()
	assert len(data) == 1
	assert data[0]["id_produto"] == "prod-10"


def test_get_produtos_filtra_apenas_por_title(client: TestClient, db_session):
	db_session.add_all(
		[
			Produto(
				id_produto="prod-30",
				nome_produto="Notebook Gamer",
				categoria_produto="informatica",
				peso_produto_gramas=2200,
				comprimento_centimetros=35,
				altura_centimetros=3,
				largura_centimetros=25,
			),
			Produto(
				id_produto="prod-40",
				nome_produto="Notebook Office",
				categoria_produto="escritorio",
				peso_produto_gramas=2000,
				comprimento_centimetros=33,
				altura_centimetros=2,
				largura_centimetros=23,
			),
			Produto(
				id_produto="prod-50",
				nome_produto="Mouse Sem Fio",
				categoria_produto="informatica",
				peso_produto_gramas=200,
				comprimento_centimetros=10,
				altura_centimetros=4,
				largura_centimetros=6,
			),
		]
	)
	db_session.commit()

	response = client.get(
		"/produtos",
		params={"title": "mouse", "categoria": "", "limit": 10, "offset": 0},
	)

	assert response.status_code == 200
	data = response.json()
	assert len(data) == 1
	assert data[0]["id_produto"] == "prod-50"
	assert data[0]["nome_produto"] == "Mouse Sem Fio"


def test_get_produtos_filtra_apenas_por_categoria(client: TestClient, db_session):
	db_session.add_all(
		[
			Produto(
				id_produto="prod-60",
				nome_produto="Cadeira Ergonomica",
				categoria_produto="moveis_escritorio",
				peso_produto_gramas=7000,
				comprimento_centimetros=70,
				altura_centimetros=110,
				largura_centimetros=60,
			),
			Produto(
				id_produto="prod-70",
				nome_produto="Mesa de Escritorio",
				categoria_produto="moveis_escritorio",
				peso_produto_gramas=15000,
				comprimento_centimetros=120,
				altura_centimetros=75,
				largura_centimetros=60,
			),
			Produto(
				id_produto="prod-80",
				nome_produto="Liquidificador",
				categoria_produto="eletrodomesticos",
				peso_produto_gramas=2500,
				comprimento_centimetros=20,
				altura_centimetros=40,
				largura_centimetros=20,
			),
		]
	)
	db_session.commit()

	response = client.get(
		"/produtos",
		params={"categoria": "eletro", "limit": 10, "offset": 0},
	)

	assert response.status_code == 200
	data = response.json()
	assert len(data) == 1
	assert data[0]["id_produto"] == "prod-80"
	assert data[0]["categoria_produto"] == "eletrodomesticos"
