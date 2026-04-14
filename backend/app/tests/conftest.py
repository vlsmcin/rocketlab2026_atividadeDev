from pathlib import Path
import sys

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


BACKEND_ROOT = Path(__file__).resolve().parents[2]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


from app.cache import produto_query_cache
from app.database import Base, get_db
from app.router import api_router


@pytest.fixture(autouse=True)
def clear_query_cache_between_tests():
    produto_query_cache.clear()
    yield
    produto_query_cache.clear()


@pytest.fixture
def db_session(tmp_path: Path):
    db_path = tmp_path / "test_produtos.db"
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    testing_session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    session = testing_session_local()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    app = FastAPI()
    app.include_router(api_router)

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)