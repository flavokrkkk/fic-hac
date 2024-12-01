import { IGeoObject, IGeoObjectStatus } from "@entities/objects"
import { axiosWithAuth } from "../baseQuery"
import { AxiosResponse } from "axios"
import { IUpdateRequestBody } from "./types"

export const objectQuery = {
  get: (
    url: string,
    query: { query: string; is_negative: boolean }
  ): Promise<AxiosResponse<Array<IGeoObject>>> =>
    axiosWithAuth.get(query.query ? `${url}?global_layers=${query.query}` : url, {
      params: { is_negative: query.is_negative }
    }),
  put: (url: string, body: IUpdateRequestBody): Promise<AxiosResponse<IGeoObject>> =>
    axiosWithAuth.put(url, body),
  getStatus: (url: string): Promise<AxiosResponse<Array<IGeoObjectStatus>>> =>
    axiosWithAuth.get(url),
  savedObject: (url: string, requestParam: { body: IGeoObject; geoObjectId: number }) =>
    axiosWithAuth.post(`${url}?geo_object_id=${requestParam.geoObjectId}`, requestParam.body),
  getObject: (url: string): Promise<AxiosResponse<Array<IGeoObject>>> => axiosWithAuth.get(url)
}
