import React, { useRef } from 'react';
import { container, contactContainer, logoContainer, logo, copyright } from './footer.module.css';

function Footer() {
    const yearRef = useRef(new Date().getFullYear());

    return (
        <div className={container}>
            <div className={contactContainer}>
                <div className={logoContainer}>
                    <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" rel="noopener noreferrer" target="_blank"><img className={logo} src={`swamp_logo_black_small.png`} alt='SWAMP logo' /></a>
                </div>
                <div>
                    <h4>Contact</h4>
                    <span>Website and general inquiries:<br />
                    <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a></span>
                </div>
            </div>
            <div className={copyright}>
                <div>
                    <span>Copyright © {yearRef.current} State of California<br/></span>
                    <span><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" rel="noopener noreferrer" target="_blank">Surface Water Ambient Monitoring Program</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://www.waterboards.ca.gov/" rel="noopener noreferrer" target="_blank">California Water Boards</a></span>
                </div>
            </div>
        </div>
    )
}

export default Footer;