import { useAppSelector } from "@shared/hooks/useAppSelector"
import { EFilterStatusTypes } from "@shared/utils/filterType"
import { InputNumberProps, Menu, Slider } from "antd"
import clsx from "clsx"
import { FC } from "react"
import { objectSelector } from "../../model"

interface IObjectFilterCard {
  filters: Record<string, string>
  statusFilter: {
    active: string
    waiting: string
    inactive: string
  }
  rangeValue: number
  onRangeValue: InputNumberProps["onChange"]
  onCheckedFilter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onCheckedStatusFilter: (event: React.MouseEvent<HTMLButtonElement>) => void
  setCleanFilter: () => void
}

const ObjectFilterCard: FC<IObjectFilterCard> = ({
  filters,
  rangeValue,
  onRangeValue,
  statusFilter,
  onCheckedFilter,
  onCheckedStatusFilter,
  setCleanFilter
}) => {
  const { geoObjectType } = useAppSelector(objectSelector)

  return (
    <section className=" flex flex-col justify-start">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-black text-lg">Фильтры</h1>
        <span className="text-black cursor-pointer" onClick={setCleanFilter}>
          очистить
        </span>
      </div>
      <section className="space-y-3">
        <div className="text-black space-y-4">
          <h3 className="text-black font-semibold text-lg">Тип коммуникации</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(geoObjectType).map(key => (
              <button
                key={key}
                onClick={onCheckedFilter}
                value={`${key}|${key}`}
                className={clsx(
                  "border px-2 py-1 rounded-2xl text-sm",
                  filters[key] && "bg-black text-white"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-black font-semibold">Статус коммуникации</h3>
          <div className="flex space-x-2 text-black">
            <button
              onClick={onCheckedStatusFilter}
              value={`${EFilterStatusTypes.ACTIVE}|active`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                statusFilter["active"] && "bg-black text-white"
              )}
            >
              Активные
            </button>
            <button
              onClick={onCheckedStatusFilter}
              value={`${EFilterStatusTypes.INACTIVE}|inactive`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                statusFilter["inactive"] && "bg-black text-white"
              )}
            >
              Неактивные
            </button>
            <button
              value={`${EFilterStatusTypes.WAITING}|waiting`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                statusFilter["waiting"] && "bg-black text-white"
              )}
              onClick={onCheckedStatusFilter}
            >
              Ожидающие
            </button>
          </div>
        </div>
        <Menu.Item key="3">
          <h3 className="text-black font-semibold">Глубина залегания</h3>
          <Slider value={rangeValue} onChange={onRangeValue} />;
        </Menu.Item>
      </section>
    </section>
  )
}

export default ObjectFilterCard
