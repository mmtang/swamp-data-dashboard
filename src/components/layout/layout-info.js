import React from 'react';
import Navbar from '../navbar/navbar.js';
import Footer from './footer.js';
import { appContainer, header, mainContainer, footer, lineAccent } from './layout-info.module.css';


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