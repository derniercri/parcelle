"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turf = require("@turf/turf");
const geoportail_1 = require("./geoportail");
const ign_1 = require("./ign");
const calculateArea = (obj) => turf.area(obj);
const bbox = (pointsRaw) => turf.bbox(pointsRaw);
exports.default = (key, referer) => {
    const ignClient = ign_1.default(key, referer);
    const gp = geoportail_1.default(key, referer);
    return {
        findAddress: (address) => ignClient.autoComplete(address, 1).then(res => res[0]),
        findParcel: (address) => ignClient.parcelInfo(address.x, address.y, 1),
        findPacelFeatures: (attr) => gp.fetchParcelVectors(attr).then(featuresCollection => featuresCollection),
        calculateArea: (obj) => calculateArea(obj),
    };
};
//# sourceMappingURL=index.js.map