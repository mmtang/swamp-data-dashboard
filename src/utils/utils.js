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