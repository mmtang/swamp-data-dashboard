import React from 'react';
import { withPrefix } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import ButtonClearStation from '../common/button-clear-station';
import { mainContainer, infoContainer } from '../../pages/index.module.css';

export default function PanelStation({ station, setStation, analyte }) {   
    console.log(station);

    return (
        <div className={mainContainer}>
            {/*
            <div style={{ width: '100%' }}>
                <img
                    src='https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/images/csci_scores_map/105ps0468.jpg'
                    alt={station.StationName}
                />
            </div>
            */}
            <div className={infoContainer}>
                <ButtonClearStation setStation={setStation} />
                <h2 style={{ margin: '12px 0 6px 0' }}>{station.StationName ? station.StationName: null}</h2>
                <span style={{ fontSize: '0.95em', fontWeight: '600' }}>
                    {station.StationCode ? station.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{station.RegionName ? station.RegionName : null}  Region</span>
                <section style={{ margin: '20px 0' }}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui accumsan sit amet nulla facilisi. Maecenas volutpat blandit aliquam etiam erat. Tincidunt arcu non sodales neque sodales. Nunc id cursus metus aliquam eleifend mi in nulla. Nisi est sit amet facilisis magna etiam tempor orci. At erat pellentesque adipiscing commodo. Purus sit amet volutpat consequat. Velit scelerisque in dictum non consectetur a erat nam at. Scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt. Id neque aliquam vestibulum morbi blandit cursus risus at ultrices. Gravida cum sociis natoque penatibus. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Viverra justo nec ultrices dui sapien eget. Quisque non tellus orci ac.

</p>
                </section>
            </div>
        </div>
    )
}