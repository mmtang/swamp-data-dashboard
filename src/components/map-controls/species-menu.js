import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

import Select from 'react-select';
import { customSelectStyle } from '../../utils/utils';

export default function SpeciesMenu({ setSpecies, species, speciesList }) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            // Line below used to navigate to another page in the dashboard, saved for reference
            // navigate(`/programs/${value}`);
            setSpecies(value);
        } else {
            // Clear the program selection
            setSpecies(null)
        }
    }

    useEffect(() => {
        if (species) {
            setSelected({ label: programDict[program], value: program });
        } else {
            setSelected(null);
        }
    }, [species]);

    useEffect(() => {
        if (speciesList) {
            setLoading(false);
        }
    }, [speciesList]);

    if (!loading) {
        return (
            <React.Fragment>
                <Select
                    options={speciesList} 
                    isClearable={true}
                    isLoading={loading}
                    isSearchable={true}
                    placeholder='Species'
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