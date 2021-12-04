import React from 'react';
import Select from 'react-select';
import { customSelectStyle, programDict, programNameDict } from '../../utils/utils';


export default function RegionMenu({ program, setProgram }) {   
    const programList = [
        {
            label: programDict['bioaccumulation'],
            value: 'bioaccumulation'
        },
        {
            label: programDict['bioassessment'],
            value: 'bioassessment'
        },
        {
            label: programDict['fhab'],
            value: 'fhab'
        },
        {
            label: programDict['spot'],
            value: 'spot'
        }
    ];

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            if (value !== program) {
                setProgram(value);
            }
        } else {
            // Clear the program selection
            if (selection !== program) {
                setProgram(null)
            }
        }
    }

    return (
        <React.Fragment>
            <Select
                options={programList} 
                isClearable={true}
                isSearchable={true}
                placeholder='Program'
                onChange={handleChange}
                styles={customSelectStyle}
                maxMenuHeight={200}
                //isDisabled={true}
            />
        </React.Fragment>
    )
}