# Parcelle

__Getting started__
```
npm install git+ssh://git@github.com/derniercri/parcelle.git
```

```
const ParcelClient = require('parcelle').Client

const parcel = Parcel(process.env.API_KEY, process.env.REFERER)

parcel.findAddress('24 rue de Strasbourg Armentières').then(address => {
    return parcel.findParcel(address)
}).then(res => {
    return parcel.findPacelFeatures(res.placeAttributes)
}).then(res => {
    return res.features[0]
}).then(parceFeature => {
    return parcel.findBuildingFeatures(parceFeature)
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`)
    })
})
```