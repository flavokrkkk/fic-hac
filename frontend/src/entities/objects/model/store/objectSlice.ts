import { asyncThunkCreator, buildCreateSlice, PayloadAction } from "@reduxjs/toolkit"
import { IObjectsState } from "./types"
import { IGeoObject } from "../types"
import { objectQuery } from "@shared/api/queryObject"
import { IUpdateRequestBody } from "@/shared/api/queryObject/types"

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
})

const initialState: IObjectsState = {
  isLoading: false,
  geoObjects: { type: "", features: [] },
  geoObjectType: {},
  savedObjects: { type: "", features: [] },
  filterGeoObjects: { type: "", features: [] },
  statusObject: [],
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
          filters: Record<string, string>
          active: string
          waiting: string
          inactive: string
          depth: number | null
        }>
      ) => {
        const { filters, active, waiting, inactive, depth } = payload

        const statuses = [active, waiting, inactive].filter(f => f)

        state.filterGeoObjects = {
          ...state.geoObjects,
          features: state.geoObjects.features.filter(f => {
            const matchesFilters = Object.values(filters).some(
              filterType => f.properties.type === filterType
            )

            const matchesStatus = statuses.length ? statuses.includes(f.properties.status) : true

            const matchesTypes = Object.values(filters).filter(f => f).length
              ? matchesFilters
              : true

            const matchesDepth = depth ? f.properties.depth === depth : true

            return matchesTypes && matchesStatus && matchesDepth
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
    getAllObjects: create.asyncThunk<
      Array<IGeoObject>,
      { query: string; is_negative: boolean },
      { rejectValue: string }
    >(
      async (params, { rejectWithValue }) => {
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
            features: payload.map(feature => ({
              ...feature,
              properties: { ...feature.properties, image: feature.image }
            }))
          }
          state.geoObjectType = parseToGeoObject.features.reduce((acc, item) => {
            if (!acc[item.properties.type]) {
              acc[item.properties.type] = ""
            }
            return acc
          }, {} as Record<string, string>)
          state.filterGeoObjects = parseToGeoObject
          state.geoObjects = parseToGeoObject
          state.isLoading = false
        },
        rejected: state => {
          state.isLoading = false
          state.error = "Failed to request!"
        }
      }
    ),
    updateObject: create.asyncThunk<
      IGeoObject,
      { body: IUpdateRequestBody; id: number },
      { rejectValue: string }
    >(
      async ({ body, id }, { rejectWithValue }) => {
        try {
          const { data } = await objectQuery.put(`/api/geo-object/${id}`, body)
          return data
        } catch (err) {
          return rejectWithValue(`${err}`)
        }
      },
      {
        pending: state => {
          state.isLoading = true
        },
        fulfilled: (state, { payload }) => {
          const searchObject = state.geoObjects.features.findIndex(feat => feat.id === payload.id)
          if (searchObject !== -1) {
            state.geoObjects.features[searchObject] = payload
          }
          state.isLoading = false
        },
        rejected: state => {
          state.isLoading = false
          state.error = "Invalid Request!"
        }
      }
    ),
    getStatusObject: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data } = await objectQuery.getStatus("/api/status/")
          return data
        } catch (err) {
          return rejectWithValue(`${err}`)
        }
      },
      {
        pending: state => {
          state.isLoading = true
        },
        fulfilled: (state, { payload }) => {
          state.statusObject = payload
          state.isLoading = false
        },
        rejected: state => {
          state.error = "Invalid Request!"
          state.isLoading = false
        }
      }
    ),

    setSavedObjects: create.asyncThunk(
      async (requestParam: { body: IGeoObject; geoObjectId: number }, { rejectWithValue }) => {
        try {
          await objectQuery.savedObject("/api/user/saved-objects", requestParam)
          return requestParam.body
        } catch (err) {
          return rejectWithValue(`${err}`)
        }
      },
      {
        pending: state => {
          state.isLoading = true
        },
        fulfilled: (state, { payload }) => {
          state.isLoading = false
          const searchObject = state.geoObjects.features.findIndex(feat => feat.id === payload.id)
          if (searchObject !== -1) {
            state.geoObjects.features[searchObject] = { ...payload, is_saved: true }
          }
          state.isLoading = false
        },
        rejected: state => {
          state.error = "Invalid request!"
        }
      }
    ),
    getSavedObjects: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data } = await objectQuery.getObject("/api/user/saved-objects")
          return data
        } catch (err) {
          return rejectWithValue(`${err}`)
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
          state.savedObjects = parseToGeoObject
        },
        rejected: state => {
          state.error = "Invalid request!"
        }
      }
    )
  })
})

export const objectReducer = objectSlice.reducer
export const objectActions = objectSlice.actions
