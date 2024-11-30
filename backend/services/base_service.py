from fastapi import HTTPException
from pydantic import BaseModel

from backend.database.models.base import Base
from backend.repositories import BaseRepository
from backend.utils.s3_client import S3Client


class BaseService:
    def __init__(self, repository: BaseRepository, s3_client: S3Client = None):
        self.repository = repository
        self.s3_client: S3Client = s3_client

    @staticmethod
    async def check_item(item, error: HTTPException) -> None:
        if not item:
            raise error

    @staticmethod
    async def model_dump(db_model: Base, dto_model: BaseModel) -> BaseModel:
        return dto_model.model_validate(db_model, from_attributes=True)

    async def dump_items(
        self, db_models: list[Base], dto_model: BaseModel
    ) -> list[BaseModel] | list:
        return [await self.model_dump(model, dto_model) for model in db_models]
