from typing import Annotated
from fastapi import APIRouter, Depends

from backend.services.geo_object_service import GeoObjectService
from backend.services.user_service import UserService
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_geo_object_service,
    get_user_service,
)


router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/")
async def get_user_profile(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    user_service: Annotated[UserService, Depends(get_user_service)],
):
    return await user_service.get_profile(user_id)


@router.get("/saved-objects")
async def get_user_saved_objects(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    geo_object_service: Annotated[GeoObjectService, Depends(get_geo_object_service)],
):
    return await geo_object_service.get_user_saved_objects(user_id)


@router.post("/saved-objects")
async def add_user_saved_object(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    geo_object_id: int,
    user_service: Annotated[UserService, Depends(get_user_service)],
):
    return await user_service.add_user_geo_object(user_id, geo_object_id)
