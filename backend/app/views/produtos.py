from pydantic import BaseModel

class ProdutoListView(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    url_imagem: str | None
    media_avaliacao: float | None
    quantidade_avaliacoes: int
