import { useActions } from "@shared/hooks/useActions"
import { objectSelector } from "@entities/objects/model/store/selectors"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import MapWidget from "@widgets/mapWidget/ui/mapWidget"
import { useEffect, useState } from "react"

const ObjectPage = () => {
  const { filterGeoObjects } = useAppSelector(objectSelector)
  const { getAllObjects } = useActions()
  const [selectedLayer, setSelectedLayer] = useState<string>("Выбрать слой")

  const handleChange = (value: string) => setSelectedLayer(value)

  useEffect(() => {
    getAllObjects(["Выбрать слой", "Выбрать все"].includes(selectedLayer) ? "" : selectedLayer)
  }, [selectedLayer])

  return (
    <div className="h-full">
      <MapWidget
        geoObjects={filterGeoObjects}
        selectedLayer={selectedLayer}
        handleChange={handleChange}
      />
    </div>
  )
}

export default ObjectPage
