import { bindActionCreators } from "@reduxjs/toolkit"
import { useAppDispatch } from "./useAppDispatch"
import { userActions } from "@entities/user"
import { objectActions } from "@entities/objects/model/store/objectSlice"

export const useActions = () => {
  const dispatch = useAppDispatch()
  return bindActionCreators(
    {
      ...userActions,
      ...objectActions
    },
    dispatch
  )
}
