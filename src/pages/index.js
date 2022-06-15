import React, { useState, useRef, useEffect } from 'react';
import AccordionMenu from '../components/map-controls/accordion-menu';
import DownloadData from '../components/common/download-data';
import ChartIndexWrapper from '../components/chart-index/chart-index-wrapper';
import FilterByExtent from '../components/map-controls/filter-by-extent';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import MenuIndex from '../components/map-controls/menu-index';
import MapIndex from '../components/map/map-index';
import Table from '../components/table/table';
import UpdateMessage from '../components/common/update-message';
import ZoomToSelected from '../components/map-controls/zoom-to-selected';
import { Divider, Modal, Icon } from 'semantic-ui-react';
import { mapContainer, mainContainer, mapHeader, mapMain, infoContainer, modalContent, swampIcon, modalButton } from './index.module.css';
import Metadata from '../components/layout/metadata';

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
      <Metadata />
      { !loaded ? <LoaderDashboard /> : null }
      <div className={mainContainer}>
        <div className={infoContainer}>
          <p>The <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">Surface Water Ambient Monitoring Program</a> (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. Explore SWAMP data for the time period of 2000-{yearRef.current}.</p>
          {/* Controls */}
          <section>
            <MenuIndex />
          </section>
          <section style={{ marginBottom: '40px' }}>
            
            {/*
            <AccordionMenu
              region={region}
              setRegion={setRegion}
              analyte={analyte}
              setAnalyte={setAnalyte}
              program={program}
              setProgram={setProgram}
            />
            */}
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
            <DownloadData data={tableData}>
              Download table data
            </DownloadData>
            <ChartIndexWrapper
              text={'Graph selected sites ' + (selectedSites.length > 0 ? `(${selectedSites.length})` : '(0)')}
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
        </div>
      </div>
      <div className={mapContainer}>
        <div className={mapMain}>
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
      </div>
      {/* Control for the disclaimer modal */}
      { disclaimerVisible ? 
          <Modal
              size='tiny'
              open={disclaimerVisible}
              onClose={() => setDisclaimerVisible(false)}
              closeOnDimmerClick={false}
          >
              <Modal.Content>
                  <div className={modalContent}>
                    <img className={swampIcon} src={`./swamp-logo-black-small.png`} alt='SWAMP logo' />
                    <p>Welcome to the <strong>SWAMP Data Dashboard</strong>, an interactive tool for exploring and downloading water quality data collected by the <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">Surface Water Ambient Monitoring Program</a> (SWAMP).</p>
                    <p><Icon name='exclamation triangle' />This dashboard is in <strong>public beta</strong> and may change at any time without prior notification. All data are provisional and should not be used for any particular purpose other than general reference. Feedback and general inquiries: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.</p>
                    <p>
                      <button className={modalButton} onClick={() => setDisclaimerVisible(false)} onKeyPress={() => setDisclaimerVisible(false)}>Go to the dashboard</button>
                    </p>
                    <UpdateMessage />
                  </div>
              </Modal.Content>
          </Modal> 
      : '' }
    </LayoutMap>
  )
}
