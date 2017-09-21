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
        findParcelFeatures: (attr) => ignClient.parcelVector(attr, 10),
        findParcelFeaturesForPosition: (attr, position) => {
            const parcelFeatures = ignClient.parcelVector(attr, 10).then(featureCollection => {
                let positionPoint = turf.point(position.x.split(" ").reverse().map(n => parseFloat(n)));
                const features = featureCollection.features;
                featureCollection.features = features.sort((a, b) => (turf.distance(positionPoint, turf.center(a)) - turf.distance(positionPoint, turf.center(b))));
                return featureCollection;
            });
            return parcelFeatures;
        },
        findBuildingFeatures: (parcelFeature) => {
            return ignClient.buildingsVector(bbox(parcelFeature), 10).then((collection) => collection.features
                .filter(feature => feature.geometry != null)
                .map(feature => {
                if (turf.intersect(parcelFeature, feature).geometry == null)
                    return null;
                const featureArea = calculateArea(feature);
                const intersectArea = calculateArea(turf.intersect(parcelFeature, feature));
                if (intersectArea / featureArea < 0.9)
                    return null;
                return feature;
            })
                .filter(feature => feature != null));
        },
        calculateArea: (obj) => calculateArea(obj),
    };
};
//# sourceMappingURL=index.js.map