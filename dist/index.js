"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turf = require("@turf/turf");
const geoportail_1 = require("./geoportail");
const calculateArea = (obj) => turf.area(obj);
const bbox = (pointsRaw) => turf.bbox(turf.lineString(pointsRaw));
exports.default = (key) => {
    const gp = geoportail_1.default(key);
    return {
        findAddress: (address) => gp.findAddress(address),
        findParcel: (x, y) => gp.fetchParcelInfo(x, y).then((result) => result.locations.length > 0 ? result.locations[0] : null),
        findPacelFeatures: (dep, com, num, sec, sheet) => featuresCollection => featuresCollection.features.length > 0 ?
            featuresCollection.features[0] : null,
        findBuildingFeatures: (parcelFeature) => gp.fetchBuildingsVectors(bbox(parcelFeature)).then((collection) => collection.features
            .map(feature => turf.intersect(parcelFeature, feature))
            .filter(feature => feature != null)),
        calculateArea: (obj) => calculateArea(obj),
    };
};
//# sourceMappingURL=index.js.map