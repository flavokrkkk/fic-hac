from pydantic import BaseModel


class PropertyModel(BaseModel):
    name: str
    type: str
    depth: float
    status: str


class GeometryModel(BaseModel):
    type: str
    coordinates: list[list[float]]


class GeoObjectModel(BaseModel):
    id: int
    type: str
    properties: PropertyModel
    geometry: GeometryModel
