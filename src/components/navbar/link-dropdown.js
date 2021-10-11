import React from 'react';
import { Link } from 'gatsby';
import { navItem, navText } from './dropdown.module.css';


const LinkDropdown = ({ path, children }) => {
    return (
        <li className={navItem}>
            {/* apply the padding to navText so that the dropdown aligns with the li element */}
            <Link to={path}>
                <div className={navText}>
                    {children}
                </div>
            </Link>
        </li>
    )
}

export default LinkDropdown;