from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.models.base import Base


class User(Base):
    __tablename__ = "users"
    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]

    saved_objects = relationship(
        "GeoObject", back_populates="users_who_saved", lazy="selectin", secondary="users_geo_objects"
    )


class UserGeoObject(Base):
    __tablename__ = "users_geo_objects"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    geo_object_id: Mapped[int] = mapped_column(ForeignKey("geo_objects.id"))