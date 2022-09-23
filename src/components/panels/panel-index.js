import React from 'react';
import ContentIndex from './content-index.js';
//import ContentSpot from './content-spot';

export default function PanelIndex({ 
    analyte,
    program, 
    region, 
    setAnalyte, 
    setProgram, 
    setRegion, 
}) {   
    const getContent = () => {
        if (program) {
            switch(program) {
                case 'spot':
                    return null;
                default:
                    return null;
            }
        } else {
            return (
                <ContentIndex 
                    analyte={analyte}
                    program={program}
                    region={region}
                    setAnalyte={setAnalyte}
                    setProgram={setProgram}
                    setRegion={setRegion} 
                />
            )
        }
    }

    return (
        getContent()
    )
}