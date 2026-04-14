from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from datetime import date, datetime
from itertools import islice
from pathlib import Path
from typing import Any, Callable, Iterable

import pandas as pd
from sqlalchemy import insert, select

from app.database import SessionLocal
from app.config import settings
from app.models import (
    AvaliacaoPedido,
    CategoriaImagem,
    Consumidor,
    ItemPedido,
    Pedido,
    Produto,
    User,
    Vendedor,
)
from app.security import hash_password


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
BATCH_SIZE = 1000


SEED_TABLES: list[
    tuple[str, str, object, Callable[[pd.DataFrame], pd.DataFrame] | None]
] = [
    ("consumidores", "dim_consumidores.csv", Consumidor, None),
    (
        "produtos",
        "dim_produtos.csv",
        Produto,
        lambda dataframe: dataframe.assign(
        peso_produto_gramas=pd.to_numeric(dataframe["peso_produto_gramas"], errors="coerce"),
        comprimento_centimetros=pd.to_numeric(
            dataframe["comprimento_centimetros"], errors="coerce"
        ),
        altura_centimetros=pd.to_numeric(dataframe["altura_centimetros"], errors="coerce"),
        largura_centimetros=pd.to_numeric(dataframe["largura_centimetros"], errors="coerce"),
    ),
    ),
    ("vendedores", "dim_vendedores.csv", Vendedor, None),
    (
        "categoria_imagens",
        "dim_categoria_imagens.csv",
        CategoriaImagem,
        lambda dataframe: dataframe.rename(
            columns={"Categoria": "categoria_produto", "Link": "url_imagem"}
        ),
    ),
    (
        "pedidos",
        "fat_pedidos.csv",
        Pedido,
        lambda dataframe: dataframe.assign(
            pedido_compra_timestamp=pd.to_datetime(
                dataframe["pedido_compra_timestamp"], errors="coerce"
            ),
            pedido_entregue_timestamp=pd.to_datetime(
                dataframe["pedido_entregue_timestamp"], errors="coerce"
            ),
            data_estimada_entrega=pd.to_datetime(
                dataframe["data_estimada_entrega"], errors="coerce"
            ).dt.date,
            tempo_entrega_dias=pd.to_numeric(dataframe["tempo_entrega_dias"], errors="coerce"),
            tempo_entrega_estimado_dias=pd.to_numeric(
                dataframe["tempo_entrega_estimado_dias"], errors="coerce"
            ),
            diferenca_entrega_dias=pd.to_numeric(
                dataframe["diferenca_entrega_dias"], errors="coerce"
            ),
        ),
    ),
    (
        "itens_pedidos",
        "fat_itens_pedidos.csv",
        ItemPedido,
        lambda dataframe: dataframe.assign(
            id_item=pd.to_numeric(dataframe["id_item"], errors="coerce"),
            preco_BRL=pd.to_numeric(dataframe["preco_BRL"], errors="coerce"),
            preco_frete=pd.to_numeric(dataframe["preco_frete"], errors="coerce"),
        ),
    ),
    (
        "avaliacoes_pedidos",
        "fat_avaliacoes_pedidos.csv",
        AvaliacaoPedido,
        lambda dataframe: dataframe.assign(
            avaliacao=pd.to_numeric(dataframe["avaliacao"], errors="coerce"),
            data_comentario=pd.to_datetime(dataframe["data_comentario"], errors="coerce"),
            data_resposta=pd.to_datetime(dataframe["data_resposta"], errors="coerce"),
        ),
    ),
]


def seed_default_admin(*, force: bool = False) -> None:
    with SessionLocal() as session:
        existing_admin = session.scalar(select(User).where(User.username == settings.DEFAULT_ADMIN_USERNAME))

        if existing_admin is not None and not force:
            if existing_admin.role != "admin" or not existing_admin.is_active:
                existing_admin.role = "admin"
                existing_admin.is_active = True
                session.commit()
            print(f"admin: usuario padrao ja existe ({settings.DEFAULT_ADMIN_USERNAME})")
            return

        if existing_admin is not None:
            session.delete(existing_admin)
            session.commit()

        session.add(
            User(
                id_user="admin-default-user",
                username=settings.DEFAULT_ADMIN_USERNAME,
                password_hash=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
                role="admin",
                is_active=True,
            )
        )
        session.commit()
        print(f"admin: usuario padrao criado ({settings.DEFAULT_ADMIN_USERNAME})")


def normalize_value(value: object) -> object:
    if isinstance(value, str):
        normalized = value.strip()
        return normalized or None

    if value is None or pd.isna(value):
        return None

    if isinstance(value, pd.Timestamp):
        return value.to_pydatetime()

    if isinstance(value, datetime):
        return value

    if isinstance(value, date):
        return value

    if hasattr(value, "item"):
        try:
            return value.item()
        except ValueError:
            return value

    return value


def chunked(iterable: Iterable[dict[str, object]], size: int) -> Iterable[list[dict[str, object]]]:
    iterator = iter(iterable)

    while True:
        batch = list(islice(iterator, size))
        if not batch:
            break
        yield batch


def dataframe_to_records(dataframe: pd.DataFrame) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []

    for row in dataframe.to_dict(orient="records"):
        records.append({column: normalize_value(value) for column, value in row.items()})

    return records


def table_has_rows(model) -> bool:
    with SessionLocal() as session:
        statement = select(1).select_from(model).limit(1)
        return session.execute(statement).first() is not None


def seed_table(
    *,
    csv_filename: str,
    model,
    frame_transform: Callable[[pd.DataFrame], pd.DataFrame] | None = None,
) -> int:
    csv_path = DATA_DIR / csv_filename
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    try:
        dataframe = pd.read_csv(csv_path, dtype=str, keep_default_na=False, encoding="utf-8-sig")
        if frame_transform is not None:
            dataframe = frame_transform(dataframe)

        records = dataframe_to_records(dataframe)
        total_rows = 0

        with SessionLocal() as session:
            for batch in chunked(records, BATCH_SIZE):
                statement = insert(model).values(batch).prefix_with("OR IGNORE")
                session.execute(statement)
                session.commit()
                total_rows += len(batch)

        return total_rows
    except Exception as exc:
        raise RuntimeError(f"Failed to seed {csv_filename}") from exc


def seed_all() -> None:
    if all(table_has_rows(model) for _, _, model, _ in SEED_TABLES):
        print("Seed já aplicado. Nenhum dado novo foi carregado.")
    else:
        for label, csv_filename, model, frame_transform in SEED_TABLES:
            inserted_rows = seed_table(
                csv_filename=csv_filename,
                model=model,
                frame_transform=frame_transform,
            )
            print(f"{label}: {inserted_rows} linhas processadas")

    seed_default_admin()


def main() -> None:
    parser = argparse.ArgumentParser(description="Carrega os CSVs iniciais no banco de dados.")
    parser.add_argument(
        "--only",
        choices=[
            "consumidores",
            "produtos",
            "vendedores",
            "categoria_imagens",
            "pedidos",
            "itens_pedidos",
            "avaliacoes_pedidos",
            "admin",
            "all",
        ],
        default="all",
        help="Seleciona um dataset específico para carregar.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Força a recarga mesmo se os dados já existirem.",
    )
    args = parser.parse_args()

    jobs = {
        label: (csv_filename, model, frame_transform)
        for label, csv_filename, model, frame_transform in SEED_TABLES
    }

    try:
        if args.only == "all":
            if not args.force and all(table_has_rows(model) for _, _, model, _ in SEED_TABLES):
                print("Seed já aplicado. Nenhum dado novo foi carregado.")
                seed_default_admin(force=args.force)
                return 0

            seed_all()
            return 0

        if args.only == "admin":
            seed_default_admin(force=args.force)
            return 0

        csv_filename, model, frame_transform = jobs[args.only]
        if not args.force and table_has_rows(model):
            print(f"{args.only}: já possui dados. Nenhuma carga executada.")
            return 0

        inserted_rows = seed_table(
            csv_filename=csv_filename,
            model=model,
            frame_transform=frame_transform,
        )
        print(f"{args.only}: {inserted_rows} linhas processadas")
        return 0
    except Exception as exc:
        print(f"Erro ao executar o seed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())