import React, { memo, useState } from 'react';
import { withPrefix } from 'gatsby';
import ModalContent from '../common/modal-content';
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

    return (
        <div className={navBar}>
            {/* Wrap navbar header text in span */}
            <div className={titleContainer}>
                <a href='https://www.waterboards.ca.gov/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/wb-logo-white.png')} /></a>
                <a href='https://www.waterboards.ca.gov/water_issues/programs/swamp/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/swamp-logo-white.png')} /></a>
                <a href={withPrefix('/')}><span className={navTitle}>SWAMP Data Dashboard</span></a>
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
            { disclaimerVisible ? 
                <Modal
                    closeIcon
                    closeOnDimmerClick={true}
                    open={disclaimerVisible}
                    onClose={() => setDisclaimerVisible(false)}
                    size='small'
                >
                    <Modal.Content scrolling>
                        <ModalContent setDisclaimerVisible={setDisclaimerVisible} />
                    </Modal.Content>
                </Modal> 
            : '' }
        </div>
    )

}

export default memo(Navbar);