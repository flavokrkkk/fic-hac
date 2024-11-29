import { Suspense } from "react"
import { Outlet } from "react-router-dom"

const RootPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border h-[56px]">header</header>
      <div className="flex">
        <div className="border h-[calc(100vh-56px)]">aside</div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <h1>Loading...</h1>
            </div>
          }
        >
          <div className="border w-full">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default RootPage
