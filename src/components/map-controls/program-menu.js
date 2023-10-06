import React, { useEffect, useState } from 'react';
import LoaderMenu from '../loaders/loader-menu';

import Select from 'react-select';
import { Checkbox } from 'semantic-ui-react';
import { customSelectStyle, programDict } from '../../utils/utils';

import { subMenu} from './program-menu.module.css';

export default function ProgramMenu({ 
    program, 
    programList, 
    setHighlightReferenceSites,
    setProgram 
}) {   
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const handleChange = (selection) => {
        // Clear user selection for cross filtering
        if (selection ) {
            const value = selection.value;
            // Line below used to navigate to another page in the dashboard, saved for reference
            // navigate(`/programs/${value}`);
            setProgram(value);
        } else {
            // Clear the program selection
            setProgram(null)
        }
    }

    const handleReferenceChange = (val) => {
        if (val === true) {
            // If user toggles to highlight reference sites
            setHighlightReferenceSites(true);
        } else {
            setHighlightReferenceSites(false);
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
                <div className={subMenu}>
                    <Checkbox 
                        label='Highlight reference sites' 
                        onChange={(e, data) => handleReferenceChange(data.checked)}
                        style={{ color: '#828282', fontSize: '0.86em', zIndex: 5 }}
                        toggle 
                    />
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <LoaderMenu />
        )
    }
}