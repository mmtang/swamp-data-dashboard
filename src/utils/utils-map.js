import { parseDate, formatDate, regionDict } from './utils';

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