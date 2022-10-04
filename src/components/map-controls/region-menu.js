import React, { useEffect, useState } from 'react';
import MenuLoader from './menu-loader';

import Select from 'react-select';
import { customSelectStyle, regionDict, regionNumDict } from '../../utils/utils';


export default function RegionMenu({ region, regionList, setRegion }) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            setRegion(regionNumDict[value]);
        } else {
            // Clear the region selection
            setRegion(null)
        }
    }

    useEffect(() => {
        if (regionList) {
            setLoading(false);
        }
    }, [regionList]);

    useEffect(() => {
        if (region) {
            setSelected({ label: regionDict[region], value: region })
        } else {
            setSelected(null);
        }
    }, [region])

    if (loading === true) {
        return (
            <MenuLoader />
        )
    } else {
        return (
            <React.Fragment>
                <Select
                    options={regionList} 
                    isClearable={true}
                    isLoading={loading}
                    isSearchable={true}
                    placeholder='Region'
                    onChange={handleChange}
                    styles={customSelectStyle}
                    maxMenuHeight={200}
                    value={selected}
                />
                {/*
                { selectedRegion ? <RegionCard selectedRegion={selectedRegion} /> : null }
                */}
            </React.Fragment>
        )
    }
}