import { format, timeParse, timeFormat } from 'd3';
import { roundPlaces } from '../constants/constants-app';
import { analyteScoringCategories } from '../constants/constants-data';

export const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
export const formatDate = timeFormat('%Y/%m/%d');
export const formatNumber = format(',');

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const chemistryEndpoint = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4';

export const chemistryResourceId = '2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e';
export const habitatResourceId = '6d9a828a-d539-457e-922c-3cb54a6d4f9b';
export const tissueResourceId = '6f848c25-c1cf-44d0-80a0-5f63b9939a41';
export const toxicityResourceId = 'a6dafb52-3671-46fa-8d42-13ddfa36fd49';
export const stationsResourceId = 'df69fdd7-1475-4e57-9385-bb1514f0291e';

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

// Region values that are valid for use as url params
// Ex: ?region=north_coast
export const regionUrlDict = {
    'north_coast': 1,
    'sf_bay': 2,
    'central_coast': 3,
    'los_angeles': 4,
    'central_valley': 5,
    'lahontan': 6,
    'colorado_river': 7,
    'santa_ana': 8,
    'san_diego': 9
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

/* 1/11/23 - Delete this after finding and changing the components still using it */
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
    }),
    menu: (provided) => ({ 
        ...provided, zIndex: 9999 
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

// Used for cleaning up characters that can mess up API requests, mainly used for analyte names
export const cleanParameter = (str) => { 
    return str.replace(/'/g, "''"); // replace single quote with two single quotes;
}

export const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    // Return alpha 255 for full opacity
    return ([r, g, b, 255]);
}

// Don't use the .toFixed function - it has some issues with rounding up/down .5
// https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
export const round = (num, precision) => {
    var base = 10 ** precision;
    return (Math.round(num * base) / base).toFixed(precision);
};

// This function rounds a number to a number of decimal places as needed so that the returned number is above 0
// Round up to 5 decimal places as needed (this can be changed)
export const roundAsNeeded = (num) => {
    for (let step = roundPlaces; step < 6; step++)
        if ((+num).toFixed(step) > 0) {
            return +(+num).toFixed(step + 1); // Add one to ensure that leading number is not rounded to next place
        }
    return num;
}

// Return the CSCI score category given the provided value
// Either returns 'Likely intact' for non-reference sites or 'Likely intact (Reference)' for reference sites
export const getCsciCategoryValue = (row, refText = true) => {
    const csciCategories = analyteScoringCategories['csci'];
    for (let i = 0; i < csciCategories.length; i++) {
        let stringText = '';
        const result = row['ResultDisplay'];
        if ((result >= csciCategories[i].lowerValue) && (result < csciCategories[i].upperValue)) {
            stringText += csciCategories[i].label;
            if (refText === true && row['StationCategory'] === 'Reference') {
                stringText += ' (Reference site)'
            }
            return stringText;
        } 
    }
}

// Return the IPI score category given the provided value
export const getIpiCategoryValue = (row, refText = true) => {
    const ipiCategories = analyteScoringCategories['ipi'];
    for (let i = 0; i < ipiCategories.length; i++) {
        let stringText = '';
        const result = row['ResultDisplay'];
        if ((result >= ipiCategories[i].lowerValue) && (result < ipiCategories[i].upperValue)) {
            stringText += ipiCategories[i].label;
            if (refText === true && row['StationCategory'] === 'Reference') {
                stringText += ' (Reference site)'
            }
            return stringText;
        } 
    }
}


