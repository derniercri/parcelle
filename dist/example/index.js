"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const parcel = index_1.Client(process.env.API_KEY, process.env.REFERER);
parcel.findAddress('16 rue gallieni 59160 lille').then(address => {
    return parcel.findParcel(address);
}).then(res => {
    return parcel.findPacelFeatures(res.placeAttributes);
}).then(res => {
    return res.features[0];
}).then(parceFeature => {
    console.log(`Parcel area: ${parcel.calculateArea(parceFeature)}`);
    return parcel.findBuildingFeatures(parceFeature);
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`);
    });
});
//# sourceMappingURL=index.js.map