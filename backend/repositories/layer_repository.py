from backend.database.models.geo_object import GlobalLayer
from backend.repositories.base import SqlAlchemyRepository


class LayerRepository(SqlAlchemyRepository):
    model = GlobalLayer