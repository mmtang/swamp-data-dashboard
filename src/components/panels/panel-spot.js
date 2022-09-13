import React from 'react';
import ButtonClearProgram from '../common/button-clear-program';
import SpotMenu from '../map-controls/spot-menu';

import { mainContainer, infoContainer } from '../../pages/index.module.css';


export default function PanelSpot({ setStationData, setAnalyte, setRegion, stationData }) {   
    return (
        <div className={mainContainer}>
            <div className={infoContainer}>
                <ButtonClearProgram />
                <h2 style={{ marginTop: '18px' }}>Stream Pollution Trends Monitoring Program</h2>
                <section>
                    <p>The <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/spot/" target="_blank" rel="noopener noreferrer">Stream Pollution Trends (SPoT) Monitoring Program</a> conducts statewide monitoring to provide information on the condition of California waterways with respect to trends in sediment toxicity and contamination. SPoT data are currently used by the Water Boards to assess the levels to which aquatic life beneficial uses are supported in California streams and rivers.</p>
                </section>
                <section>
                    <div>
                        <SpotMenu setStationData={setStationData} setAnalyte={setAnalyte} setRegion={setRegion} />
                    </div>
                </section>
            </div>
        </div>
    )
}