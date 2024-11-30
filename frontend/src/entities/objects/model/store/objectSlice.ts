import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { communications } from "@shared/mocks/communications"
import { IObjectsState } from "./types"

const initialState: IObjectsState = {
  geoObjects: communications,
  filterGeoObjects: communications
}

export const objectSlice = createSlice({
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
    )
  })
})

export const objectReducer = objectSlice.reducer
export const objectActions = objectSlice.actions
