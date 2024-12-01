from typing import Annotated
from fastapi import APIRouter, Depends

from backend.services.layers_service import LayerService
from backend.utils.dependencies.dependencies import get_layers_service


router = APIRouter(prefix='/api/layer', tags=['layers'])


@router.get('/')
async def get_layers(
    layers_service: Annotated[
        LayerService, Depends(get_layers_service)
    ]
):
    return await layers_service.get_layers()