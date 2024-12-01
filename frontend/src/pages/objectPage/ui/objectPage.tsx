import { useActions } from "@shared/hooks/useActions"
import { objectSelector } from "@entities/objects/model/store/selectors"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import MapWidget from "@widgets/mapWidget/ui/mapWidget"
import { useEffect, useState } from "react"

const ObjectPage = () => {
  const { filterGeoObjects } = useAppSelector(objectSelector)
  const { getAllObjects, getStatusObject } = useActions()
  const [selectedLayer, setSelectedLayer] = useState<string>("Выбрать слой")
  const [selectedMapType, setSelectedMapType] = useState<boolean>(false)

  const handleChange = (value: string) => setSelectedLayer(value)
  const handleChangeMapType = (value: boolean) => setSelectedMapType(value)

  useEffect(() => {
    getAllObjects(
      ["Выбрать слой", "Выбрать все"].includes(selectedLayer)
        ? { query: "", is_negative: selectedMapType }
        : { query: selectedLayer, is_negative: selectedMapType }
    )
  }, [selectedLayer, selectedMapType])

  useEffect(() => {
    getStatusObject()
  }, [])

  return (
    <div className="h-full">
      <MapWidget
        geoObjects={filterGeoObjects}
        selectedLayer={selectedLayer}
        handleChange={handleChange}
        handleChangeMapType={handleChangeMapType}
      />
    </div>
  )
}

export default ObjectPage
