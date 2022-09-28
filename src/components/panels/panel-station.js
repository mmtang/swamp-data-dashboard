import React from 'react';
import ButtonClearStation from '../common/button-clear-station';
import ButtonExploreData from '../common/button-explore-data';
import ButtonZoomStation from '../common/button-zoom-station';
import ChartContainer from '../spot/chart-container';

import { Icon } from 'semantic-ui-react';

import { mainContainer, infoContainer } from '../../pages/index.module.css';
import { buttonContainer, buttonGrid, chartSection, iconContainer, infoSubText, stationCover, stationHeader, stationSubText, topContainer } from './panel-station.module.css';

export default function PanelStation({ 
    analyte,
    setStation, 
    setZoomToStation,
    station
}) {   
    const stationStyle = {
        display: 'none'
    }

    return (
        <div className={mainContainer} style={ !station ? stationStyle : null }>
            {/*
            <div>
                <img
                    src='https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/images/csci_scores_map/105ps0468.jpg'
                    className={stationCover}
                    alt={station.StationName}
                />
            </div>
            */}
            <div className={infoContainer}>
                <div className={topContainer}>
                    <div className={iconContainer}>
                        <Icon name='map marker' color='grey' />
                        <span className={stationSubText}>Monitoring Station</span>
                    </div>
                    <ButtonClearStation setStation={setStation} />
                </div>
                <h2 className={stationHeader}>{station ? station.StationName: null}</h2>
                <span className={infoSubText}>
                    {station ? station.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{station ? station.RegionName : null}  Region
                </span>
                <div className={buttonGrid}>
                    <div className={buttonContainer}>
                        <ButtonExploreData stationCode={station ? station.StationCode : null} />
                    </div>
                    <div className={buttonContainer}>
                        <ButtonZoomStation 
                            setZoomToStation={setZoomToStation} 
                            station={station ? station.StationCode : null}
                        />
                    </div>
                </div>
                <section className={chartSection}>
                    { analyte ? 
                    // Show chart if an analyte is selected
                    <ChartContainer station={station.StationCode} analyte={analyte} />
                    // Show nothing if an analyte is not selected
                    : null }
                </section>
            </div>
        </div>
    )
}