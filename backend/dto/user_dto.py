from pydantic import BaseModel


class BaseUserModel(BaseModel):
    id: int
    username: str
    email: str


class UserProfileModel(BaseUserModel):
    pass
