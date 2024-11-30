import { RefObject } from "react"
import { IGeoObject } from "@entities/objects"
import { EFilterTypes } from "@shared/utils/filterType"
import * as Cesium from "cesium"

export const useGeoObject = (viewerRef: RefObject<Cesium.Viewer>) => {
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
        const color = getColorByType(type as EFilterTypes)

        if (entity.polyline) {
          entity.polyline.material = new Cesium.ColorMaterialProperty(color)
          entity.polyline.width = new Cesium.ConstantProperty(4)

          const positions = entity.polyline.positions?.getValue(Cesium.JulianDate.now())
          if (positions && positions.length > 0) {
            const midpoint = positions[0]

            entity.label = new Cesium.LabelGraphics({
              text: `Тип: ${type}`,
              font: "14pt sans-serif",
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              scale: 0.8
            })

            entity.position = midpoint
          }
        }
      })

      addHighlightOnHover(viewer, entities)
    } catch (error) {
      console.error("Ошибка обработки GeoJSON объектов:", error)
    }
  }

  const addHighlightOnHover = (viewer: Cesium.Viewer, entities: Cesium.Entity[]): void => {
    let previousPickedEntity: Cesium.Entity | null = null

    viewer.screenSpaceEventHandler.setInputAction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (movement: any) => {
        const pickedObject = viewer.scene.pick(movement.endPosition)

        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
          const pickedEntity = pickedObject.id

          if (entities.includes(pickedEntity)) {
            if (previousPickedEntity && previousPickedEntity !== pickedEntity) {
              resetEntityHighlight(previousPickedEntity)
            }

            if (pickedEntity.polyline) {
              pickedEntity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW)
            }

            previousPickedEntity = pickedEntity
          }
        } else if (previousPickedEntity) {
          resetEntityHighlight(previousPickedEntity)
          previousPickedEntity = null
        }
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
  }

  const resetEntityHighlight = (entity: Cesium.Entity): void => {
    const originalColor = getColorByType(entity.properties?.type?.getValue() || "unknown")
    if (entity.polyline) {
      entity.polyline.material = new Cesium.ColorMaterialProperty(originalColor)
    }
  }

  const getColorByType = (type: EFilterTypes) => {
    const colorObject = {
      [EFilterTypes.PIPELINE]: Cesium.Color.RED,
      [EFilterTypes.CABLE]: Cesium.Color.BLUE,
      [EFilterTypes.GAS_PIPELINE]: Cesium.Color.DARKGREEN
    }

    return colorObject[type]
  }

  const handleLoad = (dataSource: Cesium.DataSource) => {
    if (viewerRef.current) {
      processGeoJsonEntities(dataSource, viewerRef.current)
    }
  }

  return {
    handleLoad
  }
}
