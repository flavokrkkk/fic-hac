from typing import Annotated
from fastapi import APIRouter, Depends, Query

from backend.dto.geo_object import UpdateGeoObjectModel
from backend.services.geo_object_service import GeoObjectService
from backend.services.layers_service import LayerService
from backend.services.status_service import StatusService
from backend.utils.dependencies.dependencies import get_geo_object_service, get_layers_service, get_status_service


router = APIRouter(prefix="/api/geo-object", tags=["geo-object"])


@router.get("/")
async def get_all_geo_objects(
    geo_object_service: Annotated[
        GeoObjectService, Depends(get_geo_object_service)
    ],
    global_layers: list[str] | None = Query(default=None)
):
    return await geo_object_service.get_all_objects(global_layers)


@router.put("/{object_id}")
async def update_geo_object(
    object_id: int,
    form: UpdateGeoObjectModel,
    geo_object_service: Annotated[
        GeoObjectService, Depends(get_geo_object_service)
    ],
    layer_service: Annotated[LayerService, Depends(get_layers_service)],
    status_service: Annotated[StatusService, Depends(get_status_service)],
):
    await layer_service.check_layers_exist(form.global_layers)
    await status_service.check_status_exist(form.status)
    return await geo_object_service.update_object(object_id, form)