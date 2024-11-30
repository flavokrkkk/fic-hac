from fastapi import HTTPException


class GeoObjectNotFound(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="GeoObject not found",
        )
