import React, { useEffect, useState } from 'react';
import SelectSearch from 'react-select-search';
import { boxContainer, selectWrapper } from './map-controls.module.css';

export default function RegionMenu() {   
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

    useEffect(() => {
        console.log('hey')
    }, []);

    const handleChange = (value) => {
        alert(value);
    }

    return (
        <div className={boxContainer}>
            Select a <span className="emphasis">Region</span>
            <div className={selectWrapper}>
                <SelectSearch
                    options={regionList} 
                    placeholder="Example: Central Coast"
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}