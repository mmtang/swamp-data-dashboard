import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

import Select from 'react-select';
import { customSelectStyle, regionDict, regionNumDict } from '../../utils/utils';

export default function RegionMenu({ regionList, selectedRegion, setSelectedRegion }) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        if (selection) {
            const value = selection.value;
            setSelectedRegion(regionNumDict[value]);
        } else {
            setSelectedRegion(null)
        }
    }

    useEffect(() => {
        if (selectedRegion) {
            setSelected({ label: regionDict[selectedRegion], value: selectedRegion })
        } else {
            setSelected(null);
        }
    }, [selectedRegion])

    useEffect(() => {
        if (regionList) {
            setLoading(false);
        }
    }, [regionList]);

    if (!loading) {
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
            </React.Fragment>
        )
    } else {
        return (
            <LoaderMenu />
        )
    }
    
}