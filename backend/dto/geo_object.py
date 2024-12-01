from pydantic import BaseModel

from backend.utils.enums import StatusTypes


class StatusModel(BaseModel):
    id: int
    name: str

class PropertyModel(BaseModel):
    name: str
    type: str
    depth: float
    status: str
    material: str
    description: str


class GlobalLayerModel(BaseModel):
    id: int
    name: str


class GeometryModel(BaseModel):
    type: str
    coordinates: list[list[float]]


class GeoObjectModel(BaseModel):
    id: int
    type: str
    properties: PropertyModel
    geometry: GeometryModel
    global_layers: list[GlobalLayerModel]


class UpdateGeoObjectModel(BaseModel):
    name: str | None = None
    status: int | None = None
    description: str | None = None
    material: str | None = None
    global_layers: list[int] | None = None


class AddGeoObject(GeoObjectModel):
    pass