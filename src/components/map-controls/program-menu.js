import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

import Select from 'react-select';
import { customSelectStyle, programDict } from '../../utils/utils';


export default function ProgramMenu({ program, programList, setProgram }) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            // Line below used to navigate to another page in the dashboard, sved for reference
            // navigate(`/programs/${value}`);
            setProgram(value);
        } else {
            // Clear the program selection
            setProgram(null)
        }
    }

    useEffect(() => {
        if (program) {
            setSelected({ label: programDict[program], value: program });
        } else {
            setSelected(null);
        }
    }, [program]);

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