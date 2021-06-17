import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer, mainFlex } from './layout-station.module.css';


function LayoutStation({ children }) {    
    return (
        <React.Fragment>
            <Navbar />
            <div className={appContainer}>
                <div className={mainFlex}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    )
}

export default LayoutStation;