import json as jsn
import os
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.models.geo_object import (
    Coordinate,
    GeoObject,
    GeoObjectGeometry,
    GeoObjectProperty,
    GeoObjectStatus,
    GeoObjectType,
    GeometryType,
    GlobalLayer,
    PropertyType,
)


async def create_test_db(session: AsyncSession):
    check = (await session.execute(select(GeoObject))).scalars().all() 
    if check:
        await session.close()
        return
    
    with open(os.path.join(os.getcwd(), 'backend', 'database', 'connection', 'test_db.json'), 'r') as file:
        test_json = file.read()
        test_jsons = jsn.loads(test_json)

    for json in test_jsons:
        geo_object_type = (
            await session.execute(
                select(GeoObjectType).where(
                    GeoObjectType.name == json["properties"]["type"]
                )
            )
        ).scalar_one_or_none()
        property_type = (
            await session.execute(
                select(PropertyType).where(
                    PropertyType.name == json["properties"]["type"]
                )
            )
        ).scalar_one_or_none()
        geometry_type = (
            await session.execute(
                select(GeoObjectType).where(
                    GeoObjectType.name == json["geometry"]["type"]
                )
            )
        ).scalar_one_or_none()
        global_layer = (
            await session.execute(
                select(GlobalLayer).where(
                    GlobalLayer.name == json["global_layers"][0]
                )
            )
        ).scalar_one_or_none()

        if not global_layer:
            global_layer = GlobalLayer(name=json["global_layers"][0])
            session.add(global_layer)
        if not geo_object_type:
            geo_object_type = GeoObjectType(name=json["properties"]["type"])
            session.add(geo_object_type)
        if not property_type:
            property_type = PropertyType(name=json["properties"]["type"])
            session.add(property_type)
        if not geometry_type:
            geometry_type = GeometryType(name=json["geometry"]["type"])
            session.add(geometry_type)
        status = GeoObjectStatus(name='Активный')
        geometry = GeoObjectGeometry(
            type=geometry_type,
            coordinates=[
                Coordinate(x=coordinate[0], y=coordinate[1])
                for coordinate in json["geometry"]["coordinates"]
            ]
        )
        properties = GeoObjectProperty(
            property_type=property_type,
            depth=json["properties"]["depth"],
            name=json["properties"]["name"],   
            status=status,
        )
        property_type.properties.append(properties)
        geo_object = GeoObject(
            type=geo_object_type,
            properties=properties,
            geometry=geometry
        )
        global_layer.geo_objects.append(geo_object)
        session.add(geo_object)
        await session.commit()