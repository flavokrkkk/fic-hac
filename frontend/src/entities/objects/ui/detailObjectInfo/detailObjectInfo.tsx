import InfoIcon from "@shared/assets/social/infoIcon"
import CheckIcon from "@shared/assets/social/checkIcon"
import CloseIcon from "@shared/assets/social/closeIcon"
import { Card } from "antd"
import { Descriptions, Divider, Space, Statistic, Typography } from "antd"
import { IGeoObject } from "../../model"
import { FC } from "react"

const { Title, Text } = Typography

interface IDetailObjectInfo {
  selectedObject: IGeoObject | null
}

const DetailObjectInfo: FC<IDetailObjectInfo> = ({ selectedObject }) => {
  console.log(selectedObject)
  return (
    <div>
      {selectedObject ? (
        <div>
          <Card hoverable bordered={false} style={{ marginBottom: 20 }}>
            <Title level={4}>{selectedObject.properties.name}</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Тип" span={3}>
                <Text>{selectedObject.properties.type}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Статус" span={3}>
                <Text type={selectedObject.properties.status === "Активный" ? "success" : "danger"}>
                  {selectedObject.properties.status}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Глубина (м)" span={3}>
                <Statistic value={selectedObject.properties.depth} suffix="м" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <img
            src={selectedObject.image}
            alt="Object Cover"
            style={{ width: "100%", height: "auto" }}
          />
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {selectedObject.properties.status === "Активный" ? (
              <Space size="middle" style={{ color: "green" }}>
                <div className="flex space-x-2 items-center">
                  <CheckIcon />
                  <Text strong>Объект активен</Text>
                </div>
              </Space>
            ) : (
              <Space size="middle" style={{ color: "red" }}>
                <div className="flex space-x-2 items-center">
                  <CloseIcon />
                  <Text strong>Объект неактивен</Text>
                </div>
              </Space>
            )}
          </Space>

          <Divider />
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={5}>Дополнительная информация</Title>
            <div className="flex space-x-2">
              <InfoIcon />
              <Text italic>
                Данный объект представляет собой важную коммуникацию для инфраструктуры города.
              </Text>
            </div>
          </Space>
        </div>
      ) : (
        <Text>Информация не доступна.</Text>
      )}
    </div>
  )
}

export default DetailObjectInfo
