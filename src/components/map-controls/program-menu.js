import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

import Select from 'react-select';
import { customSelectStyle, programDict } from '../../utils/utils';

export default function ProgramMenu({ 
    programList, 
    selectedProgram, 
    setSelectedProgram 
}) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        // Clear user selection for cross filtering
        if (selection) {
            const value = selection.value;
            // Line below used to navigate to another page in the dashboard, saved for reference
            // navigate(`/programs/${value}`);
            setSelectedProgram(value);
        } else {
            // Clear the program selection
            setSelectedProgram(null)
        }
    }

    useEffect(() => {
        if (selectedProgram) {
            setSelected({ label: programDict[selectedProgram], value: selectedProgram });
        } else {
            setSelected(null);
        }
    }, [selectedProgram]);

    useEffect(() => {
        if (programList) {
            setLoading(false);
        }
    }, [programList]);

    if (!loading) {
        return (
            <React.Fragment>
                <Select
                    options={programList} 
                    isClearable={true}
                    isLoading={loading}
                    isSearchable={true}
                    placeholder='Program'
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