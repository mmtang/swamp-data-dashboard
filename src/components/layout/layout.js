import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout.module.css';


function Layout({ header, children }) {    
    return (
        <React.Fragment>
            <Navbar header={header} />
            <div className={appContainer}>
                {children}
            </div>
        </React.Fragment>
    )
}

export default Layout;