import React, { useState } from 'react';
import LoaderPanel from '../common/loader-panel';
import MapIndex2 from '../map/map-index2';
import PanelMapMenu from '../panel-menu/panel-map-menu';
import Table2 from '../table/table2';

import { content } from './panel-map.module.css';

const tableContainerStyle = {
    height: '100%', // subtract height of main navbar and sub navbar
    overflowX: 'auto',
    overflowY: 'auto',
    width: '100%'
}

export default function PanelMap({ 
    analyte,
    comparisonSites,
    mapLoaded,
    region, 
    program,
    selecting,
    setComparisonSites,
    setMapLoaded,
    setSelecting,
    setStation,
    setStationData,
    setZoomToStation,
    station,
    stationData,
    zoomToStation
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
                { !mapLoaded ? <LoaderPanel /> : null }
                <MapIndex2 
                    analyte={analyte} 
                    program={program}
                    region={region} 
                    comparisonSites={comparisonSites}
                    selecting={selecting}
                    setMapLoaded={setMapLoaded}
                    setComparisonSites={setComparisonSites}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationData={setStationData}
                    setZoomToStation={setZoomToStation}
                    station={station}
                    stationData={stationData}
                    zoomToStation={zoomToStation}
                />
            </div>
            <div style={view !== 'table' ? { display: 'none' } : tableContainerStyle }>
                <Table2
                    comparisonSites={comparisonSites}
                    selecting={selecting}
                    setComparisonSites={setComparisonSites}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    station={station}
                    stationData={stationData} 
                />
            </div>  
        </div>
    )
}