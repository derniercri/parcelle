"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turf = require("@turf/turf");
const geoportail_1 = require("./geoportail");
const calculateArea = (obj) => turf.area(obj);
const bbox = (pointsRaw) => turf.bbox(pointsRaw);
exports.default = (key) => {
    const gp = geoportail_1.default(key);
    return {
        findAddress: (address) => gp.findAddress(address),
        findParcel: (pos) => gp.fetchParcelInfo(pos.x, pos.y),
        findPacelFeatures: (attr) => gp.fetchParcelVectors(attr).then(featuresCollection => featuresCollection),
        findBuildingFeatures: (parcelFeature) => {
            return gp.fetchBuildingsVectors(bbox(parcelFeature)).then((collection) => collection.features
                .map(feature => turf.intersect(parcelFeature, feature))
                .filter(feature => feature != null));
        },
        calculateArea: (obj) => calculateArea(obj),
    };
};
//# sourceMappingURL=index.js.map