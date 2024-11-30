import asyncio
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.database.connection.mock_db import create_test_db
import backend.routers as routers

# from backend.utils.dependencies import get_current_user_dependency
from backend.database.connection.connection import DatabaseConnection
from backend.utils.config.config import load_database_config
from backend.utils.dependencies.dependencies import get_current_user_dependency, get_session


async def lifespan(app: FastAPI):
    app.state.db_connection = await DatabaseConnection()()
    try:
        session = await app.state.db_connection.get_session()
        await create_test_db(session=session)
    finally:
        await session.close()
    yield


app = FastAPI(lifespan=lifespan)
PROTECTED = Depends(get_current_user_dependency)


origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(routers.auth_router)
app.include_router(routers.location_router, dependencies=[PROTECTED])
app.include_router(routers.user_router)
app.include_router(routers.geo_object_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    try:
        errors = []

        for error in exc.errors():
            field = error["loc"]
            input = error["input"]
            message = error["msg"]

            if isinstance(input, dict):
                input = input.get(field[-1])

            errors.append(
                {
                    "location": " -> ".join(field),
                    "detail": message,
                    "input": input,
                }
            )

        return JSONResponse(content=errors, status_code=422)
    except TypeError:
        return JSONResponse(
            status_code=422, content={"detail": "invalid json"}
        )
