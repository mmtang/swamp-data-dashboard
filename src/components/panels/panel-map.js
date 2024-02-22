import React from 'react';
import LoaderPanel from '../loaders/loader-panel';
import MapIndex2 from '../map/map-index2';
import PanelMapMenu from '../panel-menu/panel-map-menu';
import Table2 from '../table/table2';
import SummaryContainer from '../table/summary-container';

import { content, tableContainer } from './panel-map.module.css';

export default function PanelMap({ 
    analyte,
    comparisonSites,
    cursor,
    disableReferenceSites,
    filterByMapExtent,
    highlightReferenceSites,
    mapLoaded,
    region, 
    program,
    selecting,
    setComparisonSites,
    setFilterByMapExtent,
    setHighlightReferenceSites,
    setMapLoaded,
    setMessageModal,
    setMessageModalVisible,
    setSelecting,
    setStation,
    setStationLoading,
    setStationData,
    setTableData,
    setView,
    setZoomToStation,
    species,
    station,
    stationData,
    tableData,
    view,
    zoomToStation
}) {   
    const containerStyle = {
        display: 'block',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        position: 'relative',
        width: '100%'
    }

    return (
        <div className={content} style={{ cursor: cursor }}>
            <PanelMapMenu 
                analyte={analyte}
                filterByMapExtent={filterByMapExtent}
                program={program}
                region={region}
                setFilterByMapExtent={setFilterByMapExtent}
                setView={setView}
                species={species}
                stationData={stationData}
                tableData={tableData} 
                view={view}
            />
            {/* Load the map and table components at the same time and control visibility through styles + state. Do not do conditional loading (loading one at a time) because it will force the component to reload every time a new selection is clicked */}
            <div style={view !== 'map' ? { display: 'none' } : containerStyle }>
                { !mapLoaded ? <LoaderPanel /> : null }
                <MapIndex2 
                    analyte={analyte} 
                    comparisonSites={comparisonSites}
                    disableReferenceSites={disableReferenceSites}
                    filterByMapExtent={filterByMapExtent}
                    highlightReferenceSites={highlightReferenceSites}
                    mapLoaded={mapLoaded}
                    program={program}
                    region={region} 
                    selecting={selecting}
                    setMapLoaded={setMapLoaded}
                    setComparisonSites={setComparisonSites}
                    setHighlightReferenceSites={setHighlightReferenceSites}
                    setMessageModal={setMessageModal}
                    setMessageModalVisible={setMessageModalVisible}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationLoading={setStationLoading}
                    setStationData={setStationData}
                    setTableData={setTableData}
                    setZoomToStation={setZoomToStation}
                    station={station}
                    stationData={stationData}
                    zoomToStation={zoomToStation}
                />
            </div>
            {/* Safari requires the use of the 'key' parameter in the divs containing the tables or else the tables will not redraw as the user switches back and forth between the map and table. Using a value tied to the relevant state will ensure that the component is redrawn in Safari. */}
            <div className={tableContainer} style={view !== 'table' ? { display: 'none' } : null }>
                <Table2
                    analyte={analyte}
                    comparisonSites={comparisonSites}
                    program={program}
                    region={region}
                    selecting={selecting}
                    setComparisonSites={setComparisonSites}
                    setMessageModal={setMessageModal}
                    setMessageModalVisible={setMessageModalVisible}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationLoading={setStationLoading}
                    species={species}
                    station={station}
                    tableData={tableData}
                />
            </div>  
            <div className={tableContainer} style={view !== 'summary' ? { display: 'none' } : null }>
                <SummaryContainer
                    analyte={analyte}
                    comparisonSites={comparisonSites}
                    program={program}
                    region={region}
                    selecting={selecting}
                    setComparisonSites={setComparisonSites}
                    setMessageModal={setMessageModal}
                    setMessageModalVisible={setMessageModalVisible}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationLoading={setStationLoading}
                    species={species}
                    station={station}
                    tableData={tableData}
                    view={view}
                />
            </div>  
        </div>
    )
}