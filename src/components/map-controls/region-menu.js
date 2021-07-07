import React from 'react';
import Select from 'react-select';
//import RegionCard from './region-card';
import ClearFilter from './clear-filter';

export default function RegionMenu({ selectedRegion, setRegion }) {   
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

    const customStyle = {
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

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            if (value !== selectedRegion) {
                setRegion(value);
            }
        } else {
            if (selection !== selectedRegion) {
                setRegion(selection)
            }
        }
    }

    return (
        <React.Fragment>
            <Select
                options={regionList} 
                isClearable={true}
                //value={ selectedRegion ? selectedRegion : '' }
                placeholder='Region'
                onChange={handleChange}
                styles={customStyle}
                maxMenuHeight={200}
            />
            {/*
            { selectedRegion ? <ClearFilter clearFunction={setRegion} /> : null}
            */}
            {/*
            { selectedRegion ? <RegionCard selectedRegion={selectedRegion} /> : null }
            */}
        </React.Fragment>
    )
}