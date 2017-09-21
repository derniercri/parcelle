import { Client } from './../index'
import * as turf from '@turf/turf'

const parcel = Client(process.env.API_KEY, process.env.REFERER)

parcel.findAddress('4 rue de Dunkerque 75010 Paris').then(address => {
    // console.log('parcel.findAddress', JSON.stringify(address, null, 2))
    return parcel.findParcel(address)
}).then(res => {
    // console.log('parcel.findParcel', JSON.stringify(res, null, 2))
    return parcel.findParcelFeaturesForPosition(res.placeAttributes, res.position)
}).then(res => {
    // console.log('parcel.findPacelFeatures', JSON.stringify(res.features, null, 2))
    return res.features[0]
}).then(parceFeature => {
    // console.log('res.features[0]', JSON.stringify(parceFeature, null, 2))
    console.log(`Parcel area: ${parcel.calculateArea(parceFeature)}`)
    //console.log(JSON.stringify(parceFeature, null, 2))
    return parcel.findBuildingFeatures(parceFeature)
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`)
    })
}).catch(e =>
  console.log('ERROR', e)
)
