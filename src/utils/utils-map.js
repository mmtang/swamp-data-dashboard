import { regionDict } from './utils';


export const bpLayerDict = {
    '1': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/North_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '2': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/San_Francisco_Bay_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '3': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Coast_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '4': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Los_Angeles_Basin_Plan_Beneficial_Uses/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Los_Angeles_Basin_Plan_Beneficial_Uses/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Los_Angeles_Basin_Plan_Beneficial_Uses/FeatureServer/5'
    },
    // Sacramento and San Joaquin River Basin Basin Plan
    '5S': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Sacramento_and_San_Joaquin_River_Basin_Plan_Beneficial_Uses/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Sacramento_and_San_Joaquin_River_Basin_Plan_Beneficial_Uses/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Sacramento_and_San_Joaquin_River_Basin_Plan_Beneficial_Uses/FeatureServer/5'
    },
    // Tulare Basin Plan
    '5T': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Tulare_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Tulare_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Central_Valley_Tulare_Basin_Plan_Beneficial_Uses_gdb/FeatureServer/5'
    },
    '6': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lahontan_Basin_Plan_Beneficial_Uses/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lahontan_Basin_Plan_Beneficial_Uses/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Lahontan_Basin_Plan_Beneficial_Uses/FeatureServer/5'
    },
    '7': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_7C/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_7C/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_7C/FeatureServer/5'
    },
    '8': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_8S/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_8S/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_8S/FeatureServer/5'
    },
    '9': {
        lines: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_9S/FeatureServer/1',
        polys: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_9S/FeatureServer/3',
        table: 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/BP_BeneficialUses_9S/FeatureServer/5'
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
                    TargetLatitude: +d.TargetLatitude,
                    TargetLongitude: +d.TargetLongitude,
                    Region: d.Region.toString(),
                    RegionName: regionDict[d.Region],
                    LastSampleDate: d.LastSampleDate,
                    ResultDisplay: +d.ResultDisplay || null, // Use null if value is not avail; otherwise, ArcGIS JS will use NaN or undefined, which does not match the data type assigned in stationDataFields
                    Unit: d.Unit || null
                }
            };
        });
        resolve(features);
    })
}

// This schema defines what the attributes look like when data is converted to map graphics - and when features are queried from the station layer
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
        name: 'TargetLatitude',
        alias: 'Latitude',
        type: 'double'
    },
    {
        name: 'TargetLongitude',
        alias: 'Longitude',
        type: 'double'
    },
    {
        name: 'Region',
        alias: 'RegionNum',
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
        name: 'ResultDisplay',
        alias: 'Result',
        type: 'double'
    },
    /*
    {
        name: 'MeanDisplay',
        alias: 'Mean',
        type: 'double'
    },
    */
    {
        name: 'Unit',
        alias: 'unit',
        type: 'string'
    }
]