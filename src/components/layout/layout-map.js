import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout-map.module.css';


function LayoutMap({children }) { 
    return (
        <div>
            <Navbar />
            <div className={appContainer}>
                {children}
            </div>
        </div>
    )
}

export default LayoutMap;