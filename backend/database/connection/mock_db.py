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
    PropertyType,
)


async def create_test_db(session: AsyncSession):
    check = (await session.execute(select(GeoObject))).scalars().all() 
    if check:
        await session.close()
        return
    
    test_jsons = [
        {
            "type": "Feature",
            "properties": {
                "name": "Трубопровод 1",
                "type": "Трубопровод",
                "depth": 10,
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[37.605241, 55.729054], [37.6059, 55.7299]],
            },
        },
        {
            "type": "Feature",
            "properties": {"name": "Кабель 1", "type": "Кабель", "depth": 5},
            "geometry": {
                "type": "LineString",
                "coordinates": [[37.6075, 55.7300], [37.6080, 55.7315]],
            },
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Трубопровод 2",
                "type": "Трубопровод",
                "depth": 15,
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [37.6040, 55.7320],
                    [37.6060, 55.7330],
                    [37.6075, 55.7340],
                ],
            },
        },
        {
            "type": "Feature",
            "properties": {"name": "Кабель 2", "type": "Кабель", "depth": 12},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [37.6090, 55.7350],
                    [37.6100, 55.7360],
                    [37.6110, 55.7370],
                ],
            },
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Газопровод 1",
                "type": "Газопровод",
                "depth": 8,
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [37.6120, 55.7380],
                    [37.6130, 55.7390],
                    [37.6140, 55.7400],
                ],
            },
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Трубопровод 3",
                "type": "Трубопровод",
                "depth": 20,
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[37.6150, 55.7410], [37.6160, 55.7420]],
            },
        },
        {
            "type": "Feature",
            "properties": {"name": "Кабель 3", "type": "Кабель", "depth": 10},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [37.6170, 55.7430],
                    [37.6180, 55.7440],
                    [37.6190, 55.7450],
                ],
            },
        },
    ]

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
                select(GeoObjectType).where(
                    GeoObjectType.name == json["properties"]["type"]
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
            
        )
        status.properties.append(properties)
        geo_object = GeoObject(
            type=geo_object_type,
            properties=properties,
            geometry=geometry,
        )
        session.add(geo_object)
        await session.commit()