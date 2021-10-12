import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout-map.module.css';


function LayoutMap({ title, children }) { 
    return (
        <div>
            <Navbar title={title} />
            <div className={appContainer}>
                {children}
            </div>
        </div>
    )
}

export default LayoutMap;