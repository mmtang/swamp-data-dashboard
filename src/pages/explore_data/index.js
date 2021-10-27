import React, { useState, useRef } from 'react';
import LayoutMap from '../../components/layout/layout-map';
import MapIndex from '../../components/map/map-index';
import UpdateMessage from '../../components/map-controls/update-message';
import AccordionMenu from '../../components/map-controls/accordion-menu';
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
  const yearRef = useRef(new Date().getFullYear());


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
          <p>Use the controls below to explore SWAMP water quality data for the time period of 2000-{yearRef.current}. Changes are automatically reflected in the map and in the table at the bottom of this page.</p>
          <UpdateMessage />
          {/* Controls */}
          <div>
            <AccordionMenu
              selectedRegion={region}
              setRegion={setRegion}
              selectedAnalyte={analyte}
              setAnalyte={setAnalyte}
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
