export interface IUpdateRequestBody {
  name: string
  status: number
  description?: string
  material?: string
  global_layers?: Array<string>
}
