import Parcel from './../index'

const parcel = Parcel(process.env.API_KEY, process.env.REFERER)

parcel.findAddress('24 rue de Strasbourg Armentières').then(address => {
    //console.log(JSON.stringify(address, null, 2))
    return parcel.findParcel(address)
}).then(res => {
    //console.log(JSON.stringify(res, null, 2))
    return parcel.findPacelFeatures(res.placeAttributes)
}).then(res => {
    //console.log(JSON.stringify(res.features, null, 2))
    return res.features[0]
}).then(parceFeature => {
    console.log(`Parcel area: ${parcel.calculateArea(parceFeature)}`)
    //console.log(JSON.stringify(parceFeature, null, 2))
    return parcel.findBuildingFeatures(parceFeature)
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`)
    })
})