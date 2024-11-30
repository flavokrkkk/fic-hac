import { ChangeEvent, FC, useEffect, useRef, useState, useCallback } from "react"
import { Viewer, GeoJsonDataSource } from "resium"
import { Viewer as CesiumViewer } from "cesium"
import { IGeoWrapper } from "@entities/objects"
import {
  Button,
  Descriptions,
  Divider,
  Dropdown,
  InputNumberProps,
  Modal,
  Space,
  Statistic,
  Typography
} from "antd"
import { useGeoObject } from "@shared/hooks/useGeoObject"
import { useMapRender } from "@shared/hooks/useMapRender"
import Search from "antd/es/input/Search"
import ObjectFilterMenu from "@entities/objects/ui/objectFilterMenu/objectFilterMenu"
import { useActions } from "@shared/hooks/useActions"
import { Card } from "antd"
import { valueType } from "antd/es/statistic/utils"
import InfoIcon from "@shared/assets/social/infoIcon"
import CheckIcon from "@shared/assets/social/checkIcon"
import CloseIcon from "@shared/assets/social/closeIcon"
const { Title, Text } = Typography

interface IMapWidget {
  geoObjects: IGeoWrapper
}
const MapWidget: FC<IMapWidget> = ({ geoObjects }) => {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [values, setValues] = useState("")
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

  const { handleLoad, isModalVisible, selectedObject, handleOk, handleCancel } =
    useGeoObject(viewerRef)

  useMapRender(viewerRef)

  const handleSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValues(event.target.value)
    setSearchObjects({ type: "type", value: event.target.value })
  }

  const handleCheckFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    const [value, key] = event.currentTarget.value.split("|")
    if (filters[key as keyof typeof filters] === value) {
      setFilters(prevState => ({ ...prevState, [key]: "" }))
      return
    }
    setFilters(prevState => ({ ...prevState, [key]: value }))
  }

  const handleCheckStatusFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    const [value, key] = event.currentTarget.value.split("|")
    console.log(statusFilters[key as keyof typeof statusFilters], value, key)
    if (statusFilters[key as keyof typeof statusFilters] === value) {
      setStatusFilters(prevState => ({ ...prevState, [key]: "" }))
      return
    }
    setStatusFilters(prevState => ({ ...prevState, [key]: value }))
  }

  const setCleanFilter = () => {
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
  }

  useEffect(() => {
    setManyFilterObjects({ ...statusFilters, ...filters, depth: inputValue })
  }, [statusFilters, filters, inputValue])
  return (
    <div className="relative">
      <Viewer
        ref={ref => {
          viewerRef.current = ref?.cesiumElement || null
        }}
        navigationHelpButton={false}
        timeline={false}
        animation={false}
        fullscreenButton={false}
        homeButton={false}
        sceneModePicker={false}
        geocoder={false}
        baseLayerPicker={false}
      >
        <div className="absolute top-[10px] left-10 z-10">
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
          >
            <Button>Фильтры</Button>
          </Dropdown>
        </div>
        <div className="absolute top-[10px] right-10 z-10">
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
        {selectedObject ? (
          <div>
            <Card
              hoverable
              bordered={false}
              cover={<img alt="object" src="/path_to_image_or_icon.svg" />}
              style={{ marginBottom: 20 }}
            >
              <Title level={4}>{selectedObject.properties.name}</Title>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Тип" span={3}>
                  <Text>{selectedObject.properties.type}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Статус" span={3}>
                  <Text
                    type={selectedObject.properties.status === "Активный" ? "success" : "danger"}
                  >
                    {selectedObject.properties.status}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Глубина (м)" span={3}>
                  <Statistic value={selectedObject.properties.depth} suffix="м" />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {selectedObject.properties.status === "Активный" ? (
                <Space size="middle" style={{ color: "green" }}>
                  <div className="flex space-x-2 items-center">
                    <CheckIcon />
                    <Text strong>Объект активен</Text>
                  </div>
                </Space>
              ) : (
                <Space size="middle" style={{ color: "red" }}>
                  <div className="flex space-x-2 items-center">
                    <CloseIcon />
                    <Text strong>Объект неактивен</Text>
                  </div>
                </Space>
              )}
            </Space>

            <Divider />
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={5}>Дополнительная информация</Title>
              <div className="flex space-x-2">
                <InfoIcon />
                <Text italic>
                  Данный объект представляет собой важную коммуникацию для инфраструктуры города.
                </Text>
              </div>
            </Space>
          </div>
        ) : (
          <Text>Информация не доступна.</Text>
        )}
      </Modal>
    </div>
  )
}

export default MapWidget
