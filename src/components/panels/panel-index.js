import React from 'react';
import ContentIndex from './content-index.js';

export default function PanelIndex({ 
    analyte,
    program, 
    region, 
    setAnalyte, 
    setHighlightReferenceSites,
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
                setAnalyte={setAnalyte}
                setProgram={setProgram}
                setRegion={setRegion} 
                setSpecies={setSpecies}
                station={station}
            />
        )
    }

    return (
        getContent()
    )
}