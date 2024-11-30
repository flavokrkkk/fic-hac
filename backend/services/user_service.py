from uuid import uuid4
from pydantic import UUID4


from backend.database.models.location import UserLocation
from backend.database.models.user import User
from backend.dto.location_dto import AddUserLocationModel, BaseUserLocationModel
from backend.dto.user_dto import BaseUserModel, UserProfileModel
from backend.errors.user_errors import UserNotFoundError
from backend.repositories import UserRepository
from backend.services import BaseService


class UserService(BaseService):
    repository: UserRepository

    async def get_current_user(self, user_id: int) -> BaseUserModel:
        user = await self.repository.get_item(user_id)
        return await self.model_dump(user, BaseUserModel)
    
    async def get_profile(self, user_id: int) -> BaseUserModel:
        user = await self.repository.get_item(user_id)
        return await self.model_dump(user, UserProfileModel)
    
    async def get_user_saved_locations(self, user_id: int) -> list[BaseUserLocationModel]:
        user: User = await self.repository.get_item(user_id)
        return await self.dump_items(user.saved_locations, BaseUserLocationModel)
  