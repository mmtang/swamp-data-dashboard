import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import { withPrefix } from 'gatsby';
import InfoModalContent from '../common/info-modal-content';
// import LinkDropdown from './link-dropdown';

import { Icon, Modal } from 'semantic-ui-react';
import { 
    iconWrapper, 
    logo, 
    navBar, 
    navTitle, 
    rightContainer, 
    searchContainer,
    titleContainer,  
} from './navbar.module.css';

const Navbar = ({ search }) => {
    const [disclaimerVisible, setDisclaimerVisible] = useState(false);

    const infoIconStyle = {
        height: '34px',
        margin: '0'
    }

    const handleInfoClick = () => {
        setDisclaimerVisible(true);
    }

    const handleMenuClick = () => {
        alert('clicked');
    }

    return (
        <div className={navBar}>
            {/* Wrap navbar header text in span */}
            <div className={titleContainer}>
                <a href='https://www.waterboards.ca.gov/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/wb-logo-white-small.png')} /></a>
                <a href='https://www.waterboards.ca.gov/water_issues/programs/swamp/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/swamp-logo-white-small.png')} /></a>
                <Link to="/"><span className={navTitle}>SWAMP Data Dashboard</span></Link>
            </div>
            <div className={rightContainer}>
                { search ? 
                    <div id="searchContainer" className={searchContainer} />
                    : null
                }
                <div className={iconWrapper}>
                    <Icon 
                        bordered
                        color='black'
                        inverted
                        link
                        name='info' 
                        onClick={handleInfoClick}
                        style={infoIconStyle}
                    />
                </div>
            </div>
            {/* Commented out this, no longer using but keeping for reference
            <div className={navMenu}>
                <ul>
                    <LinkDropdown path='/learn' active={active === 'learn' ? true : false}>Learn</LinkDropdown>
                    <LinkDropdown path='/data' active={active === 'data' ? true : false}>Data</LinkDropdown>
                </ul>
            </div>
            */}
            {/* Same modal as on index.html */}
            { disclaimerVisible ? 
                <Modal
                    closeIcon
                    closeOnDimmerClick={true}
                    open={disclaimerVisible}
                    onClose={() => setDisclaimerVisible(false)}
                    size='small'
                >
                    <Modal.Content scrolling>
                        <InfoModalContent setDisclaimerVisible={setDisclaimerVisible} />
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )

}

export default memo(Navbar);