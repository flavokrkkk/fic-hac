import { FC, useMemo, useRef, useState } from "react"
import { Viewer, GeoJsonDataSource } from "resium"
import { Viewer as CesiumViewer } from "cesium"
import { IGeoWrapper } from "@entities/objects"
import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { EFilterTypes } from "@shared/utils/filterType"
import { useGeoObject } from "@shared/hooks/useGeoObject"
import { useMapRender } from "@shared/hooks/useMapRender"

interface IMapWidget {
  geoObjects: IGeoWrapper
  setFilterObjects: (type: EFilterTypes) => void
}
const MapWidget: FC<IMapWidget> = ({ geoObjects, setFilterObjects }) => {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [selectValue, setSelectValue] = useState("")
  const { handleLoad } = useGeoObject(viewerRef)

  const objectOptions = useMemo(
    () =>
      geoObjects.features.reduce((acc, item) => {
        acc.push({ label: item.properties.type, value: item.id.toString() })

        return acc
      }, [] as Array<DefaultOptionType>),
    [geoObjects]
  )

  const handleChangeValue = (value: string) => {
    setSelectValue(value)
    setFilterObjects(value as EFilterTypes)
  }

  useMapRender(viewerRef)

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
        <div className="absolute top-[10px] left-[10px] z-10">
          <Select
            value={selectValue}
            onChange={handleChangeValue}
            className="w-[280px]"
            options={objectOptions}
            defaultValue={"Все объекты"}
          />
        </div>

        <GeoJsonDataSource data={geoObjects} onLoad={handleLoad} />
      </Viewer>
    </div>
  )
}

export default MapWidget
