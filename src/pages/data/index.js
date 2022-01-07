import React from 'react';
import LayoutInfo from '../../components/layout/layout-info';
import { main } from '../pages.module.css';
import { imageSetContainer } from './index.module.css';


export default function DataIndex() {
    return (
        <LayoutInfo active='data'>
            <div className={main}>
                <h1>Accessing the data</h1>
                <h2>About</h2>
                <p>The data used in the SWAMP Data dashboard is sourced from the <a href='http://ceden.org' target='_blank' rel='noreferrer noopener'>California Environmental Data Exchange Network</a> (CEDEN). The dashboard currently uses data from the "Water Quality" and "Habitat" result categories with plans to add "Toxicity" and "Tissue" data in future iterations. The data is refreshed on a weekly basis, usually Monday mornings (Pacific Time). We try to update the dashboard in a timely, regular manner, but there may be delays due to holidays and staff availability.</p>
                <p>Note that the SWAMP Data Dashboard features a subset of all the SWAMP data available on CEDEN. The entire SWAMP dataset with all parameters far exceeds what this application is capable of handling. With input from others, we selected what we thought would be the most useful parameters to show. We welcome your feedback: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.</p>
                <h2>Download</h2>
                <h3>Results data</h3>
                <p>The results data displayed in the time series graphs can be downloaded directly from the dashboard. The downloaded data are formatted as tab-delimited text files (.tsv).</p>
                <div className={imageSetContainer}>
                    <img src="\download-data-graph.png" alt='Screenshot of dashboard graph showing download button' />
                </div>
                <p>The full datasets are available for download as comma-delimited text files (.csv) on the California Open Data Portal. The portal offers an OData connection and a REST application programing interface (API) interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/8d5331c8-e209-4ec0-bf1e-2c09881278d4' target='_blank' rel='noreferrer noopener'>Chemistry results</a></li>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/9ce012e2-5fd3-4372-a4dd-63294b0ce0f6' target='_blank' rel='noreferrer noopener'>Habitat results</a></li>
                </ul>
                <p>The original, unmodified datasets are available for download on the CEDEN website. Navigate to the <a href='https://ceden.waterboards.ca.gov/AdvancedQueryTool' target='_blank' rel='noreferrer noopener'>CEDEN Advanced Query Tool</a>, select a result category, and then select "Surface Water Ambient Monitoring Program" from the Programs select menu.</p>

                <h3>Summary data</h3>
                <p>The summary data featured in the map and tables can be downloaded directly from the dashboard as tab-delimited text files (.tsv).</p>
                <div className={imageSetContainer}>
                    <img src="\download-data-table.png" alt='Screenshot of data table showing download button' />
                </div>
                <p>The summary data can also be downloaded as comma-delimited text files (.csv) on the California Open Data Portal. The portal offers an OData connection and a REST API interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/555ee3bf-891f-4ac4-a1fc-c8855cf70e7e' target='_blank' rel='noreferrer noopener'>Station summary data (with trends)</a></li>
                </ul>
            </div>
        </LayoutInfo>
    )
}

