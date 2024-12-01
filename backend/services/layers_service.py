from backend.dto.geo_object import GlobalLayerModel
from backend.errors.global_layer_errors import LayerNotFoundError
from backend.repositories.layer_repository import LayerRepository
from backend.services.base_service import BaseService


class LayerService(BaseService):
    repository: LayerRepository

    async def get_layers(self):
        layers = await self.repository.get_all_items()
        return await self.dump_items(layers, GlobalLayerModel)
    
    async def check_layers_exist(self, layers: list[int]):
        if not layers:
            return 
        for layer in layers:
            layer = await self.repository.get_item(layer)
            await self.check_item(layer, LayerNotFoundError)