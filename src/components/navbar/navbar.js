import React from 'react';
import { Link } from 'gatsby';
import { withPrefix } from 'gatsby';
// import LinkDropdown from './link-dropdown';
import { navBar, navTitle, navMenu, titleContainer, logo } from './navbar.module.css';

const Navbar = ({ active }) => {
    return (
        <div className={navBar}>
            {/* Wrap navbar header text in span */}
            <div className={titleContainer}>
                <a href='https://www.waterboards.ca.gov/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/wb-logo-white-small.png')} /></a>
                <a href='https://www.waterboards.ca.gov/water_issues/programs/swamp/' target='_blank' rel='noreferrer noopener'><img className={logo} src={withPrefix('/swamp-logo-white-small.png')} /></a>
                <Link to="/"><span className={navTitle}>SWAMP Data Dashboard</span></Link>
            </div>
            <div id="searchContainer" style={{ border: '1px solid #2e4558', marginRight: '26px', width: '250px' }} />
            {/*
            <div className={navMenu}>
                <ul>
                    <LinkDropdown path='/learn' active={active === 'learn' ? true : false}>Learn</LinkDropdown>
                    <LinkDropdown path='/data' active={active === 'data' ? true : false}>Data</LinkDropdown>
                </ul>
            </div>
            */}
        </div>
    )

}

export default Navbar;