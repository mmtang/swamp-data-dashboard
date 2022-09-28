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
    station
}) {   
    const getContent = () => {
        return (
            <ContentIndex 
                analyte={analyte}
                program={program}
                region={region}
                setAnalyte={setAnalyte}
                setProgram={setProgram}
                setRegion={setRegion} 
                station={station}
            />
        )
    }

    return (
        getContent()
    )
}