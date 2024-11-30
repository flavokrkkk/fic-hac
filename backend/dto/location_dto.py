from datetime import datetime
from pydantic import BaseModel


class BaseUserLocationModel(BaseModel):
    id: int
    name: str
    lat: float
    long: float
    created_at: datetime


class AddUserLocationModel(BaseModel):
    name: str
    lat: float
    long: float
