from app.database import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column


class CategoriaImagem(Base):
    __tablename__ = "categoria_imagens"

    categoria_produto: Mapped[str] = mapped_column(String(100), primary_key=True)
    url_imagem: Mapped[str] = mapped_column(String(255), nullable=False)