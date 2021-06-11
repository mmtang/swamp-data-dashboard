import React from 'react';
import SelectSearch from 'react-select-search';
//import RegionCard from './region-card';
import ClearFilter from './clear-filter';
import { boxContainer, selectWrapper, titleWrapper } from './map-controls.module.css';

export default function RegionMenu({ selectedRegion, setRegion }) {   
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
        }
    }

    return (
        <div className={boxContainer}>
            <div className={titleWrapper}>
                <div>Select a <span className="emphasis">Region</span></div>
                { selectedRegion ? <ClearFilter clearFunction={setRegion} /> : null }
            </div>
            <div className={selectWrapper}>
                <SelectSearch
                    options={regionList} 
                    value={ selectedRegion ? selectedRegion : '' }
                    onChange={handleChange}
                />
            </div>
            {/*
            { selectedRegion ? <RegionCard selectedRegion={selectedRegion} /> : null }
            */}
        </div>
    )
}