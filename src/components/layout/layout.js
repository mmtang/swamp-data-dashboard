import React from 'react';
import Navbar from '../navbar/navbar.js';
import { appContainer } from './layout.module.css';


function Layout({ children }) {    
    return (
        <React.Fragment>
            <Navbar />
            <div className={appContainer}>
                {children}
            </div>
        </React.Fragment>
    )
}

export default Layout;