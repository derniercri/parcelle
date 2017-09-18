import * as turf from '@turf/turf'
import * as GeoJSON from 'geojson' 
import IgnClient, { Address, PlaceAttributes  } from './ign'

const calculateArea = (obj: any) => turf.area(obj)
const bbox = (pointsRaw) => turf.bbox(pointsRaw)

export default (key: string, referer: string) => {
    const ignClient = IgnClient(key, referer)

    return {
        // Find addres from string
        findAddress: (address): Promise<Address | null> =>
          ignClient.autoComplete(address, 1).then(res => res[0]),

        // Find parcel info from position
        findParcel: (address: Address) => ignClient.parcelInfo(address.x, address.y, 1),
        //findParcel: (address: Address) => ignClient.parcelInfo(address.x, address.y, 1),

        // Find parcel features from info
        findPacelFeatures: (attr: PlaceAttributes) => ignClient.parcelVector(attr, 10),
        
        // Fetch building features on a guiven parcel
        findBuildingFeatures: (parcelFeature: GeoJSON.Feature<GeoJSON.Polygon>) => {
          return ignClient.buildingsVector(bbox(parcelFeature), 10).then((collection) => 
            collection.features
                .map(feature => turf.intersect(parcelFeature, feature))
                .filter(feature => feature.geometry != null))},

        // Calculate area from feature
        calculateArea: (obj: GeoJSON.Feature<GeoJSON.Polygon>) => calculateArea(obj),
    }
}