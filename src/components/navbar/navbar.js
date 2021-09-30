import React from 'react';
import { Link } from 'gatsby';
import LinkDropdown from './link-dropdown';
import { navBar, logoWrapper, logo, navTitle, navMenu } from './navbar.module.css';

const Navbar = () => {

    return (
        <div className={navBar}>
            <a href="/"><span className={navTitle}>Surface Water Ambient Monitoring Program</span></a>
            {/*
            <div className={logoWrapper}>
                <a href="/"><span className={navTitle}>Surface Water Ambient Monitoring Program</span><img className={logo} src={`SWAMP_logo_white_small.png`} alt="SWAMP Logo" /></a>
            </div>
            */}
            <div className={navMenu}>
                <ul>
                    <LinkDropdown>Dashboard</LinkDropdown>
                    <LinkDropdown>Learn</LinkDropdown>
                    <LinkDropdown>Data</LinkDropdown>
                </ul>
            </div>
        </div>
    )

}

export default Navbar;