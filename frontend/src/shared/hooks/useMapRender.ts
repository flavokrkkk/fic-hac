import { RefObject, useEffect } from "react"
import * as Cesium from "cesium"

export const useMapRender = (viewerRef: RefObject<Cesium.Viewer>) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const viewer = viewerRef.current

      if (viewer) {
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(37.605241, 55.729054, 1000),
          orientation: {
            heading: 0.0,
            pitch: -1.5,
            roll: 0.0
          }
        })
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])
}
