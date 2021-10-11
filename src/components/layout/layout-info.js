import React from 'react';
import Navbar from '../navbar/navbar.js';
import Footer from './footer.js';
import { mainContainer } from './layout-info.module.css';


function LayoutInfo({ title, children }) {    
    return (
        <React.Fragment>
            <Navbar title={title} />
            <div className={mainContainer}>
                {children}
            </div>
            <Footer />
        </React.Fragment>
    )
}

export default LayoutInfo;