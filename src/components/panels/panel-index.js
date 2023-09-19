import React from 'react';
import ContentIndex from './content-index.js';

export default function PanelIndex({ 
    analyte,
    program, 
    region, 
    setAnalyte, 
    setProgram, 
    setRegion, 
    setSpecies,
    species,
    station,
    stationData
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
                setSpecies={setSpecies}
                species={species}
                station={station}
                stationData={stationData}
            />
        )
    }

    return (
        getContent()
    )
}