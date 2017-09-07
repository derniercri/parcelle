import * as turf from '@turf/turf'
import * as GeoJSON from 'geojson' 
import Geoportail, { Position, PlaceAttributes } from './geoportail'

export { Position, Address, Parcel, PlaceAttributes } from './geoportail'

const calculateArea = (obj: any) => turf.area(obj)
const bbox = (pointsRaw) => turf.bbox(pointsRaw)

export default (key: string) => {
    const gp = Geoportail(key)
    return {
        // Find addres from string
        findAddress: (address: string) => gp.findAddress(address),

        // Find parcel info from position
        findParcel: (pos: Position) => gp.fetchParcelInfo(pos.x, pos.y),

        // Find parcel features from info
        findPacelFeatures: (attr: PlaceAttributes) => 
          gp.fetchParcelVectors(attr).then(featuresCollection => featuresCollection), 
        
        // Fetch building features on a guiven parcel
        findBuildingFeatures: (parcelFeature: GeoJSON.Feature<GeoJSON.Polygon>) => {
          return gp.fetchBuildingsVectors(bbox(parcelFeature)).then((collection) => 
            collection.features
                .map(feature => turf.intersect(parcelFeature, feature))
                .filter(feature => feature != null))},

        // Calculate area from feature
        calculateArea: (obj: GeoJSON.Feature<GeoJSON.Polygon>) => calculateArea(obj),
    }
}


/*gpClient.findAddress(address).then(address => {
    return address.suggestedLocations[0].position
  }).then(position => {
    return gpClient.fetchParcelInfo(position.x, position.y)
  }).then(result => {
    const parcel = result.locations[0].placeAttributes
    console.log(JSON.stringify(result.locations[0], null, 2))
    console.log(`Parcel number ${JSON.stringify(parcel)}`)
  
    gpClient.fetchParcelVectors(parcel.department, parcel.commune, parcel.number, parcel.section, parseInt(parcel.sheet)).then(featureCollection => {
      const area = featureCollection.features[0].geometry.coordinates[0]
      //console.log(JSON.stringify())
      console.log(`Area is: ${areaCompute(featureCollection.features[0])} `)
      const parcelFeature = featureCollection.features[0]
      gpClient.fetchBuildingsVectors(bbox(area[0])).then((collection) => {
        return collection.features
          .map(feature => turf.intersect(parcelFeature, feature))
          .filter(feature => feature != null)
        
          console.log(collection, null, 2)
  
      }).then(buildings => {
        console.log(JSON.stringify(buildings))
        buildings.map(building => {console.log(`Area is: ${areaCompute(building)} `)})
      })
    })
  })*/