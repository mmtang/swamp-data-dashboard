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

export const colorPaletteViz = ['#1f77b4', '#ff7f0e', '#2ca02c', '#af7aa1', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

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
        name: 'Region',
        alias: 'Region',
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
    }
]

export const stationDataTableFields = [
    {
        name: 'RegionName',
        label: 'Region'
    },
    {
        name: 'StationName',
        label: 'Name'
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
        name: 'Region',
        alias: 'Region',
        type: 'string'
    },
    {
        name: 'RegionName',
        alias: 'Region',
        type: 'string'
    },
    {
        name: 'Analyte',
        alias: 'Analyte',
        type: 'string'
    },
    {
        name: 'LastSampleDate',
        alias: 'Last Sample',
        type: 'string'
    },
    {
        name: 'Trend',
        alias: 'Trend',
        type: 'string'
    }
];

export const stationSummaryTableFields = [
    {
        name: 'RegionName',
        label: 'Region'
    },
    {
        name: 'StationName',
        label: 'Name'
    },
    {
        name: 'LastSampleDate',
        label: 'Last Sample',
        direction: 'desc'
    },
    {
        name: 'Analyte',
        label: 'Analyte',
    },
    {
        name: 'Trend',
        label: 'Trend'
    }
];

export const stationRenderer = {
    type: 'simple',
    symbol: {
        type: 'simple-marker',
        size: 5.5,
        color: '#fff',
        outline: {
            color: '#2a2a29',
            width: 1
        }
    }
}

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
