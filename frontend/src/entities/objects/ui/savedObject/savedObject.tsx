import { FC } from "react"
import { IGeoObject } from "../../model"
import StarIcon from "@shared/assets/panel/starIcon"

interface ISavedObject {
  object: IGeoObject
  setSavedObjects: (body: { body: IGeoObject; geoObjectId: number }) => void
}
const SavedObject: FC<ISavedObject> = ({ object, setSavedObjects }) => {
  const handleSavedObject = () => {
    setSavedObjects({ body: object, geoObjectId: object.id })
  }

  return (
    <div className="flex justify-between">
      <h2>{object.properties.name}</h2>
      <span
        onClick={handleSavedObject}
        className={object.is_saved ? "text-blue-500" : "text-black"}
      >
        <StarIcon />
      </span>
    </div>
  )
}

export default SavedObject
