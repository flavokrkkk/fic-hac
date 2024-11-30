import { useActions } from "@shared/hooks/useActions"
import { Menu, Space } from "antd"
import { Header } from "antd/es/layout/layout"
import Title from "antd/es/typography/Title"
import { Suspense, useEffect } from "react"
import { Outlet } from "react-router-dom"

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
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]} className="text-lg">
            <Menu.Item key="1" className="text-lg">
              Главная
            </Menu.Item>
            <Menu.Item key="2" className="text-lg">
              Карта
            </Menu.Item>
          </Menu>
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
