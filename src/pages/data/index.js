import React from 'react';
import { Link, withPrefix } from 'gatsby';
import LayoutInfo from '../../components/layout/layout-info';
import { main } from '../pages.module.css';
import { imageSetContainer } from './index.module.css';


export default function DataIndex() {
    return (
        <LayoutInfo active='data'>
            <div className={main}>
                <h1>Accessing the data</h1>
                <h2>About</h2>
                <p>The SWAMP Data dashboard uses data from the <a href='http://ceden.org' target='_blank' rel='noreferrer noopener'>California Environmental Data Exchange Network</a> (CEDEN). All data are from the "Water Quality" and "Habitat" result categories with plans to add sediment, toxicity, and tissue data in future iterations. The data is refreshed on a weekly basis, usually Monday mornings (Pacific Time). There might be delays due to holidays and staff availability.</p> 
                <p>The SWAMP Data Dashboard features a subset of all the SWAMP data available on CEDEN. The entire SWAMP dataset with all parameters far exceeds what this application is capable of handling. With input from others, we selected what we thought would be the most useful parameters to show. We welcome your feedback: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.</p>
                <h2>Data quality</h2>
                <p>All data records displayed on the SWAMP Data Dashboard and uploaded to the California Open Data Portal are assigned a provisional data quality category. The data quality category describes the overall quality of the record by taking into account various values (e.g., SampleTypeCode, BatchVerification, ResultQualCode, QACode) present in the data record. The categories are intended to help users interpret the data quality metadata provided with the associated result. Records assigned a data quality category of "Passed", "Some review needed", "Spatial accuracy unknown", or "Unknown data quality" are displayed on the dashboard and used to <Link to='/learn/trends'>calculate trends</Link>. The full datasets, including records from the other data categories ("Extensive review needed", "Reject record", 'Metadata"), are available for download on the <a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program' target='_blank' rel='noreferrer noopener'>California Open Data Portal</a>. This <a href='https://docs.google.com/spreadsheets/d/1q-tGulvO9jyT2dR9GGROdy89z3W6xulYaci5-ezWAe0/edit?usp=sharing' target='_blank' rel='noreferrer noopener'>document</a> provides a working explanation of the data quality assignments and categories.</p>
                <h2>Download</h2>
                <h3>Results data</h3>
                <p>The results data displayed in the time series graphs can be downloaded directly from the dashboard. The downloaded data are formatted as tab-delimited text files (.tsv).</p>
                <div className={imageSetContainer}>
                    <img src={withPrefix("download-data-graph.png")} alt='Screenshot of dashboard graph showing download button' />
                </div>
                <p>The full datasets (including all data quality categories) are available for download as comma-delimited text files (.csv) on the California Open Data Portal. The portal offers an OData connection and a REST application programing interface (API) interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/8d5331c8-e209-4ec0-bf1e-2c09881278d4' target='_blank' rel='noreferrer noopener'>Chemistry results</a></li>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/9ce012e2-5fd3-4372-a4dd-63294b0ce0f6' target='_blank' rel='noreferrer noopener'>Habitat results</a></li>
                </ul>
                <p>The original, unmodified datasets are available for download on the CEDEN website. Navigate to the <a href='https://ceden.waterboards.ca.gov/AdvancedQueryTool' target='_blank' rel='noreferrer noopener'>CEDEN Advanced Query Tool</a>, select a result category, and then select "Surface Water Ambient Monitoring Program" from the Programs select menu.</p>

                <h3>Summary data</h3>
                <p>The summary data featured in the map and tables can be downloaded directly from the dashboard as tab-delimited text files (.tsv).</p>
                <div className={imageSetContainer}>
                    <img src={withPrefix("download-data-table.png")} alt='Screenshot of data table showing download button' />
                </div>
                <p>The summary data can also be downloaded as comma-delimited text files (.csv) on the California Open Data Portal. The portal offers an OData connection and a REST API interface for accessing the data via HTTP requests.</p>
                <ul>
                    <li><a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/555ee3bf-891f-4ac4-a1fc-c8855cf70e7e' target='_blank' rel='noreferrer noopener'>Station summary data (with trends)</a></li>
                </ul>
            </div>
        </LayoutInfo>
    )
}

