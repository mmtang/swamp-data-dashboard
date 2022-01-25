import React from 'react';
import { withPrefix } from 'gatsby';
import ChartIndex from '../chart-index/chart-index';
import { Icon } from 'semantic-ui-react';
import { buttonWrapper } from './popup.module.css';

export default function StationAnalytePopup({ attributes, analyte }) {
    let programs = '';
    programs += attributes['bioaccumulation'] === 'True' ? 'Bioaccumulation' : '';
    programs += attributes['bioassessment'] === 'True' ? 'Bioassessment' : '';
    programs += attributes['fhab'] === 'True' ? 'FHABs' : '';
    programs += attributes['spot'] === 'True' ? 'SPoT' : '';
    programs = programs.length === 0 ? 'None' : programs;

    return (
        <div>
            <div>
                <table className="popup-table">
                    <colgroup>
                        <col span="1" style={{ width: '40%' }}></col>
                        <col span="1" style={{ width: '60%' }}></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>Station code</td>
                            <td>{attributes['StationCode']}</td>
                        </tr>
                        <tr>
                            <td>Region</td>
                            <td>{attributes['RegionName']}</td>
                        </tr>
                        <tr>
                            <td>Statewide program(s)</td>
                            <td>{programs}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ margin: '0.4em 0'}}>
                <ChartIndex 
                    text='Graph data'
                    selectedSites={[attributes['StationCode']]} 
                    analyte={analyte} 
                />
            </div>
            <div className={buttonWrapper}><a href={withPrefix('/stations/' + attributes['StationCode'])} target="_blank" rel="noopener noreferrer" className="popup-button">View all station data&nbsp;&nbsp;<Icon name='external' /></a></div>
        </div>
    )
};