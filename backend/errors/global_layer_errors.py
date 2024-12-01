from fastapi import HTTPException


class LayerNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Layer not found")