import FilterIcon from "@shared/assets/social/filterIcon"
import { Collapse, InputNumberProps, Menu, Tooltip } from "antd"
import Search from "antd/es/input/Search"
import { ChangeEvent, FC, useState } from "react"
import { IGeoWrapper } from "../../model"
import { useActions } from "@shared/hooks/useActions"
import ObjectFilterCard from "./objectFilterCard"
import DetailObjectCard from "../detailObjectInfo/detailObjectCard"
import CollapsePanel from "antd/es/collapse/CollapsePanel"
import SavedObject from "../savedObject/savedObject"

interface IObjectFilterMenu {
  geoObjects: IGeoWrapper
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
  const { setSearchObjects, setSavedObjects } = useActions()

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
            <CollapsePanel
              header={<SavedObject object={object} setSavedObjects={setSavedObjects} />}
              key={object.id}
            >
              <DetailObjectCard object={object} key={object.id} />
            </CollapsePanel>
          ))}
        </Collapse>
      </section>
    </Menu>
  )
}

export default ObjectFilterMenu
