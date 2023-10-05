import React from 'react';
import LoaderPanel from '../loaders/loader-panel';
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
    cursor,
    highlightReferenceSites,
    mapLoaded,
    region, 
    program,
    selecting,
    setComparisonSites,
    setMapLoaded,
    setSelecting,
    setStation,
    setStationData,
    setTableData,
    setView,
    setZoomToStation,
    station,
    stationData,
    tableData,
    view,
    zoomToStation
}) {   
    return (
        <div className={content} style={{ cursor: cursor }}>
            <PanelMapMenu 
                setView={setView}
                tableData={tableData} 
                view={view}
            />
            {/* Load the map and table components at the same time and control visibility through styles + state. Do not do conditional loading (loading one at a time) because it will force the component to reload every time a new selection is clicked */}
            <div style={view !== 'map' ? { display: 'none' } : null }>
                { !mapLoaded ? <LoaderPanel /> : null }
                <MapIndex2 
                    analyte={analyte} 
                    comparisonSites={comparisonSites}
                    highlightReferenceSites={highlightReferenceSites}
                    program={program}
                    region={region} 
                    selecting={selecting}
                    setMapLoaded={setMapLoaded}
                    setComparisonSites={setComparisonSites}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationData={setStationData}
                    setTableData={setTableData}
                    setZoomToStation={setZoomToStation}
                    station={station}
                    stationData={stationData}
                    zoomToStation={zoomToStation}
                />
            </div>
            <div style={view !== 'table' ? { display: 'none' } : tableContainerStyle }>
                <Table2
                    analyte={analyte}
                    comparisonSites={comparisonSites}
                    program={program}
                    region={region}
                    selecting={selecting}
                    setComparisonSites={setComparisonSites}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    station={station}
                    tableData={tableData} 
                />
            </div>  
        </div>
    )
}