import React from 'react';
import { Link } from 'gatsby';
import LinkDropdown from './link-dropdown';
import { navBar, navTitle, navMenu } from './navbar.module.css';

const Navbar = () => {

    return (
        <div className={navBar}>
            {/* Wrap navbar header text in span */}
            <Link to="/"><span className={navTitle}>SWAMP Data Dashboard</span></Link>
            <div className={navMenu}>
                <ul>
                    <LinkDropdown path='/learn'>Learn</LinkDropdown>
                    <LinkDropdown path='/learn'>Data</LinkDropdown>
                </ul>
            </div>
        </div>
    )

}

export default Navbar;