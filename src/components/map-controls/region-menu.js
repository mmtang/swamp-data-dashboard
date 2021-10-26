import React from 'react';
import Select from 'react-select';
import { customSelectStyle } from '../../utils/utils';
//import RegionCard from './region-card';


export default function RegionMenu({ region, setRegion }) {   
    const regionList = [
        {
            label: 'North Coast',
            value: 'North Coast'
        },
        {
            label: 'San Francisco Bay',
            value: 'San Francisco Bay'
        },
        {
            label: 'Central Coast',
            value: 'Central Coast'
        },
        {
            label: 'Los Angeles',
            value: 'Los Angeles'
        },
        {
            label: 'Central Valley',
            value: 'Central Valley'
        },
        {
            label: 'Lahontan',
            value: 'Lahontan'
        },
        {
            label: 'Colorado River',
            value: 'Colorado River'
        },
        {
            label: 'Santa Ana',
            value: 'Santa Ana'
        },
        {
            label: 'San Diego',
            value: 'San Diego'
        }
    ];

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            if (value !== region) {
                setRegion(value);
            }
        } else {
            if (selection !== region) {
                setRegion(selection)
            }
        }
    }

    return (
        <React.Fragment>
            <Select
                options={regionList} 
                isClearable={true}
                isSearchable={true}
                placeholder='Region'
                onChange={handleChange}
                styles={customSelectStyle}
                maxMenuHeight={200}
            />
            {/*
            { selectedRegion ? <RegionCard selectedRegion={selectedRegion} /> : null }
            */}
        </React.Fragment>
    )
}