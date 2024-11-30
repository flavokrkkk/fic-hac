from typing import Annotated
from fastapi import APIRouter, Depends

from backend.dto.location_dto import AddUserLocationModel
from backend.services.location_service import LocationService
from backend.utils.dependencies.dependencies import (
    get_current_user_dependency,
    get_location_service,
)


router = APIRouter(prefix="/api/location", tags=["location"])


@router.get("/")
async def get_location(
    object_name: str,
    location_service: Annotated[
        LocationService, Depends(get_location_service)
    ],
):
    return await location_service.get_object_location(object_name)


@router.post("/saved-locations")
async def add_location_to_user_saved(
    user_id: Annotated[int, Depends(get_current_user_dependency)],
    location_service: Annotated[
        LocationService, Depends(get_location_service)
    ],
    form: AddUserLocationModel,
):
    return await location_service.add_location_to_user_saved(user_id, form)
