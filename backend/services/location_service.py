import aiohttp
from fastapi import HTTPException
from backend.database.models.location import UserLocation
from backend.dto.location_dto import (
    AddUserLocationModel,
    BaseUserLocationModel,
)
from backend.repositories.base import BaseRepository
from backend.services.base_service import BaseService
from backend.utils.config.config import load_cesium_api_key
from backend.utils.s3_client import S3Client


class LocationService(BaseService):
    async def add_location_to_user_saved(
        self, user_id: int, form: AddUserLocationModel
    ) -> BaseUserLocationModel:
        new_location = await self.repository.add_item(
            user_id=user_id, **form.model_dump()
        )
        return await self.model_dump(new_location, BaseUserLocationModel)
