import React from 'react';
import { navItem, navText } from './dropdown.module.css';


const LinkDropdown = ({ children }) => {
    return (
        <li className={navItem}>
            {/* apply the padding to navText so that the dropdown aligns with the li element */}
            <div className={navText}>
                {children}
            </div>
        </li>
    )
}

export default LinkDropdown;