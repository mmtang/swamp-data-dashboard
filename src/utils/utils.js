export const chemistryEndpoint = {
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

export const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((resp) => resp.json())
        .then((d) => resolve(d));
    });
}