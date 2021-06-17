import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout.module.css';


function LayoutStation({ children }) {    
    return (
        <React.Fragment>
            <Navbar />
            <div className={appContainer} style={{ alignItems: 'flex-start', overflowY: 'auto', backgroundColor: '#f4f2f2' }}>
                {children}
            </div>
        </React.Fragment>
    )
}

export default LayoutStation;