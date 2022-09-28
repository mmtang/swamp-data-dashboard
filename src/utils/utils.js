import { timeParse, timeFormat } from 'd3';

export const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
export const formatDate = timeFormat('%Y/%m/%d');

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const chemistryEndpoint = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4';

export const cedenChemistryEndpoint = {
    2021: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=dde19a95-504b-48d7-8f3e-8af3d484009f',
    2020: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=2eba14fa-2678-4d54-ad8b-f60784c1b234',
    2019: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=6cf99106-f45f-4c17-80af-b91603f391d9',
    2018: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=f638c764-89d5-4756-ac17-f6b20555d694',
    2017: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=68787549-8a78-4eea-b5b9-ef719e65a05c',
    2016: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=42b906a2-9e30-4e44-92c9-0f94561e47fe',
    2015: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=7d9384fa-70e1-4986-81d6-438ce5565be6',
    2014: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=7abfde16-61b6-425d-9c57-d6bd70700603',
    2013: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=341627e6-a483-4e9e-9a85-9f73b6ddbbba',
    2012: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=f9dd0348-85d5-4945-aa62-c7c9ad4cf6fd',
    2011: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=4d01a693-2a22-466a-a60b-3d6f236326ff',
    2010: 'https://data.ca.gov/api/3/action/datastore_search?resource_id=572bf4d2-e83d-490a-9aa5-c1d574e36ae0'
}

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


