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


def test_get_produto_by_id_retorna_detail_com_avaliacoes_e_vendedores(client: TestClient, db_session):
	db_session.add_all(
		[
			Consumidor(
				id_consumidor="cons-200",
				prefixo_cep="01000",
				nome_consumidor="Alice",
				cidade="Sao Paulo",
				estado="SP",
			),
			Produto(
				id_produto="prod-200",
				nome_produto="Fone Bluetooth",
				categoria_produto="audio",
				peso_produto_gramas=250,
				comprimento_centimetros=18,
				altura_centimetros=9,
				largura_centimetros=16,
			),
			CategoriaImagem(
				categoria_produto="audio",
				url_imagem="https://example.com/audio.jpg",
			),
			Vendedor(
				id_vendedor="vend-200",
				nome_vendedor="Loja A",
				prefixo_cep="02000",
				cidade="Rio de Janeiro",
				estado="RJ",
			),
			Pedido(
				id_pedido="ped-200",
				id_consumidor="cons-200",
				status="entregue",
			),
			ItemPedido(
				id_pedido="ped-200",
				id_item=1,
				id_produto="prod-200",
				id_vendedor="vend-200",
				preco_BRL=299.9,
				preco_frete=20.0,
			),
			AvaliacaoPedido(
				id_avaliacao="ava-200",
				id_pedido="ped-200",
				avaliacao=5,
				titulo_comentario="Muito bom",
				comentario="Produto excelente",
			),
			AvaliacaoPedido(
				id_avaliacao="ava-201",
				id_pedido="ped-200",
				avaliacao=4,
				titulo_comentario="Bom",
				comentario="Atende bem",
			),
		]
	)
	db_session.commit()

	response = client.get("/produtos/prod-200")

	assert response.status_code == 200
	data = response.json()
	assert data["id_produto"] == "prod-200"
	assert data["nome_produto"] == "Fone Bluetooth"
	assert data["categoria_produto"] == "audio"
	assert data["url_imagem"] == "https://example.com/audio.jpg"
	assert data["media_avaliacao"] == 4.5
	assert data["quantidade_avaliacoes"] == 2
	assert data["avaliacoes"] == [
		{
			"id_avaliacao": "ava-200",
			"avaliacao": 5,
			"nome_consumidor": "Alice",
			"titulo_comentario": "Muito bom",
			"comentario": "Produto excelente",
		},
		{
			"id_avaliacao": "ava-201",
			"avaliacao": 4,
			"nome_consumidor": "Alice",
			"titulo_comentario": "Bom",
			"comentario": "Atende bem",
		}
	]
	assert data["vendedores"] == [
		{
			"id_vendedor": "vend-200",
			"nome_vendedor": "Loja A",
			"preco_brl": 299.9,
			"cidade": "Rio de Janeiro",
			"estado": "RJ",
		}
	]


def test_get_produto_by_id_retorna_apenas_o_produto_solicitado_quando_ha_varios_registros(
	client: TestClient,
	db_session,
):
	db_session.add_all(
		[
			Produto(
				id_produto="prod-300",
				nome_produto="Notebook Gamer",
				categoria_produto="informatica",
				peso_produto_gramas=2200,
				comprimento_centimetros=35,
				altura_centimetros=3,
				largura_centimetros=25,
			),
			Produto(
				id_produto="prod-301",
				nome_produto="Mouse Sem Fio",
				categoria_produto="informatica",
				peso_produto_gramas=200,
				comprimento_centimetros=10,
				altura_centimetros=4,
				largura_centimetros=6,
			),
			CategoriaImagem(
				categoria_produto="informatica",
				url_imagem="https://example.com/informatica.jpg",
			),
			Consumidor(
				id_consumidor="cons-300",
				prefixo_cep="03000",
				nome_consumidor="Cliente Teste 300",
				cidade="Sao Paulo",
				estado="SP",
			),
			Vendedor(
				id_vendedor="vend-300",
				nome_vendedor="Loja Teste 300",
				prefixo_cep="04000",
				cidade="Sao Paulo",
				estado="SP",
			),
			Pedido(
				id_pedido="ped-300",
				id_consumidor="cons-300",
				status="entregue",
			),
			ItemPedido(
				id_pedido="ped-300",
				id_item=1,
				id_produto="prod-300",
				id_vendedor="vend-300",
				preco_BRL=399.9,
				preco_frete=25.0,
			),
			ItemPedido(
				id_pedido="ped-300",
				id_item=2,
				id_produto="prod-301",
				id_vendedor="vend-300",
				preco_BRL=89.9,
				preco_frete=15.0,
			),
		]
	)
	db_session.commit()

	response = client.get("/produtos/prod-300")

	assert response.status_code == 200
	data = response.json()
	assert data["id_produto"] == "prod-300"
	assert data["nome_produto"] == "Notebook Gamer"
	assert data["url_imagem"] == "https://example.com/informatica.jpg"
	assert data["quantidade_avaliacoes"] == 0
	assert data["avaliacoes"] is None
	assert data["vendedores"] == [
		{
			"id_vendedor": "vend-300",
			"nome_vendedor": "Loja Teste 300",
			"preco_brl": 399.9,
			"cidade": "Sao Paulo",
			"estado": "SP",
		}
	]


def test_get_produto_by_id_retorna_404_quando_nao_encontrado(client: TestClient, db_session):
	db_session.add(
		Produto(
			id_produto="prod-404",
			nome_produto="Produto Existente",
			categoria_produto="geral",
			peso_produto_gramas=100,
			comprimento_centimetros=10,
			altura_centimetros=10,
			largura_centimetros=10,
		)
	)
	db_session.commit()

	response = client.get("/produtos/prod-inexistente")

	assert response.status_code == 404
	assert response.json() == {"detail": "Produto nao encontrado"}
