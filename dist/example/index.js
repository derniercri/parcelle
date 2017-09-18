"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const parcel = index_1.default(process.env.API_KEY, process.env.REFERER);
parcel.findAddress('24 rue de Strasbourg Armentières').then(address => {
    console.log(JSON.stringify(address, null, 2));
    return parcel.findParcel(address);
}).then(res => {
    console.log(JSON.stringify(res, null, 2));
    return parcel.findPacelFeatures(res.placeAttributes);
});
//# sourceMappingURL=index.js.map