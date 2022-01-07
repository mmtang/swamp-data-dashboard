import React from 'react';
import LayoutInfo from '../../components/layout/layout-info';
import { main } from '../pages.module.css';

export default function DataIndex() {
    return (
        <LayoutInfo active='data'>
            <div className={main}>
                <h1>Accessing the data</h1>
                <h2>About</h2>
                <p>The data used in the SWAMP Data dashboard is sourced from the <a href='http://ceden.org' target='_blank' rel='noreferrer noopener'>California Environmental Data Exchange Network</a> (CEDEN). The dashboard currently uses data from the "Water Quality" and "Habitat" data categories with plans to add "Toxicity" and "Tissue" data in future iterations. The data is refreshed on a weekly basis, usually Monday mornings (Pacific Time). We try to update the dashboard in a timely, regular manner, but there may be delays due to holidays and staff availability.</p>
                <p>Note that the SWAMP Data Dashboard features a subset of all SWAMP data available on CEDEN. The amount of data available on CEDEN far exceeds what this application is capable of handling. With input from others, we selected what we thought would be the most useful parameters to display. Please contact us if you have any feedback.</p>
                <h2>Download</h2>
                <h3>Results data</h3>
                <p>The results data can be downloaded using the dashboard interface. The downloaded data are offered as tab-delimited text files.</p>
                <img src="\download-dashboard-1.png" alt='Screenshot of dashboard graph showing download button' style={{ display: 'block', margin: 'auto', maxWidth: '400px' }} />
                <img src="\download-dashboard-2.png" alt='Screenshot of dashboard graph showing download button' style={{ display: 'block', margin: 'auto', maxWidth: '400px' }} />
                <p>The full datasets are available for download as comma-delimited text files on the California Open Data Portal. The portal offers an OData connection and a REST application programing interface (API) interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li>Chemistry results</li>
                    <li>Habitat results</li>
                </ul>
                <p>The original, unmodified datasets are available for download on the CEDEN website. Navigate to the CEDEN Query Tool, select a result category, and then select "Surface Water Ambient Monitoring Program" from the Programs select menu.</p>

                <h3>Summary data</h3>
                <p>The summary data featured in the map and tables can be downloaded as tab-delimited text files using the dashboard interface.</p>
                <p>The summary data can be downloaded as comma-delimited text files on the California Open Data Portal. The portal offers an OData connection and a REST API interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li>Station summary data (with trends)</li>
                </ul>
            </div>
        </LayoutInfo>
    )
}

