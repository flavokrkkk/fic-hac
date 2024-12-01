import { RefObject, useCallback, useEffect, useState } from "react"
import { IGeoObject } from "@entities/objects"
import * as Cesium from "cesium"
import { EActiveWatches } from "../utils"

export const useGeoObject = (viewerRef: RefObject<Cesium.Viewer>) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedObject, setSelectedObject] = useState<IGeoObject | null>(null)
  const [watches, setWatches] = useState<EActiveWatches>(EActiveWatches.WATHES_ICON)

  const processGeoJsonEntities = useCallback(
    (dataSource: Cesium.DataSource, viewer: Cesium.Viewer): void => {
      try {
        const entities = dataSource.entities.values

        //кластеризация объектов, убрать на время
        // if (dataSource.clustering) {
        //   dataSource.clustering.enabled = true
        //   dataSource.clustering.pixelRange = 15
        //   dataSource.clustering.minimumClusterSize = 2
        // }

        entities.forEach(entity => {
          const type: IGeoObject["type"] = entity.properties?.type?.getValue() || "unknown"
          const status: string = entity.properties?.status?.getValue() || "unknown"

          if (entity.polyline) {
            if (watches === EActiveWatches.WATCHES_LINE) {
              entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.AQUA)
              entity.polyline.width = new Cesium.ConstantProperty(6)
            } else {
              entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.TRANSPARENT)
              entity.polyline.width = new Cesium.ConstantProperty(0)
            }
          }

          const positions = entity.polyline?.positions?.getValue(Cesium.JulianDate.now())
          const midpoint = positions?.[0] || entity.position?.getValue(Cesium.JulianDate.now())

          if (midpoint) {
            if (watches === EActiveWatches.WATHES_ICON) {
              entity.billboard = new Cesium.BillboardGraphics({
                image: "/locateIcon.svg",
                scale: 0.6,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
              })
            } else {
              entity.billboard = undefined
            }
            entity.label = new Cesium.LabelGraphics({
              text: `Тип: ${type}\nСтатус: ${status}`,
              font: "14pt sans-serif",
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              pixelOffset: new Cesium.Cartesian2(0, -50),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              scale: 0.8,
              show: false
            })

            entity.position = midpoint
          }
          const updateLabelVisibility = () => {
            const cameraPosition = viewer.camera.positionWC
            const entityPosition = entity.position?.getValue(Cesium.JulianDate.now())

            if (!entityPosition) return

            const distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition)

            const labelVisibilityDistance = 500

            if (entity.label) {
              entity.label.show = new Cesium.ConstantProperty(distance < labelVisibilityDistance)
            }
          }

          viewer.scene.camera.changed.addEventListener(updateLabelVisibility)
        })

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
          const pickedObject = viewer.scene.pick(movement.endPosition)
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            document.body.style.cursor = "pointer"
          } else {
            document.body.style.cursor = "default"
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position)
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const pickedEntity = pickedObject.id
            const geoObjectInfo: IGeoObject = {
              id: pickedEntity.id,
              properties: {
                name: pickedEntity.properties?.name?.getValue() || "Unknown",
                type: pickedEntity.properties?.type?.getValue() || "Unknown",
                status: pickedEntity.properties?.status?.getValue() || "Unknown",
                depth: pickedEntity.properties?.depth?.getValue() || 0,
                description: pickedEntity.properties?.description?.getValue() || "",
                material: pickedEntity.properties?.material?.getValue() || ""
              },
              global_layers: pickedEntity.properties?.global_layers?.getValue() || [],
              image: pickedEntity.properties.image.getValue() || "/defaultImage.jpg",
              geometry: pickedEntity.geometry,
              type: pickedEntity.properties?.type?.getValue() || "Unknown",
              is_saved: false
            }

            setSelectedObject(geoObjectInfo)
            setIsModalVisible(true)

            viewer.zoomTo(pickedEntity)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      } catch (error) {
        console.error("Ошибка обработки GeoJSON объектов:", error)
      }
    },
    [watches]
  )

  useEffect(() => {
    if (viewerRef.current) {
      const dataSources = viewerRef.current.dataSources

      if (dataSources) {
        const length = dataSources.length
        for (let i = 0; i < length; i++) {
          const dataSource = dataSources.get(i)
          if (dataSource) {
            processGeoJsonEntities(dataSource, viewerRef.current!)
          }
        }
      }
    }
  }, [watches, processGeoJsonEntities])

  const handleOk = () => setIsModalVisible(false)
  const handleCancel = () => setIsModalVisible(false)

  const handleLoad = (dataSource: Cesium.DataSource) => {
    if (viewerRef.current) {
      processGeoJsonEntities(dataSource, viewerRef.current)
    }
  }

  const handleChangeWatches = (value: EActiveWatches) => setWatches(value)

  return {
    handleLoad,
    isModalVisible,
    selectedObject,
    handleOk,
    handleCancel,
    handleChangeWatches
  }
}
