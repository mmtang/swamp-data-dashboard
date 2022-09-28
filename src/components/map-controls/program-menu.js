import React from 'react';
//import { navigate, withPrefix } from 'gatsby';
import Select from 'react-select';
import { customSelectStyle, programDict } from '../../utils/utils';


export default function RegionMenu({ program, setProgram }) {   
    const programList = [
        {
            label: programDict['bioaccumulation'],
            value: 'bioaccumulation',
            isDisabled: true
        },
        {
            label: programDict['bioassessment'],
            value: 'bioassessment',
            isDisabled: true
        },
        {
            label: programDict['fhab'],
            value: 'fhab',
            isDisabled: true
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
                // Line below used to navigate to another page in the dashboard
                // navigate(`/programs/${value}`);
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
            />
        </React.Fragment>
    )
}