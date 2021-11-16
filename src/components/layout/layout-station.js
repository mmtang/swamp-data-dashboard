import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer, mainFlex } from './layout-station.module.css';


function LayoutStation({ title, children }) {    
    return (
        <React.Fragment>
            <Navbar title={title} />
            <div className={appContainer}>
                <div className={mainFlex}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    )
}

export default LayoutStation;