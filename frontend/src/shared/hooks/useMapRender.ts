import { RefObject, useEffect, useMemo } from "react"
import * as Cesium from "cesium"
import { ECoordinates } from "../utils"

export const useMapRender = (viewerRef: RefObject<Cesium.Viewer>) => {
  const handleRenderViewer = useMemo(
    () => (interval: NodeJS.Timeout) => {
      const viewer = viewerRef.current
      if (viewer) {
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            ECoordinates.LONGITUDE,
            ECoordinates.LATITUDE,
            ECoordinates.ALTITUDE
          ),
          orientation: {
            heading: 0.0,
            pitch: -1.5,
            roll: 0.0
          }
        })
        clearInterval(interval)
      }
    },
    [viewerRef]
  )

  useEffect(() => {
    const interval = setInterval(() => handleRenderViewer(interval), 100)
    return () => clearInterval(interval)
  }, [])
}
