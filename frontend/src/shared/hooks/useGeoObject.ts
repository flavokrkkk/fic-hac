import { RefObject, useState } from "react"
import { IGeoObject } from "@entities/objects"
import * as Cesium from "cesium"

export const useGeoObject = (viewerRef: RefObject<Cesium.Viewer>) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedObject, setSelectedObject] = useState<IGeoObject | null>(null)

  const processGeoJsonEntities = (dataSource: Cesium.DataSource, viewer: Cesium.Viewer): void => {
    try {
      const entities = dataSource.entities.values

      if (dataSource.clustering) {
        dataSource.clustering.enabled = true
        dataSource.clustering.pixelRange = 15
        dataSource.clustering.minimumClusterSize = 2
      }

      entities.forEach(entity => {
        const type: IGeoObject["type"] = entity.properties?.type?.getValue() || "unknown"
        const status: string = entity.properties?.status?.getValue() || "unknown"
        if (entity.polyline) {
          entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.TRANSPARENT)
          entity.polyline.width = new Cesium.ConstantProperty(0)
        }
        const positions = entity.polyline?.positions?.getValue(Cesium.JulianDate.now())
        const midpoint = positions?.[0] || entity.position?.getValue(Cesium.JulianDate.now())

        if (midpoint) {
          entity.billboard = new Cesium.BillboardGraphics({
            image: "/locateIcon.svg",
            scale: 0.6,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          })

          entity.label = new Cesium.LabelGraphics({
            text: `Тип: ${type}\nСтатус: ${status}`,
            font: "14pt sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.8
          })

          entity.position = midpoint
        }
      })

      viewer.screenSpaceEventHandler.setInputAction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position)

          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const pickedEntity = pickedObject.id
            const geoObjectInfo: IGeoObject = {
              id: pickedEntity.id,
              properties: {
                name: pickedEntity.properties?.name?.getValue() || "Unknown",
                type: pickedEntity.properties?.type?.getValue() || "Unknown",
                status: pickedEntity.properties?.status?.getValue() || "Unknown",
                depth: pickedEntity.properties?.depth?.getValue() || 0
              },
              geometry: pickedEntity.geometry,
              type: ""
            }

            setSelectedObject(geoObjectInfo)
            setIsModalVisible(true)

            viewer.zoomTo(pickedEntity)
          }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
    } catch (error) {
      console.error("Ошибка обработки GeoJSON объектов:", error)
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleLoad = (dataSource: Cesium.DataSource) => {
    if (viewerRef.current) {
      processGeoJsonEntities(dataSource, viewerRef.current)
    }
  }

  return {
    handleLoad,
    isModalVisible,
    selectedObject,
    handleOk,
    handleCancel
  }
}
