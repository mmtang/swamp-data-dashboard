import React, { useState, useRef } from 'react';
import LayoutMap from '../../components/layout/layout-map';
import MapIndex from '../../components/map/map-index';
import UpdateMessage from '../../components/map-controls/update-message';
import AccordionMenu from '../../components/map-controls/accordion-menu';
import ChartIndex from '../../components/chart-index/chart-index';
import Table from '../../components/table/table';
import FilterByExtent from '../../components/map-controls/filter-by-extent';
import { Divider } from 'semantic-ui-react';
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
          <p>Use the filters and controls below to explore SWAMP water quality data for the time period of 2000-{yearRef.current}. Filters are automatically applied to the map and the table at the bottom of the page.</p>
          {/* Controls */}
          <section style={{ marginBottom: '40px' }}>
            <AccordionMenu
              selectedRegion={region}
              setRegion={setRegion}
              selectedAnalyte={analyte}
              setAnalyte={setAnalyte}
            />
          </section>
          <Divider horizontal section>
            Data Table
          </Divider>
          <section>
            <FilterByExtent setFilterExtentToggle={setFilterExtentToggle} />
              <ChartIndex 
                selectedSites={selectedSites}
                analyte={analyte}
              />
              <Table 
                selectedAnalyte={analyte}
                data={tableData}
                setSelectedSites={setSelectedSites}
              />
          </section>
          <UpdateMessage />
        </div>
      </div>
    </LayoutMap>
  )
}
