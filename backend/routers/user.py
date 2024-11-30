from typing import Annotated
from fastapi import APIRouter, Depends

from backend.dto.location_dto import AddUserLocationModel
from backend.services.user_service import UserService
from backend.utils.dependencies.dependencies import get_current_user_dependency, get_user_service


router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/")
async def get_user_profile(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_profile(user_id)


@router.get('/saved-locations')
async def get_user_saved_locations(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    user_service: Annotated[UserService, Depends(get_user_service)]
):
    return await user_service.get_user_saved_locations(user_id)
