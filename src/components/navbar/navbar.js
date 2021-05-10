import React from 'react';
import { Link } from 'gatsby';
import LinkDropdown from './link-dropdown';
import { navBar, navTitle, navMenu } from './navbar.module.css';

const Navbar = () => {

    return (
        <div className={navBar}>
            <Link to="/"><span className={navTitle}>SWAMP Data Dashboard</span></Link>
            <div className={navMenu}>
                <ul>
                    <LinkDropdown>About</LinkDropdown>
                </ul>
            </div>
        </div>
    )

}

export default Navbar;