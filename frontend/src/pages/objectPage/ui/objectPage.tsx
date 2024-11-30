import { objectSelector } from "@entities/objects/model/store/selectors"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import MapWidget from "@widgets/mapWidget/ui/mapWidget"

const ObjectPage = () => {
  const { filterGeoObjects } = useAppSelector(objectSelector)

  return (
    <div className="h-full">
      <MapWidget geoObjects={filterGeoObjects} />
    </div>
  )
}

export default ObjectPage
