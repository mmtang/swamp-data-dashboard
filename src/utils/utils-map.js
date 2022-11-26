import { regionDict } from './utils';


export const bpLayerDict = {
    '1': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/2',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '2': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/2',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '3': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/2'
    },
    '4': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Los_Angeles_Basin_Plan_Beneficial_Uses/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Los_Angeles_Basin_Plan_Beneficial_Uses/FeatureServer/2'
    },
    // Sacramento and San Joaquin River Basin Basin Plan
    '5S': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Sacramento_and_San_Joaquin_River_Basin_Plan_Beneficial_Uses/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Sacramento_and_San_Joaquin_River_Basin_Plan_Beneficial_Uses/FeatureServer/2'
    },
    // Tulare Basin Plan
    '5T': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Tulare_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Tulare_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/2'
    },
    '6': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lahontan_Basin_Plan_Beneficial_Uses/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lahontan_Basin_Plan_Beneficial_Uses/FeatureServer/2'
    },
    '7': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_7C/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_7C/FeatureServer/2'
    },
    '8': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_8S/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_8S/FeatureServer/2'
    },
    '9': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_9S/FeatureServer/0',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_9S/FeatureServer/2'
    }
}

// Converts JSON station data to graphics structure used by ArcGIS JS
export const convertStationDataToGraphics = async (data) => {
    return new Promise((resolve, reject) => {
        const features = data.map((d, i) => {
            return {
                geometry: {
                    type: 'point',
                    latitude: +d.TargetLatitude,
                    longitude: +d.TargetLongitude
                },
                attributes: {
                    ObjectId: d.StationCode,
                    StationCode: d.StationCode,
                    StationName: d.StationName,
                    Region: d.Region.toString(),
                    RegionName: regionDict[d.Region],
                    LastSampleDate: d.LastSampleDate,
                    // probably no longer need these because I am changing data structure, but still needed for older components
                    //bioaccumulation: d.Bioaccumulation, 
                    //bioassessment: d.Bioassessment,
                    //fhab: d.Fhab,
                    //spot: d.Spot
                }
            };
        });
        resolve(features);
    })
}

export const stationDataFields = [
    {
        name: 'ObjectId',
        alias: 'ObjectId',
        type: 'oid'
    },
    {
        name: 'StationCode',
        alias: 'Station Code',
        type: 'string'
    },
    {
        name: 'StationName',
        alias: 'Station Name',
        type: 'string'
    },
    {
        name: 'RegionName',
        alias: 'Region',
        type: 'string'
    },
    {
        name: 'LastSampleDate',
        alias: 'Last Sample',
        type: 'string'
    },
    {
        name: 'bioaccumulation',
        alias: 'Bioaccumulation',
        type: 'string'
    },
    {
        name: 'bioassessment',
        alias: 'Bioassessment',
        type: 'string'
    },
    {
        name: 'fhab',
        alias: 'Fhab',
        type: 'string'
    },
    {
        name: 'spot',
        alias: 'Spot',
        type: 'string'
    }
]