export interface IGeoObject {
  id: number
  type: string
  properties: {
    name: string
    type: string
    depth: number
  }
  geometry: {
    type: string
    coordinates: Array<Array<number>>
  }
}

export interface IGeoWrapper {
  type: string
  features: Array<IGeoObject>
}
