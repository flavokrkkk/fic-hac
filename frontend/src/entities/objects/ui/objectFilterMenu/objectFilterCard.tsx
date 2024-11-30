import { EFilterStatusTypes, EFilterTypes } from "@shared/utils/filterType"
import { InputNumberProps, Menu, Slider } from "antd"
import clsx from "clsx"
import { FC } from "react"

interface IObjectFilterCard {
  filters: { pipeline: string; cable: string; gasPipeline: string }
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
  return (
    <section className=" flex flex-col justify-start">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-black text-lg">Фильтры</h1>
        <span className="text-black cursor-pointer" onClick={setCleanFilter}>
          очистить
        </span>
      </div>
      <section className="space-y-3">
        <div className="text-black space-y-2">
          <h3 className="text-black font-semibold">Тип коммуникации</h3>
          <div className="flex space-x-2">
            <button
              onClick={onCheckedFilter}
              value={`${EFilterTypes.PIPELINE}|pipeline`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                filters["pipeline"] && "bg-black text-white"
              )}
            >
              Трубопровод
            </button>
            <button
              onClick={onCheckedFilter}
              value={`${EFilterTypes.CABLE}|cable`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                filters["cable"] && "bg-black text-white"
              )}
            >
              Кабель
            </button>
            <button
              value={`${EFilterTypes.GAS_PIPELINE}|gasPipeline`}
              className={clsx(
                "border px-2 py-[2px] rounded-2xl",
                filters["gasPipeline"] && "bg-black text-white"
              )}
              onClick={onCheckedFilter}
            >
              Газопровод
            </button>
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
