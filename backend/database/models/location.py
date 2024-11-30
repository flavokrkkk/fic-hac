from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.models.base import Base

class UserLocation(Base):
    __tablename__ = 'user_locations'

    name: Mapped[str]
    lat: Mapped[float]
    long: Mapped[float]
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    user = relationship("User", back_populates="saved_locations")