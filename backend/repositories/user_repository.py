from backend.repositories.base import TortoiseRepository
from backend.database.models.user import User


class UserRepository(TortoiseRepository):
    model = User