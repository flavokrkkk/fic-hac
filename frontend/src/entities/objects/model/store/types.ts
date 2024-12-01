import { IGeoWrapper } from "../types/types"

export interface IObjectsState {
  isLoading: boolean
  geoObjects: IGeoWrapper
  geoObjectType: Array<string>
  filterGeoObjects: IGeoWrapper
  error: string
}
