from backend.dto.geo_object import GeoObjectModel, GeometryModel, PropertyModel
from backend.errors.geo_object_errors import GeoObjectNotFound
from backend.repositories.geo_object_repository import GeoObjectRepository
from backend.services.base_service import BaseService


class GeoObjectService(BaseService):
    repository: GeoObjectRepository

    async def get_object(self, object_name: str) -> GeoObjectModel:
        geo_object, property, geometry = await self.repository.get_object_by_name(object_name)
        await self.check_item(geo_object, GeoObjectNotFound)
        return GeoObjectModel(
            id=geo_object.id,
            type=geo_object.type.name,
            properties=PropertyModel(
                name=property.name,
                type=property.property_type.name,
                depth=property.depth,
                status=property.status.name,
            ),
            geometry=GeometryModel(
                type=geometry.type.name,
                coordinates=[
                    [coordinate.x, coordinate.y]
                    for coordinate in geometry.coordinates
                ],
            ),
        )

    async def add_object(self):
        pass
