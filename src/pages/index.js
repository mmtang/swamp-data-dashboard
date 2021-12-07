import React, { useState, useRef, useEffect } from 'react';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import MapIndex from '../components/map/map-index';
import UpdateMessage from '../components/map-controls/update-message';
import AccordionMenu from '../components/map-controls/accordion-menu';
import ChartIndex from '../components/chart-index/chart-index';
import Table from '../components/table/table';
import FilterByExtent from '../components/map-controls/filter-by-extent';
import ZoomToSelected from '../components/map-controls/zoom-to-selected';
import { Divider, Modal, Header, Button } from 'semantic-ui-react';
import { mapContainer, mainContainer, infoContainer, swampIcon } from './index.module.css';

export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [analyte, setAnalyte] = useState(null);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  // const [site, setSite] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [tableData, setTableData] = useState();
  const [filteredByExtent, setFilteredByExtent] = useState(false);
  const [zoomedToSites, setZoomedToSites] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  const yearRef = useRef(new Date().getFullYear());

  useEffect(() => {
    if (mapLoaded) {
      setDisclaimerVisible(true);
      setLoaded(true);
    }
  }, [mapLoaded]);

  return (
    <LayoutMap>
      <div className={mapContainer}>
        <MapIndex 
          setMapLoaded={setMapLoaded}
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
          <p>The Surface Water Ambient Monitoring Program (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. To learn more about SWAMP and the work we do, check out our <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">website</a>.</p>
          <p>Use the search and filter controls below to explore SWAMP data for the time period of 2000-{yearRef.current}. Filters are automatically applied to the map and the table at the bottom of the page.</p>
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
      { disclaimerVisible ? 
          <Modal
              size='tiny'
              open={disclaimerVisible}
              onClose={() => setDisclaimerVisible(false)}
              closeOnDimmerClick={false}
          >
              <Header icon='exclamation circle' content='Disclaimer' />
              <Modal.Content>
                  {/*<img className={swampIcon} src={`/swamp_logo_black_small.png`} alt='SWAMP logo' />*/}
                  <p><strong>The SWAMP Data Dashboard is in early development.</strong> It may change at any time without prior notification. All data provided are provisional and should not be used for any particular purpose other than general reference.</p>
                  <p>
                    For feedback and general inquiries:<br />
                    <a href='mailto:swamp@waterboards.ca.gov'>swamp@waterboards.ca.gov</a>
                  </p>
              </Modal.Content>
              <Modal.Actions>
                <Button 
                  content='Close'
                  labelPosition='right'
                  onClick={() => setDisclaimerVisible(false)}
                  onKeyPress={() => setDisclaimerVisible(false)}
                />
              </Modal.Actions>
          </Modal> 
      : '' }
    </LayoutMap>
  )
}
