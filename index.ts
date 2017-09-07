import * as turf from '@turf/turf'
import * as GeoJSON from 'geojson' 
import Geoportail from './geoportail'

const calculateArea = (obj: any) => turf.area(obj)
const bbox = (pointsRaw) => turf.bbox(turf.lineString(pointsRaw))

export default (key: string) => {
    const gp = Geoportail(key)
    return {
        // Find addres from string
        findAddress: (address: string) => gp.findAddress(address),

        // Find parcel info from position
        findParcel: (x: Number, y: Number ) => 
            gp.fetchParcelInfo(x, y).then((result: any) => 
                result.locations.length > 0 ? result.locations[0]: null),

        // Find parcel features from info
        findPacelFeatures: (dep: string, com: string, num: Number, sec: string, sheet: Number) => 
            featuresCollection => featuresCollection.features.length > 0 ? 
                featuresCollection.features[0]: null, 
        
        // Fetch building features on a guiven parcel
        findBuildingFeatures: (parcelFeature: any) => gp.fetchBuildingsVectors(bbox(parcelFeature)).then((collection: any) => 
            collection.features
                .map(feature => turf.intersect(parcelFeature, feature))
                .filter(feature => feature != null)),

        // Calculate area from feature
        calculateArea: (obj: any) => calculateArea(obj),
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