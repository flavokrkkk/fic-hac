from enum import Enum


class StatusTypes(str, Enum):
    ACTIVE = "Активный",
    WAITING = "Ожидающий",
    INACTIVE = "Неактивный"

    