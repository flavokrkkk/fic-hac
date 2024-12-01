from backend.database.models.geo_object import GeoObjectStatus
from backend.repositories.base import SqlAlchemyRepository


class StatusRepository(SqlAlchemyRepository):
    model = GeoObjectStatus