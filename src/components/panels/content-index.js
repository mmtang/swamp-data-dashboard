import React, { useRef } from 'react';
import AccordionMenu from '../map-controls/accordion-menu';

import { infoContainer, mainContainer, welcomeHeader } from '../../pages/index.module.css';

export default function ContentIndex({ 
    setAnalyte, 
    setProgram,
    setRegion,
    setSpecies,
    station
}) {  
    const yearRef = useRef(new Date().getFullYear());

    const styleHidden = {
        display: 'none'
    }
    
    return (
        <div className={mainContainer} style={ station ? styleHidden : null }>
            <div className={infoContainer}>
                <h2 className={welcomeHeader}>Explore SWAMP data</h2>
                <p>The <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">Surface Water Ambient Monitoring Program</a> (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. Explore SWAMP data for the time period of 2000-{yearRef.current}.</p>
                <section style={{ marginBottom: '30px' }}>
                    <AccordionMenu
                        setAnalyte={setAnalyte}
                        setProgram={setProgram}
                        setRegion={setRegion}
                        setSpecies={setSpecies}
                    />
                </section>
            </div>
        </div>
    )
}