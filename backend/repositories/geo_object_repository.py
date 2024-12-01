from sqlalchemy import select
from sqlalchemy.orm import joinedload
from backend.database.models.geo_object import GeoObject, GeoObjectGeometry, GeoObjectProperty, GlobalLayer
from backend.repositories.base import SqlAlchemyRepository


class GeoObjectRepository(SqlAlchemyRepository):
    model = GeoObject

    async def get_object_by_name(
        self, 
        property_name: str
    ) -> tuple[GeoObject, GeoObjectProperty, GeoObjectGeometry]:
        geo_object = (
            await self.session.execute(
                select(self.model).join(GeoObjectProperty)
                .options(joinedload(GeoObject.geometry))
                .options(joinedload(GeoObject.properties))
                .where(GeoObjectProperty.name == property_name)
            )
        ).scalar_one_or_none()
        property_object = (
            await self.session.execute(
                select(GeoObjectProperty)
                .where(GeoObjectProperty.name == property_name)
            )
        ).scalar_one_or_none()
        geometry = (
            await self.session.execute(
                select(GeoObjectGeometry)
                .where(GeoObjectGeometry.geo_object_id == geo_object.id)
            )
        ).scalar_one_or_none()
        return geo_object, property_object, geometry
    
    async def get_all_objects(self, global_layers: list[str]):
        objects = []
        all_objects = (
            await self.session.execute(
                select(
                    self.model
                ).where(
                    self.model.global_layers.any(GlobalLayer.name.in_(global_layers))
                )
            )
        ).scalars().all()
        for object in all_objects:
            objects.append(
                await self.get_object_by_name(object.properties.name)
            )
        return objects
    
    async def get_object_by_id(self, object_id: int):
        return await self.session.get(self.model, object_id)