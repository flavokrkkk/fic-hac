export const enum EFilterTypes {
  PIPELINE = "Трубопровод",
  CABLE = "Кабель",
  GAS_PIPELINE = "Газопровод"
}

export const enum EFilterStatusTypes {
  ACTIVE = "Активный",
  WAITING = "Ожидающий",
  INACTIVE = "Неактивный",
  WORK = "В работе"
}

export const enum EMapTypes {
  UNDERGROUND = "Подземный",
  ABOVEGROUND = "Надземный"
}

export const enum EMapTypesParse {
  UNDERGROUND = "underground",
  ABOVEGROUND = "aboveground"
}

export const mapTypesParse: Record<EMapTypes, EMapTypesParse> = {
  [EMapTypes.ABOVEGROUND]: EMapTypesParse.ABOVEGROUND,
  [EMapTypes.UNDERGROUND]: EMapTypesParse.UNDERGROUND
}
