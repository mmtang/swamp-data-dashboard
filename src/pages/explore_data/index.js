import React, { useState } from 'react';
import LayoutMap from '../../components/layout/layout-map';
import MapIndex from '../../components/map/map-index';
import ControlsContainer from '../../components/map-controls/controls-container';
import ChartIndex from '../../components/chart-index/chart-index';
import TableIndex2 from '../../components/table-index/table-index2';
import FilterByExtent from '../../components/map-controls/filter-by-extent';
import { mapContainer, mainContainer, infoContainer } from './index.module.css';

export default function Index() {
  const [analyte, setAnalyte] = useState(null);
  const [region, setRegion] = useState(null);
  const [site, setSite] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [tableData, setTableData] = useState();
  const [filterExtentToggle, setFilterExtentToggle] = useState(false);


  return (
    <LayoutMap title='SWAMP Data Dashboard'>
      <div className={mapContainer}>
        <MapIndex 
          selectedAnalyte={analyte} 
          selectedRegion={region} 
          setSelectedSites={setSelectedSites}
          clickedSite={site} 
          setTableData={setTableData}
          filterExtentToggle={filterExtentToggle}
          setFilterExtentToggle={setFilterExtentToggle}
        />
      </div>
      <div className={mainContainer}>
        <div className={infoContainer}>
          <p>Use the controls below to change the map settings.</p>
          {/* Controls */}
          <div>
            <div id="searchContainer" style={{ border: '1px solid #6e6e6e', marginBottom: '1em' }} />
            <ControlsContainer 
              selectedRegion={region}
              setRegion={setRegion}
              selectedAnalyte={analyte}
              setAnalyte={setAnalyte}
              setFilterExtentToggle={setFilterExtentToggle}
            />
            <FilterByExtent setFilterExtentToggle={setFilterExtentToggle} />&nbsp;
            <ChartIndex 
              selectedSites={selectedSites}
              analyte={analyte}
            />
            <TableIndex2 
              selectedAnalyte={analyte}
              data={tableData}
              setSelectedSites={setSelectedSites}
            />
          </div>
        </div>
        {/*<div id="indexTableContainer" style={{ padding: '0 20px', marginBottom: '100px' }}></div>*/}
      </div>
    </LayoutMap>
  )
}
