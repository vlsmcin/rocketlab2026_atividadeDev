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
from app.models import User
from app.router import api_router
from app.security import hash_password


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
        session.add(
            User(
                id_user="user-admin-default",
                username="admin@example.com",
                password_hash=hash_password("admin123"),
                role="admin",
                is_active=True,
            )
        )
        session.commit()
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


@pytest.fixture
def admin_headers(client: TestClient):
    response = client.post(
        "/auth/login",
        json={"username": "admin@example.com", "password": "admin123"},
    )

    assert response.status_code == 200
    access_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {access_token}"}