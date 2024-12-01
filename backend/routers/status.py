from typing import Annotated
from fastapi import APIRouter, Depends

from backend.dto.geo_object import StatusModel
from backend.services.geo_object_service import GeoObjectService
from backend.services.status_service import StatusService
from backend.utils.dependencies.dependencies import get_status_service


router = APIRouter(prefix="/api/status", tags=["status"])


@router.get("/")
async def get_all_geo_statuses(
    geo_object_service: Annotated[
        StatusService, Depends(get_status_service)
    ]
) -> list[StatusModel]:
    return await geo_object_service.get_statuses()