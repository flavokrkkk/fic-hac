from fastapi import HTTPException


class StatusNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Status not found")