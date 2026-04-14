from pydantic import BaseModel


class AvaliacaoView(BaseModel):
    id_avaliacao: str
    avaliacao: int
    nome_consumidor: str
    titulo_comentario: str | None
    comentario: str | None

class VendedorView(BaseModel):
    id_vendedor: str
    nome_vendedor: str
    preco_brl: float
    cidade: str
    estado: str

class ProdutoListView(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    url_imagem: str | None
    media_avaliacao: float | None
    quantidade_avaliacoes: int

class ProdutoDetailView(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: float | None
    comprimento_centimetros: float | None
    largura_centimetros: float | None
    altura_centimetros: float | None
    url_imagem: str | None
    media_avaliacao: float | None
    quantidade_avaliacoes: int
    avaliacoes: list[AvaliacaoView] | None
    vendedores: list[VendedorView] | None


class ProdutoWritePayload(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: float | None = None
    comprimento_centimetros: float | None = None
    largura_centimetros: float | None = None
    altura_centimetros: float | None = None


class ProdutoUpdatePayload(BaseModel):
    nome_produto: str | None = None
    categoria_produto: str | None = None
    peso_produto_gramas: float | None = None
    comprimento_centimetros: float | None = None
    largura_centimetros: float | None = None
    altura_centimetros: float | None = None


class ProdutoWriteResponse(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: float | None
    comprimento_centimetros: float | None
    largura_centimetros: float | None
    altura_centimetros: float | None