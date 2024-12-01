from ast import Await
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload
from backend.database.models.geo_object import GeoObject, GeoObjectGeometry, GeoObjectProperty, GlobalLayer, GlobalLayerGeoObject
from backend.database.models.user import UserGeoObject
from backend.dto.geo_object import UpdateGeoObjectModel
from backend.repositories.base import SqlAlchemyRepository
from backend.utils.enums import StatusTypes


class GeoObjectRepository(SqlAlchemyRepository):
    model = GeoObject

    async def get_item(
        self, 
        object_id: int
    ) -> tuple[GeoObject, GeoObjectProperty, GeoObjectGeometry]:
        geo_object = (
            await self.session.execute(
                select(self.model).join(GeoObjectProperty)
                .options(joinedload(GeoObject.geometry))
                .options(joinedload(GeoObject.properties))
                .where(self.model.id == object_id)
            )
        ).scalar_one_or_none()
        property_object = (
            await self.session.execute(
                select(GeoObjectProperty)
                .where(GeoObjectProperty.geo_object_id == geo_object.id)
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
                    if global_layers else True
                )
            )
        ).scalars().all()
        for object in all_objects:
            objects.append(
                await self.get_item(object.id)
            )
        return objects
    
    async def update_status(self, object_id: int, new_status: StatusTypes):
        await self.session.execute( 
            update(
                GeoObjectProperty
            ).where(
                GeoObjectProperty.geo_object_id == object_id
            ).values(
                status_id=new_status
            )
        )

    async def update_layers(self, object: GeoObject, global_layers: list[int]):
        object_layers = [
            GlobalLayerGeoObject(
                global_layer_id=global_layer_id,
                geo_object_id=object.id
            ) for global_layer_id in global_layers
        ]
        self.session.add_all(object_layers)

    async def update_property(self, object: GeoObject, update_data: dict):
        if not update_data:
            return
        
        await self.session.execute(
            update(
                GeoObjectProperty
            ).where(
                GeoObjectProperty.geo_object_id == object.id
            ).values(
                **update_data
            )
        )

    async def update_item(self, object: GeoObject, form: UpdateGeoObjectModel) -> GeoObject:
        if form.status:
            await self.update_status(object.id, form.status)
        if form.name:
            object.name = form.name
        if form.global_layers:
            await self.update_layers(object, form.global_layers)
        update_property_data = {}
        if form.description:
            update_property_data["description"] = form.description
        if form.material:
            update_property_data["material"] = form.material    
        
        
        await self.update_property(object, update_property_data)

        await self.session.commit()
        await self.session.refresh(object)
        return object
    
    async def get_user_saved_objects(self, user_id: int):
        objects = (
            await self.session.execute(
                select(
                    UserGeoObject.geo_object_id,
                ).where(
                    UserGeoObject.user_id == user_id
                )
            )
        ).scalars().all()
        return objects