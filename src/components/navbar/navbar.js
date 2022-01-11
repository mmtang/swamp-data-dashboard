import React from 'react';
import { Link } from 'gatsby';
import LinkDropdown from './link-dropdown';
import { navBar, navTitle, navMenu } from './navbar.module.css';

const Navbar = ({ active }) => {
    return (
        <div className={navBar}>
            {/* Wrap navbar header text in span */}
            <Link to="/"><span className={navTitle} tabIndex={0}>SWAMP Data Dashboard</span></Link>
            <div className={navMenu}>
                <ul>
                    <LinkDropdown path='/learn' active={active === 'learn' ? true : false}>Learn</LinkDropdown>
                    <LinkDropdown path='/data' active={active === 'data' ? true : false}>Data</LinkDropdown>
                </ul>
            </div>
        </div>
    )

}

export default Navbar;