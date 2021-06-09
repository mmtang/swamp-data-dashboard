import React from 'react';
import Back from '../common/back';

export default function Region({ selectedRegion, setView, setRegion }) {
    const regionDesc = {
        'North Coast': 'The North Coast Region receives more precipitation than any other part of California. Abundant in surface water and groundwater resources, the North Coast Region constitutes only about 12 percent of the area of California but produces about 40 percent of the annual runoff.',
        'San Francisco Bay': 'The San Francisco Bay Region, centrally located along our state’s coastline, marks a natural topographic separation between the northern and southern coastal mountain ranges. The San Francisco estuary is the largest estuary on the west coast of North and South America and forms the centerpiece of the Bay Area.',
        'Central Coast': 'The Central Coast Region includes all of Santa Cruz, San Benito, Monterey, San Luis Obispo, and Santa Barbara Counties and small portions of several other counties. Prime agricultural lands dominate the bottomlands of many watersheds, and upper watersheds are in rugged national forest lands.',
        'Los Angeles': 'With more than 10 million residents, the Los Angeles Region is the most densely populated region in the state. Agriculture and open space exist alongside urban, residential, commercial and industrial areas.',
        'Central Valley': 'The Central Valley Regional Water Quality Control Board oversees the largest and most diverse region in California, spanning from the Oregon border to the northern tip of Los Angeles County and encompassing all or part of 38 of the 58 California counties.',
        'Lahontan': 'The Lahontan Region is the second largest region in California, spanning 33,000 square miles of eastern California from the Oregon border in the north to the Mojave Desert, San Bernardino mountains and eastern Los Angeles County in the south.',
        'Colorado River': 'The Colorado River Basin Region covers approximately 19,900 square miles in the southeastern corner of California, the most arid area of the state. The region includes all of Imperial County and portions of San Bernardino, Riverside and San Diego Counties.',
        'Santa Ana': 'Although the smallest of California’s nine water quality control boards, the Santa Ana Region is one of the most densely populated, with over 5 million residents distributed over 2800 square miles of three counties, including most of Orange County, and some of the most populated portions of Riverside and San Bernardino Counties.',
        'San Diego': 'The San Diego Region stretches along 85 miles of coastline from Laguna Beach to the Mexican border and extends 50 miles inland to the crest of the coastal mountain range. It encompasses most of San Diego County, southwestern Riverside County and southern Orange County.'
    };

    const handleBackClick = () => {
        setRegion(null);
        setView('home');
    }

    return (
        <React.Fragment>
            <Back handleClick={handleBackClick} />
            <h2>{selectedRegion}</h2>
            <p>{regionDesc[selectedRegion]}</p>
        </React.Fragment>
    )
}