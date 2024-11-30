import { FC, useEffect, useMemo, useRef, useState } from "react"
import { Cartesian3 } from "cesium"
import { Viewer, GeoJsonDataSource } from "resium"
import { Viewer as CesiumViewer } from "cesium"
import { IGeoWrapper } from "@entities/objects"
import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { EFilterTypes } from "@/shared/utils/filterType"

interface IMapWidget {
  geoObjects: IGeoWrapper
  setFilterObjects: (type: EFilterTypes) => void
}
const MapWidget: FC<IMapWidget> = ({ geoObjects, setFilterObjects }) => {
  const viewerRef = useRef<CesiumViewer | null>(null)
  const [selectValue, setSelectValue] = useState("")

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

  useEffect(() => {
    const interval = setInterval(() => {
      const viewer = viewerRef.current

      if (viewer) {
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(37.605241, 55.729054, 1000),
          orientation: {
            heading: 0.0,
            pitch: -1.5,
            roll: 0.0
          }
        })
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="relative">
      <Viewer
        ref={ref => {
          viewerRef.current = ref?.cesiumElement || null
        }}
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

        <GeoJsonDataSource data={geoObjects} />
      </Viewer>
    </div>
  )
}

export default MapWidget
