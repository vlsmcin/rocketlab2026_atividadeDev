from fastapi import APIRouter

from app.controllers.auth import router as auth_router
from app.controllers.health import router as health_router
from app.controllers.produtos_create import router as produtos_create_router
from app.controllers.produtos_delete import router as produtos_delete_router
from app.controllers.produtos_read import router as produtos_read_router
from app.controllers.produtos_update import router as produtos_update_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(health_router)
api_router.include_router(produtos_read_router)
api_router.include_router(produtos_create_router)
api_router.include_router(produtos_update_router)
api_router.include_router(produtos_delete_router)
