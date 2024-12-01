from pydantic import BaseModel


class PropertyModel(BaseModel):
    name: str
    type: str
    depth: float
    status: str


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