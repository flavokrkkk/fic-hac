import { IGeoObject } from "@entities/objects"
import { axiosWithAuth } from "../baseQuery"
import { AxiosResponse } from "axios"

export const objectQuery = {
  get: (url: string, query: string = ""): Promise<AxiosResponse<Array<IGeoObject>>> =>
    axiosWithAuth.get(query ? `${url}?global_layers=${query}` : url)
}
