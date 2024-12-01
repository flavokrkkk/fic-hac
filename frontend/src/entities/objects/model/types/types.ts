export interface IGeoObject {
  id: number
  type: string
  properties: {
    name: string
    type: string
    depth: number
    description: string
    material: string
    status: string
  }
  global_layers: Array<string>
  image: string
  is_saved: boolean
  geometry: {
    type: string
    coordinates: Array<Array<number>>
  }
}

export interface IGeoWrapper {
  type: string
  features: Array<IGeoObject>
}

export interface IGeoObjectStatus {
  id: number
  name: string
}
