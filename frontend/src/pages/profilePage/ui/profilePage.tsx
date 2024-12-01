import { Avatar, Collapse, Input, Typography } from "antd"
import { EditOutlined, StarOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { useActions } from "@shared/hooks/useActions"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import { objectSelector, userSelector } from "@entities/objects"

const { Panel } = Collapse
const { Text } = Typography

const ProfilePage = () => {
  const { getSavedObjects } = useActions()
  const { savedObjects } = useAppSelector(objectSelector)
  const { user } = useAppSelector(userSelector)

  useEffect(() => {
    getSavedObjects()
  }, [])
  return (
    <div className="flex space-x-6 p-4">
      <div className="w-1/4">
        <Avatar
          size={128}
          icon={<EditOutlined />}
          style={{
            display: "block",
            margin: "0 auto 1rem",
            backgroundColor: "#1890ff",
            color: "#fff"
          }}
        />
        <div className="space-y-2">
          <div className="flex flex-col justify-center items-center">
            <Text strong>Параметры профиля</Text>
            <Text>Избранные коммуникации</Text>
          </div>

          <div className="flex flex-col items-center">
            {savedObjects.features.map(item => (
              <div key={item.id} className="cursor-pointer text-blue-600">
                {item.properties.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-3/4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label>Имя</label>
            <Input value={user?.username} readOnly className="bg-gray-100" />
          </div>
          <div>
            <label>Email</label>
            <Input value={user?.email} readOnly className="bg-gray-100" />
          </div>
          <div>
            <label>Роль</label>
            <Input value="Прораб" readOnly className="bg-gray-100" />
          </div>
        </div>

        <Text strong className="block mb-2">
          Избранные коммуникации
        </Text>
        <Collapse accordion>
          {savedObjects.features.map(item => (
            <Panel
              key={item.id}
              header={
                <div className="flex items-center justify-between">
                  <span>{item.properties.name}</span>
                  <StarOutlined className="text-yellow-400" />
                </div>
              }
            >
              <div className="space-y-2">
                <div>
                  <Text strong>Описание</Text>
                  <p>{item.properties.description}</p>
                </div>
                <div>
                  <Text strong>Статус</Text>
                  <p>{item.properties.status}</p>
                </div>
                <div>
                  <Text strong>Тип коммуникации</Text>
                  <p>{item.properties.type}</p>
                </div>
                <div>
                  <Text strong>Глубина залегания</Text>
                  <p>{item.properties.depth}</p>
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  )
}

export default ProfilePage
