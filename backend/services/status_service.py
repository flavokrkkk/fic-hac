from backend.dto.geo_object import StatusModel
from backend.errors.status_errors import StatusNotFoundError
from backend.repositories.status_repository import StatusRepository
from backend.services.base_service import BaseService


class StatusService(BaseService):
    repository: StatusRepository

    async def get_statuses(self) -> list[StatusModel]:
        statuses = await self.repository.get_all_items()
        return await self.dump_items(statuses, StatusModel)
    
    async def check_status_exist(self, status_id: int):
        status = await self.repository.get_item(status_id)
        await self.check_item(status, StatusNotFoundError)