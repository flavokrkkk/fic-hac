import { useActions } from "@shared/hooks/useActions"
import { objectSelector } from "@entities/objects/model/store/selectors"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import MapWidget from "@widgets/mapWidget/ui/mapWidget"

const ObjectPage = () => {
  const { filterGeoObjects } = useAppSelector(objectSelector)
  const { setFilterObjects } = useActions()

  return (
    <div className="h-full">
      <MapWidget geoObjects={filterGeoObjects} setFilterObjects={setFilterObjects} />
    </div>
  )
}

export default ObjectPage
