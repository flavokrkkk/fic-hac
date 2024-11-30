from sqlalchemy.orm import Mapped, relationship
from backend.database.models.base import Base
from backend.database.models.location import UserLocation


class User(Base):
    __tablename__ = "users"
    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]

    saved_locations: Mapped[list['UserLocation']] = relationship(
        "UserLocation", back_populates="user", lazy="selectin"
    )
