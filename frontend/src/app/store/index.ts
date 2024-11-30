import { objectReducer } from "@entities/objects/model/store/objectSlice"
import { userReducer } from "@entities/user"
import { combineReducers, configureStore } from "@reduxjs/toolkit"

export const reducers = combineReducers({
  userReducer,
  objectReducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
