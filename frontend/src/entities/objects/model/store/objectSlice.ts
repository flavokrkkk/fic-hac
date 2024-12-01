import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit"
import { IObjectsState } from "./types"
import { IGeoObject } from "../types"
import { objectQuery } from "@shared/api/queryObject"

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
})

const initialState: IObjectsState = {
  isLoading: false,
  geoObjects: { type: "", features: [] },
  geoObjectType: [],
  filterGeoObjects: { type: "", features: [] },
  error: ""
}

export const objectSlice = createSliceWithThunks({
  name: "geoObjectsSlice",
  initialState,
  reducers: create => ({
    setManyFilterObjects: create.reducer(
      (
        state,
        {
          payload
        }: PayloadAction<{
          pipeline: string
          cable: string
          gasPipeline: string
          active: string
          waiting: string
          inactive: string
          depth: number | null
        }>
      ) => {
        const { pipeline, cable, gasPipeline, active, waiting, inactive, depth } = payload

        const types = [pipeline, cable, gasPipeline].filter(f => f)
        const statuses = [active, waiting, inactive].filter(f => f)

        state.filterGeoObjects = {
          ...state.geoObjects,
          features: state.geoObjects.features.filter(f => {
            const matchesType = types.length ? types.includes(f.properties.type) : true
            const matchesStatus = statuses.length ? statuses.includes(f.properties.status) : true
            const matchesDepth = depth ? f.properties.depth === depth : true

            return matchesType && matchesStatus && matchesDepth
          })
        }
      }
    ),
    setSearchObjects: create.reducer(
      (state, { payload }: PayloadAction<{ type: "type" | "name" | "depth"; value: string }>) => {
        state.filterGeoObjects = {
          ...state.geoObjects,
          features: state.geoObjects.features.filter(f =>
            f.properties.type.toLowerCase().includes(payload.value.toLowerCase())
          )
        }
      }
    ),
    getAllObjects: create.asyncThunk<Array<IGeoObject>, string, { rejectValue: string }>(
      async (params: string, { rejectWithValue }) => {
        try {
          const { data, status } = await objectQuery.get("/api/geo-object/", params)
          if (status !== 200) return rejectWithValue("Invalid status: " + status)
          return data
        } catch (e) {
          return rejectWithValue(`${e}`)
        }
      },
      {
        pending: state => {
          state.isLoading = true
        },
        fulfilled: (state, { payload }) => {
          const parseToGeoObject = {
            type: "FeatureCollection",
            features: payload
          }
          state.geoObjectType = [
            ...new Set(parseToGeoObject.features.map(object => object.properties.type))
          ]
          state.filterGeoObjects = {
            ...parseToGeoObject,
            features: parseToGeoObject.features.map(features => ({ ...features, type: "Feature" }))
          }
          state.geoObjects = {
            ...parseToGeoObject,
            features: parseToGeoObject.features.map(features => ({ ...features, type: "Feature" }))
          }
          state.isLoading = false
        },
        rejected: state => {
          state.isLoading = false
          state.error = "Failed to request!"
        }
      }
    )
  })
})

export const objectReducer = objectSlice.reducer
export const objectActions = objectSlice.actions
