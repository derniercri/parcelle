# Parcel

__Getting started__
```
npm install git+ssh://git@github.com/laibulle/parcel.git
```

```
const Parcel = require('parcel')

const parcel = Parcel.default(process.env.API_KEY)

parcel.findAddress('24 rue de Strasbourg Armentières').then(address => {
    return parcel.findParcel(address.suggestedLocations[0].position)
}).then(res => {
    return parcel.findPacelFeatures(res.locations[0].placeAttributes)
}).then(res => {
    return res.features[0]
}).then(parceFeature => {
    console.log(`Parcel area: ${parcel.calculateArea(parceFeature)}`)
    return parcel.findBuildingFeatures(parceFeature)
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`)
    })
})
```