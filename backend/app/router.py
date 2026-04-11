from fastapi import APIRouter

from app.controller.health import router as health_router
from app.controller.produtos import router as produtos_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(produtos_router)
