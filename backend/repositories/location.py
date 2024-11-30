from backend.database.models.location import UserLocation
from backend.repositories.base import SqlAlchemyRepository


class LocationRepository(SqlAlchemyRepository):
    model = UserLocation