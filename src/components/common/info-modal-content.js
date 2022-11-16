import React, { useState } from 'react';
import UpdateMessage from './update-message';

import swampLogo from '../../../static/swamp-logo-black-small.png';
import downloadParameter from '../../../static/download-parameter.png';
import downloadStation from '../../../static/download-station.png';
import { Button, Icon, Menu, Segment } from 'semantic-ui-react';

import { imageSetContainer, modalButton, modalContent, swampIcon } from './info-modal-content.module.css';

export default function InfoModalContent({ setDisclaimerVisible }) {   
    const [activeItem, setActiveItem] = useState('welcome');

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    }

    const WelcomeContent = () => {
        return (
            <div className={modalContent}>
                <img className={swampIcon} src={swampLogo} alt='SWAMP logo' />
                <p>Welcome to the <strong>SWAMP Data Dashboard</strong>, an interactive tool for exploring and downloading data collected by the <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">Surface Water Ambient Monitoring Program</a> (SWAMP).</p>
                <p><Icon name='exclamation triangle' />This dashboard is in <strong>public beta</strong> and may change at any time without prior notification. All data are provisional and should not be used for any particular purpose other than general reference. Feedback and general inquiries: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.</p>
                <p>
                    <button className={modalButton} onClick={() => setDisclaimerVisible(false)} onKeyPress={() => setDisclaimerVisible(false)}>Go to the dashboard</button>
                </p>
                <UpdateMessage />
            </div>
        )
    }

    const DataContent = () => {
        return (
            <div>
                <h3>About</h3>
                <p>The SWAMP Data Dashboard sources data from the <a href='http://ceden.org' rel='noreferrer noopener' target='_blank'>California Environmental Data Exchange Network</a> (CEDEN). The current version of the dashboard features data from the Water Quality, Habitat, and Toxicity result categories. More data (including tissue data) will be added over time.</p>
                <p>The datasets for this dashboard are refreshed on a weekly basis, usually Monday mornings (Pacific Time), dependent on staff availability.</p> 
                <h3>Data quality</h3>
                <p>Data records are assigned a provisional <strong>data quality category</strong>. The data quality category describes the overall quality of the record by taking into account various quality assurance and verification values present in the data record. The categories are intended to help users interpret the data quality metadata provided with the associated result. This <a href='https://docs.google.com/spreadsheets/d/1q-tGulvO9jyT2dR9GGROdy89z3W6xulYaci5-ezWAe0/edit?usp=sharing' rel='noreferrer noopener' target='_blank'>document</a> provides a working explanation of the data quality assignments and categories.</p> 
                <p>This dashboard includes all records assigned a data quality category of "Passed", "Some review needed", "Spatial accuracy unknown", "Extensive review needed", "Unknown data quality" or "Not assessed". The full datasets, including records from the other data quality categories ("Reject record", 'Metadata"), are available for download on the <a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program' rel='noreferrer noopener' target='_blank'>California Open Data Portal</a>.</p>
                <h3>Download</h3>
                <p>Result data can be downloaded directly from the dashboard as comma-separated values (CSV) files.</p>
                <figure className={imageSetContainer}>
                    <img src={downloadParameter} />
                    <figcaption>Download parameter data for all stations</figcaption>
                </figure>
                <figure className={imageSetContainer}>
                    <img src={downloadStation} />
                    <figcaption>Download parameter data for one or more stations</figcaption>
                </figure>
                <p>The full datasets (including all data quality categories) are available for download on the <a href='https://data.ca.gov/dataset/surface-water-ambient-monitoring-program' rel='noreferrer noopener' target='_blank'>California Open Data Portal</a>. The portal offers an OData connection and a REST application programming interface (API) interface for accessing the data via HTTP requests.</p>
                <p>The original, unmodified datasets are available for download on the CEDEN website. Navigate to the <a href='https://ceden.waterboards.ca.gov/AdvancedQueryTool' target='_blank' rel='noreferrer noopener'>CEDEN Advanced Query Tool</a>, select a result category, and then select "Surface Water Ambient Monitoring Program" from the Programs select menu.</p>
            </div>
        )
    }

    const ApplicationContent = () => {
        return (
            <div>
                <h3>Source code</h3>
                <p>This application was developed by <a href='https://www.waterboards.ca.gov/water_issues/programs/swamp/' target='_blank' rel='noreferrer noopener'>SWAMP</a> staff at the <a href='https://www.waterboards.ca.gov/' target='_blank' rel='noreferrer noopener'>State Water Resources Control Board</a>. The source code for this application is available on GitHub. Open a <a href='https://github.com/mmtang/swamp-data-dashboard/issues' target='_blank' rel='noreferrer noopener'>new issue</a> to report a bug or request a new feature.</p>
                <a href='https://github.com/mmtang/swamp-data-dashboard/' target='_blank' rel='noreferrer noopener'>
                    <Button compact>
                        <Icon name='github' />
                        GitHub
                    </Button>
                </a>
                <h3>Feedback and questions</h3>
                <p>Please contact us at <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.</p>
            </div>
        )
    }

    return (
        <div>
            <Menu attached='top' tabular>
                <Menu.Item
                    name='welcome'
                    active={activeItem === 'welcome'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='data'
                    active={activeItem === 'data'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='application'
                    active={activeItem === 'application'}
                    onClick={handleItemClick}
                />
            </Menu>
            <Segment attached='bottom'>
                { activeItem === 'welcome' ? 
                    <WelcomeContent />
                : activeItem === 'data' ?
                    <DataContent />
                : activeItem === 'application' ?
                    <ApplicationContent />
                : <div></div>
                }
            </Segment>
        </div>
    )
}