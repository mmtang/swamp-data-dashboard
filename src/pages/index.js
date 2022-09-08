import React, { useState, useRef, useEffect } from 'react';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import MapIndex2 from '../components/map/map-index2';
import Metadata from '../components/layout/metadata';
import PanelIndex from '../components/panels/panel-index';

import { timeParse, timeFormat } from 'd3';

import { mapContainer, mainContainer, infoContainer, modalContent, swampIcon, modalButton } from './index.module.css';

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

  const [stationData, setStationData] = useState(null);

  const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
  const formatDate = timeFormat('%Y/%m/%d');

  useEffect(() => {
    if (mapLoaded) {
      setDisclaimerVisible(true);
      setLoaded(true);
    }
  }, [mapLoaded]);

  // Get full station dataset - data for use in map and table
  useEffect(() => {
    const allStationsUrl = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=_id,StationName,StationCode,TargetLatitude,TargetLongitude,Region,LastSampleDate,Bioassessment,Spot,Fhab,Bioaccumulation&limit=5000';
    fetch(allStationsUrl)
      .then((resp) => resp.json())
      .then((json) => json.result.records)
      .then((records) => {
        if (records) {
          records.map(d => {
            d.Region = d.Region.toString();
            d.LastSampleDate = formatDate(parseDate(d.LastSampleDate));
            d.TargetLatitude = +d.TargetLatitude;
            d.TargetLongitude = +d.TargetLongitude;
          });
          setStationData(records);
        }
      });
  }, []);

  return (
    <LayoutMap>
      <Metadata />
      <div className={mapContainer}>
        <MapIndex2 
          setMapLoaded={setMapLoaded}
          analyte={analyte} 
          region={region} 
          program={program}
          selectedSites={selectedSites}
          stationData={stationData}
        />
      </div>
      { !loaded ? <LoaderDashboard /> : null }
      <div>
          <PanelIndex 
            region={region}
            setRegion={setRegion}
            analyte={analyte}
            setAnalyte={setAnalyte}
            program={program}
            setProgram={setProgram}
            stationData={stationData}
          />
      </div>
      {/*
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
      */}
    </LayoutMap>
  )
}
