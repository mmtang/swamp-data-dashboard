import React from 'react';
import { Link } from 'gatsby';
import { navItem, navItemActive, navText } from './dropdown.module.css';


const LinkDropdown = ({ path, active, children }) => {
    return (
        <li className={active ? navItemActive : navItem}>
            {/* apply the padding to navText so that the dropdown aligns with the li element */}
            <Link to={path}>
                <div className={navText} tabIndex={0} role='link'>
                    {children}
                </div>
            </Link>
        </li>
    )
}

export default LinkDropdown;