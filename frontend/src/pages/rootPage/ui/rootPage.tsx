import { ERoutesNames } from "@pages/routes"
import UserIcon from "@shared/assets/social/userIcon"
import { useActions } from "@shared/hooks/useActions"
import { Space } from "antd"
import { Header } from "antd/es/layout/layout"
import Title from "antd/es/typography/Title"
import { Suspense, useEffect } from "react"
import { Link, Outlet } from "react-router-dom"

const RootPage = () => {
  const { getCurrentUser } = useActions()

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-[1440px]">
      <Header className="bg-white shadow-md">
        <div className="flex justify-between items-center h-full">
          <Space>
            <Title level={3} className="m-0">
              <strong>Коммуникации</strong>
            </Title>
          </Space>
          <section className="text-lg flex items-center space-x-5">
            <Link to={ERoutesNames.PROFILE_PAGE} key="1" className="cursor-pointer">
              <UserIcon />
            </Link>
            <div key="2" className="text-sm cursor-pointer">
              Главная
            </div>
            <Link to={ERoutesNames.OBJECTS_PAGE} key="3" className="text-sm cursor-pointer">
              Карта
            </Link>
          </section>
        </div>
      </Header>
      <div className="flex h-[calc(100vh-36px)]">
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <h1>Loading...</h1>
            </div>
          }
        >
          <div className="w-full h-full">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export default RootPage
