import React, { useState } from 'react';
import MapSpot from '../map/map-spot';
import PanelMapMenu from '../panel-menu/panel-map-menu';
import TableSpot from '../table/table-spot';

import { content } from './panel-map.module.css';

const tableContainerStyle = {
    height: '100%', // subtract height of main navbar and sub navbar
    overflowY: 'auto'
}

export default function PanelMap({ 
    analyte, 
    region, 
    setMapLoaded,
    setStation,
    setStationData,
    stationData
}) {   
    // State
    const [view, setView] = useState('map');

    return (
        <div className={content}>
            <PanelMapMenu 
                setView={setView}
                stationData={stationData} 
                view={view}
            />
            <div style={view !== 'map' ? { display: 'none' } : null }>
                <MapSpot
                    setMapLoaded={setMapLoaded}
                    analyte={analyte} 
                    region={region} 
                    stationData={stationData}
                    setStationData={setStationData}
                    setStation={setStation}
                />
            </div>
            <div style={view !== 'table' ? { display: 'none' } : tableContainerStyle }>
                <TableSpot stationData={stationData} />
            </div>  
        </div>
    )
}