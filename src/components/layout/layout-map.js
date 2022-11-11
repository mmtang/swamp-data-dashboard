import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout-map.module.css';


function LayoutMap({ children, search = true }) { 
    return (
        <div>
            <Navbar search={search} />
            <div className={appContainer}>
                {children}
            </div>
        </div>
    )
}

export default LayoutMap;