import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { ERoutesNames, routesWithHoc } from "./routes"
import { privatePage, publicPage } from "@entities/viewer/libs"

const RootPage = lazy(() => import("@pages/rootPage"))
const ObjectPage = lazy(() => import("@pages/objectPage"))
const ObjectDetailsPage = lazy(() => import("@pages/objectPage/ui/objectDetailsPage"))
const AuthPage = lazy(() => import("@pages/authPage"))
const RegisterPage = lazy(() => import("@pages/authPage/ui/registerPage/ui"))
const LoginPage = lazy(() => import("@pages/authPage/ui/loginPage/ui"))
const ProfilePage = lazy(() => import("@pages/profilePage"))

export const router = createBrowserRouter([
  {
    element: <RootPage />,
    children: [
      ...routesWithHoc(privatePage, [
        {
          path: "",
          element: <Navigate to={ERoutesNames.OBJECTS_PAGE} replace />
        },
        {
          path: ERoutesNames.OBJECTS_PAGE,
          element: <ObjectPage />
        },
        {
          path: ERoutesNames.OBJECTS_DETAILS_PAGE,
          element: <ObjectDetailsPage />
        },
        {
          path: ERoutesNames.PROFILE_PAGE,
          element: <ProfilePage />
        }
      ])
    ]
  },
  {
    path: ERoutesNames.AUTH_PAGE,
    element: (
      <Suspense fallback={<div className="h-screen w-full">Loading..</div>}>
        <AuthPage />
      </Suspense>
    ),
    children: [
      ...routesWithHoc(publicPage, [
        {
          path: "",
          element: <Navigate to={ERoutesNames.LOGIN_PAGE} replace />
        },
        {
          path: ERoutesNames.LOGIN_PAGE,
          element: <LoginPage />
        },
        {
          path: ERoutesNames.REGISTER_PAGE,
          element: <RegisterPage />
        }
      ])
    ]
  }
])
