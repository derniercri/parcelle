import * as turf from '@turf/turf'
import { Feature, MultiPolygon, Polygon} from 'geojson'
import IgnClient, { Address, PlaceAttributes  } from './ign'

const calculateArea = (obj: any) => turf.area(obj)
const bbox = (pointsRaw) => turf.bbox(pointsRaw)

export const Client = (key: string, referer: string) => {
    const ignClient = IgnClient(key, referer)

    return {
        // Find addres from string
        findAddress: (address): Promise<Address | null> =>
          ignClient.autoComplete(address, 1).then(res => res[0]),

        // Find parcel info from position
        findParcel: (address: Address) => ignClient.parcelInfo(address.x, address.y, 1),

        // Find parcel features from info
        findParcelFeatures: (attr: PlaceAttributes) => ignClient.parcelVector(attr, 10),

        // Find parcel features from info and position
        findParcelFeaturesForPosition: (attr: PlaceAttributes, position) => {
          const parcelFeatures = ignClient.parcelVector(attr, 10).then(featureCollection => {
            let positionPoint = turf.point(position.x.split(" ").reverse().map(n => parseFloat(n)))
            const features = featureCollection.features

            // sort features by increasing distance from 'position'
            featureCollection.features = features.sort((a, b) => (turf.distance(positionPoint, turf.center(a)) - turf.distance(positionPoint, turf.center(b))))

            // featureCollection.features.forEach(a => {
            //   console.log('distance', turf.distance(positionPoint,  turf.center(a)), JSON.stringify(a null, 2))
            // })

            return featureCollection
          })

          return parcelFeatures
        },

        // Fetch building features on a guiven parcel
        findBuildingFeatures: (parcelFeature: Feature<Polygon>) => {
          return ignClient.buildingsVector(bbox(parcelFeature), 10).then((collection) =>
            collection.features
              .filter(feature => feature.geometry != null)
              .map(feature => {

                // exclude building without any intersection - prevent error on calculateArea()
                if (turf.intersect(parcelFeature, feature).geometry == null)
                  return null

                // compute building area and building/parcel intersection area
                const featureArea = calculateArea(feature)
                const intersectArea = calculateArea(turf.intersect(parcelFeature, feature))

                // exclude intersections below a given ratio of the building
                if (intersectArea / featureArea < 0.9)
                  return null

                return feature
              })
              .filter(feature => feature != null)
          )
        },

        // Calculate area from feature
        calculateArea: (obj: Feature<Polygon>) => calculateArea(obj),
    }
}
