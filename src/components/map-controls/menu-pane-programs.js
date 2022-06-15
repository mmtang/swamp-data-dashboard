import React from 'react';
import { programDict } from '../../utils/utils';
import { card, programName, programDescription } from './menu-pane-programs.module.css';

export default function MenuPanePrograms() {   
    const programs = [
        {
            label: programDict['bioassessment'],
            description: 'Assesses the health of streams and rivers by surveying the aquatic life living in a waterbody and compares the results to expected conditions.'
        },
        {
            label: programDict['spot'],
            description: 'Monitors trends in sediment toxicity and sediment contaminant concentrations and relates contaminant concentrations to watershed land uses.'
        }
    ]

    return (
        <div>
            { programs.map(d => {
                return (
                    <div className={card}>
                        <div className={programName}>{d.label}</div>
                        <div className={programDescription}>{d.description}</div>
                    </div>
                )
            }) }
        </div>
    )
}