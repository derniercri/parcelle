import Gp = require("geoportal-access-lib")
import GeoportalWfsClient = require('./geoportal-wfs-client')
import * as GeoJSON from 'geojson'

export interface Position {
  x: number,
  y: number
}
  
export interface SuggestedLocations {
  type: string,
  position: Position,
  commune: string,
  fullText: string,
  postalCode: string, 
  classification: Number,
  street: string
}
  
export interface Address {
  suggestedLocations: Array<SuggestedLocations>
}

export interface ParcelResult {
    locations: Array<Parcel>
}

export interface PlaceAttributes {
    cadastralParcel: string,
    municipality: string,
    number: string,
    sheet: string,
    section: string,
    department: string,
    absorbedCity: string,
    commune: string,
    insee: string,
    origin: string
}

export interface Parcel {
    position: Position,
    placeAttributes: PlaceAttributes,
    type: string,
    CLASSNAME: string,
    searchCenterDistance: number
}

export interface VectorResult {
    features: Array<GeoJSON.Feature<GeoJSON.Polygon>>
}

export default key => {
    const client = new GeoportalWfsClient(key)
    
    return {
        findAddress: (address): Promise<Address | null> => {
            return new Promise((resolve,reject) => {
                Gp.Services.autoComplete({
                    apiKey : key,
                    text : address,      
                    filterOptions : {
                        type : ["StreetAddress"]
                    },
                    onSuccess : (result) => {
                        resolve(result)
                    },
                    onFailure: (err) => {
                        reject(err)
                    }
                })
            })
        },
        fetchParcelInfo: (x, y): Promise<ParcelResult> => {
            return new Promise((resolve, reject) => {
                Gp.Services.reverseGeocode({
                    apiKey : key, 
                    position : { 
                        x,
                        y
                    },
                    filterOptions : {
                        type : ["CadastralParcel"]
                    },
                    onSuccess:  (result) => {
                        resolve(result)
                    },
                    onFailure: (err) => {
                        reject(err)
                    }
                })
            })
        },
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