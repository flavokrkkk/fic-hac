from typing import Annotated
from fastapi import APIRouter, Depends

from backend.services.geo_object_service import GeoObjectService
from backend.utils.dependencies.dependencies import get_geo_object_service


router = APIRouter(prefix="/api/geo-object", tags=["geo-object"])


@router.get("/{object_name}")
async def get_geo_object(
    object_name: str,
    geo_object_service: Annotated[
        GeoObjectService, Depends(get_geo_object_service)
    ],
):
    return await geo_object_service.get_object(object_name)


@router.get("/")
async def get_all_geo_objects(
    geo_object_service: Annotated[
        GeoObjectService, Depends(get_geo_object_service)
    ],
):
    return await geo_object_service.get_all_objects()