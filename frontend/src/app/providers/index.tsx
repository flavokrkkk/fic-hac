import { RouterProvider } from "react-router-dom"
import { router } from "../../pages"
import { Provider } from "react-redux"
import { store } from "../store"
import { ViewerProvider } from "@entities/viewer/model/context"

const Providers = () => {
  return (
    <Provider store={store}>
      <ViewerProvider>
        <RouterProvider router={router} />
      </ViewerProvider>
    </Provider>
  )
}

export default Providers
