"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turf = require("@turf/turf");
const ign_1 = require("./ign");
const calculateArea = (obj) => turf.area(obj);
const bbox = (pointsRaw) => turf.bbox(pointsRaw);
exports.Client = (key, referer) => {
    const ignClient = ign_1.default(key, referer);
    return {
        findAddress: (address) => ignClient.autoComplete(address, 1).then(res => res[0]),
        findParcel: (address) => ignClient.parcelInfo(address.x, address.y, 1),
        findPacelFeatures: (attr) => ignClient.parcelVector(attr, 10),
        findBuildingFeatures: (parcelFeature) => {
            return ignClient.buildingsVector(bbox(parcelFeature), 10).then((collection) => collection.features
                .map(feature => turf.intersect(parcelFeature, feature))
                .filter(feature => feature.geometry != null));
        },
        calculateArea: (obj) => calculateArea(obj),
    };
};
//# sourceMappingURL=index.js.map