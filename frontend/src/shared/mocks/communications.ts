import { IGeoWrapper } from "@/entities/objects"

export const communications: IGeoWrapper = {
  type: "FeatureCollection",
  features: [
    {
      id: 1,
      type: "Feature",
      properties: {
        name: "Трубопровод 1",
        type: "Трубопровод",
        depth: 10,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.605241, 55.729054], // [longitude, latitude]
          [37.6059, 55.7299]
        ]
      }
    },
    {
      id: 2,
      type: "Feature",
      properties: {
        name: "Кабель 1",
        type: "Кабель",
        depth: 5,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.6075, 55.73],
          [37.608, 55.7315]
        ]
      }
    },
    {
      id: 3,
      type: "Feature",
      properties: {
        name: "Трубопровод 2",
        type: "Трубопровод",
        depth: 15,
        status: "Неактивный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.604, 55.732],
          [37.606, 55.733],
          [37.6075, 55.734]
        ]
      }
    },
    {
      id: 4,
      type: "Feature",
      properties: {
        name: "Кабель 2",
        type: "Кабель",
        depth: 12,
        status: "Ожидающий"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.609, 55.735],
          [37.61, 55.736],
          [37.611, 55.737]
        ]
      }
    },
    {
      id: 5,
      type: "Feature",
      properties: {
        name: "Газопровод 1",
        type: "Газопровод",
        depth: 8,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.612, 55.738],
          [37.613, 55.739],
          [37.614, 55.74]
        ]
      }
    },
    {
      id: 6,
      type: "Feature",
      properties: {
        name: "Трубопровод 3",
        type: "Трубопровод",
        depth: 20,
        status: "Неактивный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.615, 55.741],
          [37.616, 55.742]
        ]
      }
    },
    {
      id: 7,
      type: "Feature",
      properties: {
        name: "Кабель 3",
        type: "Кабель",
        depth: 10,
        status: "Ожидающий"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.617, 55.743],
          [37.618, 55.744],
          [37.619, 55.745]
        ]
      }
    }
  ]
}

export const communicationsMaps: IGeoWrapper = {
  type: "FeatureCollection",
  features: [
    {
      id: 1,
      type: "Feature",
      properties: {
        name: "Трубопровод 1",
        type: "Трубопровод",
        depth: -10,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.605241, 55.729054, -10],
          [37.6059, 55.7299, -10]
        ]
      }
    },
    {
      id: 2,
      type: "Feature",
      properties: {
        name: "Кабель 1",
        type: "Кабель",
        depth: -5,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.6075, 55.73, -5],
          [37.608, 55.7315, -5]
        ]
      }
    },
    {
      id: 3,
      type: "Feature",
      properties: {
        name: "Трубопровод 2",
        type: "Трубопровод",
        depth: -15,
        status: "Неактивный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.604, 55.732, -15],
          [37.606, 55.733, -15],
          [37.6075, 55.734, -15]
        ]
      }
    },
    {
      id: 4,
      type: "Feature",
      properties: {
        name: "Кабель 2",
        type: "Кабель",
        depth: -12,
        status: "Ожидающий"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.609, 55.735, -12],
          [37.61, 55.736, -12],
          [37.611, 55.737, -12]
        ]
      }
    },
    {
      id: 5,
      type: "Feature",
      properties: {
        name: "Газопровод 1",
        type: "Газопровод",
        depth: -8,
        status: "Активный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.612, 55.738, -8],
          [37.613, 55.739, -8],
          [37.614, 55.74, -8]
        ]
      }
    },
    {
      id: 6,
      type: "Feature",
      properties: {
        name: "Трубопровод 3",
        type: "Трубопровод",
        depth: -20,
        status: "Неактивный"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.615, 55.741, -20],
          [37.616, 55.742, -20]
        ]
      }
    },
    {
      id: 7,
      type: "Feature",
      properties: {
        name: "Кабель 3",
        type: "Кабель",
        depth: -10,
        status: "Ожидающий"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [37.617, 55.743, -10],
          [37.618, 55.744, -10],
          [37.619, 55.745, -10]
        ]
      }
    }
  ]
}
