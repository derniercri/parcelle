"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const parser = require("xml2json");
exports.default = (apiKey, referer) => {
    const wxsUrl = `https://wxs.ign.fr/${apiKey}`;
    const options = {
        timeout: 5000,
        headers: {
            'Referer': referer,
            'User-Agent': 'Parcel'
        }
    };
    return {
        autoComplete: (address, maxResults) => {
            return axios_1.default.get(wxsUrl + '/ols/apis/completion', Object.assign({}, options, { params: {
                    text: address,
                    maximumResponses: maxResults,
                    type: 'StreetAddress'
                } })).then((res) => res.data.results);
        },
        parcelInfo: (x, y, maxResults) => {
            const parcelInfoXML = xmlTemplate(x, y);
            return axios_1.default.get(wxsUrl + '/geoportail/ols', Object.assign({}, options, { params: {
                    qxml: parcelInfoXML,
                    output: 'json'
                } })).then((res) => parsePlaces(res.data.xml));
        },
    };
};
const xmlTemplate = (x, y) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <xls:XLS version="1.2"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xls="http://www.opengis.net/xls"
        xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd">
        <xls:RequestHeader srsName="EPSG:4326"/>
        <xls:Request maximumResponses="1" methodName="ReverseGeocodeRequest" requestID="2f3089f5-79a6-452c-b54b-07dea3da5b4a" version="1.2">
            <xls:ReverseGeocodeRequest returnFreeForm="false">
                <xls:Position>
                    <gml:Point
                        xmlns:gml="http://www.opengis.net/gml">
                        <gml:pos>${y} ${x}</gml:pos>
                    </gml:Point>
                </xls:Position>
                <xls:ReverseGeocodePreference>CadastralParcel</xls:ReverseGeocodePreference>
            </xls:ReverseGeocodeRequest>
        </xls:Request>
    </xls:XLS>
    `;
};
const parsePlaces = (str) => {
    const data = JSON.parse(parser.toJson(str)).
        XLS.Response.ReverseGeocodeResponse.ReverseGeocodedLocation;
    const xy = data['gml:Point']['gml:pos'].split();
    const obj = {
        searchCenterDistance: 0,
        type: 'Parcelle',
        position: {
            x: 0,
            y: 0,
        },
        placeAttributes: {
            cadastralParcel: '',
            number: '',
            municipality: '',
            sheet: '',
            section: '',
            department: '',
            absorbedCity: '',
            commune: '',
            insee: '',
            origin: '',
        }
    };
    obj.position.x = xy[0];
    obj.position.y = xy[1];
    obj.searchCenterDistance = parseFloat(data.SearchCentreDistance);
    obj.placeAttributes.cadastralParcel = data.Address.StreetAddress.Street;
    data.Address.Place.map(item => {
        switch (item.type) {
            case 'Numero':
                obj.placeAttributes.number = item.$t;
                break;
            case 'Municipality':
                obj.placeAttributes.municipality = item.$t;
                break;
            case 'Feuille':
                obj.placeAttributes.sheet = item.$t;
                break;
            case 'Section':
                obj.placeAttributes.section = item.$t;
                break;
            case 'Departement':
                obj.placeAttributes.department = item.$t;
                break;
            case 'CommuneAbsorbee':
                obj.placeAttributes.absorbedCity = item.$t;
                break;
            case 'Commune':
                obj.placeAttributes.commune = item.$t;
                break;
            case 'INSEE':
                obj.placeAttributes.insee = item.$t;
                break;
            default:
                break;
        }
    });
    return obj;
};
//# sourceMappingURL=ign.js.map