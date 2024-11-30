import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { communications } from "@shared/mocks/communications"
import { IObjectsState } from "./types"
import { EFilterTypes } from "@/shared/utils/filterType"

const initialState: IObjectsState = {
  geoObjects: communications,
  filterGeoObjects: communications
}

export const objectSlice = createSlice({
  name: "geoObjectsSlice",
  initialState,
  reducers: () => ({
    setFilterObjects: (state, { payload }: PayloadAction<EFilterTypes>) => {
      state.filterGeoObjects = {
        ...state.geoObjects,
        features: state.geoObjects.features.filter(f => f.type === payload)
      }
    }
  })
})

export const objectReducer = objectSlice.reducer
export const objectActions = objectSlice.actions
