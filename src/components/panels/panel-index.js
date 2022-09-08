import React from 'react';
import ContentIndex from './content-index.js';
//import ContentSpot from './content-spot';

export default function PanelIndex({ 
    region, 
    setRegion, 
    analyte, 
    setAnalyte, 
    program, 
    setProgram, 
    stationData 
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
                    region={region}
                    setRegion={setRegion}
                    analyte={analyte}
                    setAnalyte={setAnalyte}
                    program={program}
                    setProgram={setProgram}
                />
            )
        }
    }

    return (
        getContent()
    )
}