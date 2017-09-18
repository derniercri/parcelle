import Gp = require("geoportal-access-lib/dist/GpServices-src")
import GeoportalWfsClient = require('./geoportal-wfs-client')
import * as GeoJSON from 'geojson'
import IgnClient, { Address, PlaceAttributes } from './ign'


  
export interface SuggestedLocations {
  type: string,
  position: Position,
  commune: string,
  fullText: string,
  postalCode: string, 
  classification: Number,
  street: string
}
  

export interface VectorResult {
    features: Array<GeoJSON.Feature<GeoJSON.Polygon>>
}

export default (key, referer) => {
    const client = new GeoportalWfsClient(key)
    const ignClient = IgnClient(key, referer)
    
    return {
        fetchParcelVectors: (attr: PlaceAttributes): Promise<VectorResult> => {
            return client.getFeatures(
                'BDPARCELLAIRE-VECTEUR_WLD_BDD_WGS84G:parcelle',
                {
                    code_dep: attr.department,
                    code_com: attr.commune,
                    numero: attr.number,
                    section: attr.section,
                    feuille: attr.sheet,
                    _limit: 10
                }
            )
        },
        fetchBuildingsVectors: (bbox): Promise<VectorResult> => {
            return client.getFeatures(
                'BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
                {
                    bbox: `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`,
                    _limit: 10
                }
            )
        }
    }
}