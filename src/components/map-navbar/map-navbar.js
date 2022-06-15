import React from 'react';
import { container } from './map-navbar.module.css';

const MapNavbar = () => {
    return (
        <div className={container}>
            <div style={{ width: '100%' }}>
                <div id="searchContainer" style={{ border: '1px solid #fff' }} />
            </div>
        </div>
    )

}

export default MapNavbar;