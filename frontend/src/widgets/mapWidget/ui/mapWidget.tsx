import { ChangeEvent, FC, useEffect, useRef, useState, useCallback, memo } from "react"
import { Viewer, GeoJsonDataSource } from "resium"
import { Viewer as CesiumViewer } from "cesium"
import { IGeoWrapper } from "@entities/objects"
import { Button, Dropdown, InputNumberProps, Modal, Segmented, Select } from "antd"
import { useGeoObject } from "@shared/hooks/useGeoObject"
import { useMapRender } from "@shared/hooks/useMapRender"
import Search from "antd/es/input/Search"
import ObjectFilterMenu from "@entities/objects/ui/objectFilterMenu/objectFilterMenu"
import { useActions } from "@shared/hooks/useActions"
import { valueType } from "antd/es/statistic/utils"
import ArrowIcon from "@shared/assets/social/arrowIcon"
import DetailObjectInfo from "@entities/objects/ui/detailObjectInfo/detailObjectInfo"
import { layerOptions } from "@shared/mocks/layers"
import { EActiveWatches } from "@shared/utils"

interface IMapWidget {
  geoObjects: IGeoWrapper
}
const MapWidget: FC<IMapWidget> = memo(({ geoObjects }) => {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [values, setValues] = useState("")
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<string>("Выбрать слой")
  const [filters, setFilters] = useState<{ pipeline: string; cable: string; gasPipeline: string }>({
    pipeline: "",
    cable: "",
    gasPipeline: ""
  })
  const [statusFilters, setStatusFilters] = useState<{
    active: string
    waiting: string
    inactive: string
  }>({
    active: "",
    inactive: "",
    waiting: ""
  })

  const [inputValue, setInputValue] = useState(0)

  const onChange: InputNumberProps["onChange"] = useCallback((newValue: valueType | null) => {
    setInputValue(Number(newValue) as number)
  }, [])
  const { setManyFilterObjects, setSearchObjects } = useActions()

  const {
    handleLoad,
    isModalVisible,
    selectedObject,
    handleOk,
    handleCancel,
    handleChangeWatches
  } = useGeoObject(viewerRef)

  const handleSearchValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues(event.target.value)
      setSearchObjects({ type: "type", value: event.target.value })
    },
    [setSearchObjects]
  )

  const handleCheckFilter = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const [value, key] = event.currentTarget.value.split("|")
      if (filters[key as keyof typeof filters] === value) {
        setFilters(prevState => ({ ...prevState, [key]: "" }))
        return
      }
      setFilters(prevState => ({ ...prevState, [key]: value }))
    },
    [filters]
  )

  const handleCheckStatusFilter = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const [value, key] = event.currentTarget.value.split("|")
      if (statusFilters[key as keyof typeof statusFilters] === value) {
        setStatusFilters(prevState => ({ ...prevState, [key]: "" }))
        return
      }
      setStatusFilters(prevState => ({ ...prevState, [key]: value }))
    },
    [statusFilters]
  )

  const setCleanFilter = useCallback(() => {
    setFilters({
      pipeline: "",
      cable: "",
      gasPipeline: ""
    })
    setStatusFilters({
      active: "",
      inactive: "",
      waiting: ""
    })
    setInputValue(0)
  }, [])

  const handleMapClick = () => setDropdownVisible(false)

  const handleChange = (value: string) => setSelectedLayer(value)

  useMapRender(viewerRef)
  useEffect(() => {
    setManyFilterObjects({ ...statusFilters, ...filters, depth: inputValue })
  }, [statusFilters, filters, inputValue])

  return (
    <div className="relative">
      <Viewer
        ref={ref => {
          viewerRef.current = ref?.cesiumElement || null
        }}
        onClick={handleMapClick}
        navigationHelpButton={false}
        timeline={false}
        animation={false}
        fullscreenButton={false}
        homeButton={false}
        sceneModePicker={false}
        geocoder={false}
        baseLayerPicker={false}
      >
        <div className="absolute top-[10px] left-10 z-10 flex space-x-3">
          <Dropdown
            overlay={
              <ObjectFilterMenu
                rangeValue={inputValue}
                filters={filters}
                statusFilter={statusFilters}
                geoObjects={geoObjects}
                onRangeValue={onChange}
                onCheckedStatusFilter={handleCheckStatusFilter}
                onCheckedFilter={handleCheckFilter}
                setCleanFilter={setCleanFilter}
              />
            }
            trigger={["click"]}
            placement="bottomLeft"
            visible={dropdownVisible}
            onVisibleChange={setDropdownVisible}
          >
            <Button>
              <ArrowIcon />
            </Button>
          </Dropdown>
          <Segmented<EActiveWatches>
            options={[EActiveWatches.WATHES_ICON, EActiveWatches.WATCHES_LINE]}
            onChange={handleChangeWatches}
          />
        </div>
        <div className="absolute top-[10px] right-10 z-10 space-x-3">
          <Select
            value={selectedLayer}
            className="w-[280px]"
            onChange={handleChange}
            options={layerOptions}
            defaultValue={"Выбрать слой"}
          />
          <Search
            value={values}
            placeholder="Найдите нужную коммуникацию"
            className="w-[280px]"
            onChange={handleSearchValue}
          />
        </div>

        <GeoJsonDataSource data={geoObjects} onLoad={handleLoad} />
      </Viewer>
      <Modal
        title="Информация об объекте"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Закрыть
          </Button>
        ]}
        width={600}
      >
        <DetailObjectInfo selectedObject={selectedObject} />
      </Modal>
    </div>
  )
})

export default MapWidget
