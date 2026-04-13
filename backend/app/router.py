from fastapi import APIRouter

from app.controllers.health import router as health_router
from app.controllers.produtos_getters import router as produtos_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(produtos_router)
