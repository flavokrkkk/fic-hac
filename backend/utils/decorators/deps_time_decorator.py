from functools import wraps
from time import perf_counter
from typing import Any, AsyncGenerator, Awaitable, Callable, TypeVar, Union


R = TypeVar("R")


def measure_execution_time(
    func: Callable[..., Union[Awaitable[R], AsyncGenerator[Any, None]]],
) -> Callable[..., Union[Awaitable[R], AsyncGenerator[Any, None]]]:
    @wraps(func)
    async def wrapper(
        *args: Any, **kwargs: Any
    ) -> Union[R, AsyncGenerator[Any, None]]:
        start_time = perf_counter()

        if func.__name__ == "get_s3_client":

            async def generator_wrapper() -> AsyncGenerator[Any, None]:
                async for value in func(*args, **kwargs):
                    yield value

                process_time = perf_counter() - start_time
                print(
                    f"Execution time of {func.__name__}: {process_time} seconds"
                )

            return generator_wrapper()

        else:
            result = await func(*args, **kwargs)
            process_time = perf_counter() - start_time
            print(
                f"Execution time of {func.__name__}: {process_time:.4f} seconds"
            )
            return result

    return wrapper
