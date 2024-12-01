from uuid import uuid4
from pydantic import UUID4


from backend.database.models.user import User
from backend.dto.user_dto import BaseUserModel, UserProfileModel
from backend.errors.user_errors import UserAlreadySaveObjectError, UserNotFoundError
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

    async def add_user_geo_object(self, user_id: int, geo_object_id: int):
        if await self.repository.check_exist_object_in_saved(user_id, geo_object_id):
            raise UserAlreadySaveObjectError()
        await self.repository.add_user_geo_object(user_id, geo_object_id)
