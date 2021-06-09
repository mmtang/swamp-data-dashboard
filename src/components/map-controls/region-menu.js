import React from 'react';
import SelectSearch from 'react-select-search';
import RegionCard from './region-card';
import { boxContainer, selectWrapper } from './map-controls.module.css';

export default function RegionMenu({ selectedRegion, setRegion, setView }) {   
    const regionList = [
        {
            name: 'North Coast',
            value: 'North Coast'
        },
        {
            name: 'San Francisco Bay',
            value: 'San Francisco Bay'
        },
        {
            name: 'Central Coast',
            value: 'Central Coast'
        },
        {
            name: 'Los Angeles',
            value: 'Los Angeles'
        },
        {
            name: 'Central Valley',
            value: 'Central Valley'
        },
        {
            name: 'Lahontan',
            value: 'Lahontan'
        },
        {
            name: 'Colorado River',
            value: 'Colorado River'
        },
        {
            name: 'Santa Ana',
            value: 'Santa Ana'
        },
        {
            name: 'San Diego',
            value: 'San Diego'
        }
    ];

    const handleChange = (value) => {
        if (value !== selectedRegion) {
            setRegion(value);
            setView('region');
        }
    }

    return (
        <div className={boxContainer}>
            Select a <span className="emphasis">region</span>
            <div className={selectWrapper}>
                <SelectSearch
                    options={regionList} 
                    placeholder="Example: Central Coast"
                    onChange={handleChange}
                />
            </div>
            { selectedRegion ? <RegionCard selectedRegion={selectedRegion} /> : null }
        </div>
    )
}