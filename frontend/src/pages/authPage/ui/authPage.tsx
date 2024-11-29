import { Outlet } from "react-router-dom"

const AuthPage = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <Outlet />
    </div>
  )
}

export default AuthPage
