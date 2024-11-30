import { RootState } from "@app/store"

export const objectSelector = (state: RootState) => state.objectReducer
export const userSelector = (state: RootState) => state.userReducer
