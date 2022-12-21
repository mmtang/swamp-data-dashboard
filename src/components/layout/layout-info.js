import React from 'react';
import Footer from './footer.js';
import Navbar from '../navbar/navbar.js';
import { appContainer, footer, header, lineAccent, mainContainer } from './layout-info.module.css';

// No longer in use 0.2.0; kept here for reference, may be used in the future
function LayoutInfo({ active, children }) {    
    return (
        <div className={appContainer}>
            <div className={header}>
                <Navbar active={active} />
            </div>
            <div className={mainContainer}>
                <div className={lineAccent}></div>
                {children}
            </div>
            <div className={footer}>
                <Footer />
            </div>
        </div>
    )
}

export default LayoutInfo;