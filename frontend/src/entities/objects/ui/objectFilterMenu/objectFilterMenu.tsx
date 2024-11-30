import FilterIcon from "@shared/assets/social/filterIcon"
import { Collapse, InputNumberProps, Menu, Tooltip } from "antd"
import Search from "antd/es/input/Search"
import { ChangeEvent, FC, useState } from "react"
import { IGeoWrapper } from "../../model"
import CollapsePanel from "antd/es/collapse/CollapsePanel"
import { useActions } from "@shared/hooks/useActions"
import ObjectFilterCard from "./objectFilterCard"
import PenIcon from "@shared/assets/social/penIcon"

interface IObjectFilterMenu {
  geoObjects: IGeoWrapper
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
const ObjectFilterMenu: FC<IObjectFilterMenu> = ({
  geoObjects,
  filters,
  rangeValue,
  statusFilter,
  onRangeValue,
  onCheckedStatusFilter,
  onCheckedFilter,
  setCleanFilter
}) => {
  const { setSearchObjects } = useActions()

  const [objectValue, setObjectValue] = useState("")

  const handleSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setObjectValue(event.target.value)
    setSearchObjects({ type: "type", value: event.target.value })
  }

  return (
    <Menu className="w-[416px]  h-[673px] overflow-auto">
      <section className="space-y-3 p-3">
        <h1 className="font-bold text-lg">Список комуникаций</h1>
        <div className="flex justify-between items-center">
          <Search
            className="w-[280px]"
            placeholder="Поиск"
            value={objectValue}
            onChange={handleSearchValue}
          />
          <Tooltip
            placement="bottom"
            color="white"
            overlayInnerStyle={{ padding: "16px", width: "350px", borderRadius: "20px" }}
            title={
              <ObjectFilterCard
                rangeValue={rangeValue}
                filters={filters}
                statusFilter={statusFilter}
                onRangeValue={onRangeValue}
                onCheckedFilter={onCheckedFilter}
                onCheckedStatusFilter={onCheckedStatusFilter}
                setCleanFilter={setCleanFilter}
              />
            }
          >
            <div>
              <FilterIcon />
            </div>
          </Tooltip>
        </div>
        <Collapse>
          {geoObjects.features.map(object => (
            <CollapsePanel header={object.properties.name} key={object.id}>
              <section className="flex flex-col space-y-2">
                <div>
                  <section className="flex items-center space-x-2">
                    <h1 className="font-medium">Название</h1>
                    <span className="mt-[2px]">
                      <PenIcon />
                    </span>
                  </section>
                  <p className="leading-3 text-xs">{object.properties.name}</p>
                </div>
                <div>
                  <section className="flex items-center space-x-2">
                    <h1 className="font-medium">Тип коммуникации</h1>
                  </section>

                  <p className="leading-3 text-xs">{object.properties.type}</p>
                </div>
                <div>
                  <section className="flex items-center space-x-2">
                    <h1 className="font-medium">Глубина залегания</h1>
                  </section>
                  <p className="leading-3 text-xs">{object.properties.depth}</p>
                </div>
                <div>
                  <section className="flex items-center space-x-2">
                    <h1 className="font-medium">Статус</h1>
                    <span className="mt-[2px]">
                      <PenIcon />
                    </span>
                  </section>
                  <p className="leading-3 text-xs">{object.properties.status}</p>
                </div>
              </section>
            </CollapsePanel>
          ))}
        </Collapse>
      </section>
    </Menu>
  )
}

export default ObjectFilterMenu
