import React from 'react';
import Select from 'react-select';
import { customSelectStyle } from '../../utils/utils';


export default function RegionMenu({ program, setProgram }) {   
    const programList = [
        {
            label: 'Bioaccumulation Monitoring Program',
            value: 'Bioaccumulation Monitoring Program'
        },
        {
            label: 'Bioassessment Monitoring Program',
            value: 'Bioassessment Monitoring Program'
        },
        {
            label: 'Freshwater and Estuarine HABs Program',
            value: 'Freshwater and Estuarine HABs Program'
        },
        {
            label: 'Stream Pollution Trends Monitoring Program',
            value: 'Stream Pollution Trends Monitoring Program'
        }
    ];

    const handleChange = (selection) => {
        if (selection ) {
            const value = selection.value;
            if (value !== program) {
                setProgram(value);
            }
        } else {
            if (selection !== program) {
                setProgram(selection)
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
                isDisabled={true}
            />
        </React.Fragment>
    )
}