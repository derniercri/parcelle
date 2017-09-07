import Parcel from './../index'

const parcel = Parcel(process.env.API_KEY)

parcel.findAddress('24 rue de Strasbourg Armentières').then(address => {
    //console.log(JSON.stringify(address, null, 2))
    return parcel.findParcel(address.suggestedLocations[0].position)
}).then(res => {
    //console.log(JSON.stringify(res, null, 2))
    return parcel.findPacelFeatures(res.locations[0].placeAttributes)
}).then(res => {
    return res.features[0]
    //console.log(JSON.stringify(res.features, null, 2))
}).then(parceFeature => {
    //console.log(JSON.stringify(parceFeature, null, 2))
    parcel.findBuildingFeatures(parceFeature)
}).then(res => {
})