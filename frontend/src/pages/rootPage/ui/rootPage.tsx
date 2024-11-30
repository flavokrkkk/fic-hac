import { useActions } from "@shared/hooks/useActions"
import { Suspense, useEffect } from "react"
import { Outlet } from "react-router-dom"

const RootPage = () => {
  const { getCurrentUser } = useActions()

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-[1440px]">
      <header className="border h-[56px]">header</header>
      <div className="flex h-[calc(100vh-56px)]">
        <div className="border ">aside</div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <h1>Loading...</h1>
            </div>
          }
        >
          <div className="border w-full h-full">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default RootPage
