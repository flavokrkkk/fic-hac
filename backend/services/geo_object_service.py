from sqlalchemy import desc
from backend.database.models.geo_object import GeoObject, GeoObjectGeometry, GeoObjectProperty
from backend.dto.geo_object import GeoObjectModel, GeometryModel, GlobalLayerModel, PropertyModel, StatusModel, UpdateGeoObjectModel
from backend.errors.geo_object_errors import GeoObjectNotFound
from backend.repositories.geo_object_repository import GeoObjectRepository
from backend.services.base_service import BaseService


class GeoObjectService(BaseService):
    repository: GeoObjectRepository

    async def _model_validate_object(
        self, 
        geo_object: GeoObject, 
        property: GeoObjectProperty, 
        geometry: GeoObjectGeometry,
        user_objects: list[int]
    ) -> GeoObjectModel:
        return GeoObjectModel(
            id=geo_object.id,
            image=geo_object.image,
            is_saved=geo_object.id in user_objects,
            type=geo_object.type.name,
            properties=PropertyModel(
                name=property.name,
                type=property.property_type.name,
                depth=property.depth,
                status=property.status.name,
                material=property.material,
                description=property.description
            ),
            geometry=GeometryModel(
                type=geometry.type.name,
                coordinates=[
                    [coordinate.x, coordinate.y, coordinate.depth]
                    for coordinate in geometry.coordinates
                ],
            ),
            global_layers=[
                GlobalLayerModel(id=global_layer.id, name=global_layer.name)
                for global_layer in geo_object.global_layers
            ],
        )

    async def get_object(self, user_id: int, object_id: int) -> GeoObjectModel:
        user_objects = await self.repository.get_user_saved_objects(user_id)
        geo_object, property, geometry = await self.repository.get_item(object_id)
        await self.check_item(geo_object, GeoObjectNotFound)
        return await self._model_validate_object(geo_object, property, geometry, user_objects)

    async def get_all_objects(self, user_id: int, global_layers: list[str], is_negative: bool) -> list[GeoObjectModel]:
        objects = await self.repository.get_all_objects(global_layers, is_negative)
        user_objects = await self.repository.get_user_saved_objects(user_id)
        dump_objects = []
        for object, property, geometry in objects:
            dump_objects.append(
                await self._model_validate_object(
                    object, property, geometry, user_objects
                )
            )
        return dump_objects

    async def update_object(self, user_id: int, object_id: int, form: UpdateGeoObjectModel) -> GeoObjectModel:
        object = await self.repository.get_item(object_id)
        await self.check_item(object, GeoObjectNotFound)
        await self.repository.update_item(object[0], form)
        return await self.get_object(user_id, object_id)
    
    async def delete_object(self, object_id: int) -> None:
        object = await self.repository.get_item(object_id)
        await self.check_item(object, GeoObjectNotFound)
        await self.repository.delete_item(object_id)

    async def get_user_saved_objects(self, user_id: int) -> list[GeoObjectModel]:
        objects = await self.repository.get_user_saved_objects(user_id)
        dump_objects = []
        for object in objects:
            dump_objects.append(await self.get_object(user_id, object))
        return dump_objects