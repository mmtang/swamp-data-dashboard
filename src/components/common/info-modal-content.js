import React from 'react';
import UpdateMessage from './update-message';

import swampLogo from '../../../static/swamp-logo-black-small.png';
import { Icon } from 'semantic-ui-react';

import { modalButton, modalContent, swampIcon } from './info-modal-content.module.css';

export default function InfoModalContent({ setDisclaimerVisible }) {   
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