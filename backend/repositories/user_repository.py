from sqlalchemy import select
from backend.repositories.base import SqlAlchemyRepository
from backend.database.models.user import User, UserGeoObject


class UserRepository(SqlAlchemyRepository):
    model = User

    async def check_exist_object_in_saved(self, user_id: int, geo_object_id: int):
        check_exist = (
            await self.session.execute(
                select(UserGeoObject).where(
                    UserGeoObject.user_id == user_id,
                    UserGeoObject.geo_object_id == geo_object_id
                )
            )
        ).scalar_one_or_none()
        return check_exist
    
    async def add_user_geo_object(self, user_id: int, geo_object_id: int):
        

        new_saved = UserGeoObject(user_id=user_id, geo_object_id=geo_object_id)
        self.session.add(new_saved)
        await self.session.commit()