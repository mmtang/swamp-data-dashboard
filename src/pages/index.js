import React, { useState, useRef } from 'react';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import MapIndex from '../components/map/map-index';
import UpdateMessage from '../components/map-controls/update-message';
import AccordionMenu from '../components/map-controls/accordion-menu';
import ChartIndex from '../components/chart-index/chart-index';
import Table from '../components/table/table';
import FilterByExtent from '../components/map-controls/filter-by-extent';
import ZoomToSelected from '../components/map-controls/zoom-to-selected';
import { Divider } from 'semantic-ui-react';
import { mapContainer, mainContainer, infoContainer } from './index.module.css';

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [analyte, setAnalyte] = useState(null);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  // const [site, setSite] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [tableData, setTableData] = useState();
  const [filteredByExtent, setFilteredByExtent] = useState(false);
  const [zoomedToSites, setZoomedToSites] = useState(false);

  const yearRef = useRef(new Date().getFullYear());

  return (
    <LayoutMap>
      <div className={mapContainer}>
        <MapIndex 
          setLoaded={setLoaded}
          selectedAnalyte={analyte} 
          selectedRegion={region} 
          selectedProgram={program}
          selectedSites={selectedSites}
          setSelectedSites={setSelectedSites}
          setTableData={setTableData}
          filteredByExtent={filteredByExtent}
          setFilteredByExtent={setFilteredByExtent}
          zoomedToSites={zoomedToSites}
          setZoomedToSites={setZoomedToSites}
        />
      </div>
      { !loaded ? <LoaderDashboard /> : null }
      <div className={mainContainer}>
        <div className={infoContainer}>
          <p>Use the search and filter controls below to explore SWAMP water quality data for the time period of 2000-{yearRef.current}. Filters are automatically applied to the map and the table at the bottom of the page.</p>
          {/* Controls */}
          <section style={{ marginBottom: '40px' }}>
            <AccordionMenu
              region={region}
              setRegion={setRegion}
              analyte={analyte}
              setAnalyte={setAnalyte}
              program={program}
              setProgram={setProgram}
            />
          </section>
          <Divider horizontal section>
            Data Table
          </Divider>
          <section>
            <p>The table below displays the map data in a tabular format. Any filters applied to the map are also applied to the table. Use the column headers to sort the records. Select a site (or multiple sites) to graph data for the selected indicator.</p>
            <FilterByExtent 
              filteredByExtent={filteredByExtent}
              setFilteredByExtent={setFilteredByExtent} 
            />
            <ZoomToSelected
              setZoomedToSites={setZoomedToSites}
            />
            <ChartIndex 
              selectedSites={selectedSites}
              analyte={analyte}
            />
            <Table 
              selectedAnalyte={analyte}
              data={tableData}
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
            />
          </section>
          <UpdateMessage />
        </div>
      </div>
    </LayoutMap>
  )
}
