import React from 'react';
import ContentIndex from './content-index.js';

export default function PanelIndex({ 
    setAnalyte, 
    setProgram, 
    setRegion, 
    setSpecies,
    station,
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