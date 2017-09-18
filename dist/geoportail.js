"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeoportalWfsClient = require("./geoportal-wfs-client");
const ign_1 = require("./ign");
exports.default = (key, referer) => {
    const client = new GeoportalWfsClient(key);
    const ignClient = ign_1.default(key, referer);
    return {
        fetchParcelVectors: (attr) => {
            return client.getFeatures('BDPARCELLAIRE-VECTEUR_WLD_BDD_WGS84G:parcelle', {
                code_dep: attr.department,
                code_com: attr.commune,
                numero: attr.number,
                section: attr.section,
                feuille: attr.sheet,
                _limit: 10
            });
        },
        fetchBuildingsVectors: (bbox) => {
            return client.getFeatures('BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie', {
                bbox: `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`,
                _limit: 10
            });
        }
    };
};
//# sourceMappingURL=geoportail.js.map