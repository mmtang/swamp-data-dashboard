import React from 'react';
import ButtonClearStation from '../common/button-clear-station';
import ButtonStationPage from '../spot/button-station-page';
import ChartContainer from '../spot/chart-container';

import { Icon } from 'semantic-ui-react';

import { mainContainer, infoContainer } from '../../pages/index.module.css';
import { buttonContainer, chartSection, iconContainer, infoSubText, stationCover, stationHeader, stationSubText, topContainer } from './panel-station.module.css';

export default function PanelStation({ station, setStation, analyte }) {   
    return (
        <div className={mainContainer}>
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
                <h2 className={stationHeader}>{station.StationName ? station.StationName: null}</h2>
                <span className={infoSubText}>
                    {station.StationCode ? station.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{station.RegionName ? station.RegionName : null}  Region
                </span>
                <div className={buttonContainer}>
                    <ButtonStationPage stationCode={station.StationCode} />
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