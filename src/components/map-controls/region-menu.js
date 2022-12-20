import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

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
            setRegion(null)
        }
    }

    useEffect(() => {
        if (region) {
            setSelected({ label: regionDict[region], value: region })
        } else {
            setSelected(null);
        }
    }, [region])

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