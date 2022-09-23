import React, { useRef } from 'react';
import AccordionMenu from '../map-controls/accordion-menu';

import { infoContainer, mainContainer,  } from '../../pages/index.module.css';

export default function ContentIndex({ 
    analyte, 
    program, 
    region, 
    setAnalyte, 
    setProgram,
    setRegion
}) {  
    const yearRef = useRef(new Date().getFullYear());
    
    return (
        <div className={mainContainer}>
            <div className={infoContainer}>
                <p>The <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">Surface Water Ambient Monitoring Program</a> (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. Explore SWAMP data for the time period of 2000-{yearRef.current}.</p>
                <section style={{ marginBottom: '40px' }}>
                    <AccordionMenu
                        region={region}
                        setRegion={setRegion}
                        analyte={analyte}
                        setAnalyte={setAnalyte}
                        program={program}
                        setProgram={setProgram}
                    />
                </section>
            </div>
        </div>
    )
}