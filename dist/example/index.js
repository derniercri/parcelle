"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const parcel = index_1.Client(process.env.API_KEY, process.env.REFERER);
parcel.findAddress('4 rue de Dunkerque 75010 Paris').then(address => {
    return parcel.findParcel(address);
}).then(res => {
    return parcel.findParcelFeaturesForPosition(res.placeAttributes, res.position);
}).then(res => {
    return res.features[0];
}).then(parceFeature => {
    console.log(`Parcel area: ${parcel.calculateArea(parceFeature)}`);
    return parcel.findBuildingFeatures(parceFeature);
}).then(res => {
    res.map(item => {
        console.log(`Building area: ${parcel.calculateArea(item)}`);
    });
}).catch(e => console.log('ERROR', e));
//# sourceMappingURL=index.js.map