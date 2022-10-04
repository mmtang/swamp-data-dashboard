import { timeParse, timeFormat } from 'd3';

export const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
export const formatDate = timeFormat('%Y/%m/%d');

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const chemistryEndpoint = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4';

export const chemistryResourceId = '2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e';
export const habitatResourceId = '6d9a828a-d539-457e-922c-3cb54a6d4f9b';
export const toxicityResourceId = 'a6dafb52-3671-46fa-8d42-13ddfa36fd49';

export const programDict = {
    'bioaccumulation': 'Bioaccumulation Monitoring Program',
    'bioassessment': 'Bioassessment Monitoring Program',
    'fhab': 'Freshwater and Estuarine HABs Program',
    'spot': 'Stream Pollution Trends Monitoring Program'
}

export const programNameDict = {
    'Bioaccumulation Monitoring Program': 'bioaccumulation',
    'Bioassessment Monitoring Program': 'bioassessment',
    'Freshwater and Estuarine HABs Program': 'fhab',
    'Stream Pollution Trends Monitoring Program': 'spot'
}

export const regionDict = {
    1: 'North Coast',
    2: 'San Francisco Bay',
    3: 'Central Coast',
    4: 'Los Angeles',
    5: 'Central Valley',
    6: 'Lahontan',
    7: 'Colorado River',
    8: 'Santa Ana',
    9: 'San Diego'
}

export const regionNumDict = {
    'North Coast': '1',
    'San Francisco Bay': '2',
    'Central Coast': '3',
    'Los Angeles': '4',
    'Central Valley': '5',
    'Lahontan': '6',
    'Colorado River': '7',
    'Santa Ana': '8',
    'San Diego': '9'
}

export const irRegionDict = {
    'North Coast': 'Regional Board 1 - North Coast Region',
    'San Francisco Bay': 'Regional Board 2 - San Francisco Bay Region',
    'Central Coast': 'Regional Board 3 - Central Coast Region',
    'Los Angeles': 'Regional Board 4 - Los Angeles Region',
    'Central Valley': 'Regional Board 5 - Central Valley Region',
    'Lahontan': 'Regional Board 6 - Lahontan Region',
    'Colorado River': 'Regional Board 7 - Colorado River Basin Region',
    'Santa Ana': 'Regional Board 8 - Santa Ana Region',
    'San Diego': 'Regional Board 9 - San Diego Region'
}

export const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((resp) => resp.json())
        .then((d) => resolve(d));
    });
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

// Used for station layer table
export const stationDataTableFields = [
    {
        name: 'StationCode',
        label: 'Site ID'
    },
    {
        name: 'StationName',
        label: 'Site Name'
    },
    {
        name: 'RegionName',
        label: 'Region'
    },
    {
        name: 'LastSampleDate',
        label: 'Last Sample',
        direction: 'desc'
    }
]

export const stationSummaryDataFields = [
    {
        name: 'ObjectId',
        alias: 'ObjectId',
        type: 'oid'
    },
    {
        name: 'RegionName',
        alias: 'Region',
        type: 'string'
    },
    {
        name: 'StationCode',
        alias: 'Site ID',
        type: 'string'
    },
    {
        name: 'StationName',
        alias: 'Site Name',
        type: 'string'
    },
    {
        name: 'LastSampleDate',
        alias: 'Last Sample',
        type: 'string'
    },
    {
        name: 'LastResult',
        alias: 'Last Result',
        type: 'double'
    },
    {
        name: 'Unit',
        alias: 'Unit',
        type: 'string'
    },
    {
        name: 'Analyte',
        alias: 'Analyte',
        type: 'string'
    },
    {
        name: 'Trend',
        alias: 'Trend',
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
];

// Used for station layer summary table
export const stationSummaryTableFields = [
    {
        name: 'StationCode',
        label: 'Site ID'
    },
    {
        name: 'StationName',
        label: 'Site Name'
    },
    {
        name: 'RegionName',
        label: 'Region'
    },
    {
        name: 'LastSampleDate',
        label: 'Last Sample',
        direction: 'desc'
    },
    {
        name: 'LastResult',
        label: 'Last Result'
    },
    {
        // There is a bug in ArcGIS that will make the old table fields still show even after changing out the layer. Put the analyte field after the Last Sample date field so that this set of fields more closely resembles that of the station layer set. 
        name: 'Analyte',
        label: 'Analyte',
    },
    {
        name: 'Trend',
        label: 'Trend'
    }
];

export const customSelectStyle = {
    control: (base, state) => ({
        ...base,
        height: 34,
        minHeight: 34,
        color: '#b1b1b1',
        fontSize: '13px',
        border: '1px solid #6e6e6e',
        borderRadius: 0,
        boxShadow: 'none',
        '&:hover': {
            border: '1px solid #6e6e6e'
        }
    }),
    dropdownIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0
    }),
    clearIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0
    })
}

export const convertStationsToGeoJSON = (data) => {
    // converts json to geojson
    return {
        'type': 'FeatureCollection',
        'features': data.map((d) => {
            return {
                'type': 'Feature',
                'geometry': {
                    'coordinates': [d.TargetLongitude, d.TargetLatitude],
                    'type': 'Point'
                },
                'properties': {
                    'StationName': d.StationName,
                    'StationCode': d.StationCode,
                    'Region': d.Region.toString()
                }

            }
        })
    }
}


