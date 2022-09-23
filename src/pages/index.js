import React, { useState, useRef, useEffect } from 'react';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import Metadata from '../components/layout/metadata';
import PanelIndex from '../components/panels/panel-index';
import PanelMap from '../components/panels/panel-map';
import PanelStation from '../components/panels/panel-station';

import { formatDate, parseDate, regionDict } from '../utils/utils';

import { mapContainer, mainContainer, infoContainer, modalContent, swampIcon, modalButton } from './index.module.css';

export default function Index() {
  // Data for all stations
  const allStationRef = useRef();

  const [analyte, setAnalyte] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  const [station, setStation] = useState(null);
  const [stationData, setStationData] = useState(null);

  const getAllStations = () => {
    return new Promise((resolve, reject) => {
      const params = {
        // SWAMP Stations: https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/df69fdd7-1475-4e57-9385-bb1514f0291e
        resource_id: 'df69fdd7-1475-4e57-9385-bb1514f0291e',
        limit: 6000
      };
      const url = 'https://data.ca.gov/api/3/action/datastore_search?';
      console.log(url + new URLSearchParams(params));
      fetch(url + new URLSearchParams(params))
      .then((resp) => resp.json())
      .then((json) => json.result.records)
      .then((records) => {
        if (records) {
          records.map(d => {
            d.LastSampleDate = formatDate(parseDate(d.LastSampleDate));
            d.RegionName = regionDict[d.Region];
            d.TargetLatitude = +d.TargetLatitude;
            d.TargetLongitude = +d.TargetLongitude;
          });
          resolve(records);
        }
      })
    });
  }

  // This function runs upon initial load
  // Get full station dataset - data for use in map and table
  useEffect(() => {
    getAllStations()
    .then((data) => {
      allStationRef.current = data;
      setStationData(data);
    });
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      //setDisclaimerVisible(true);
      setLoaded(true);
    }
  }, [mapLoaded]);

  return (
    <LayoutMap> 
      <Metadata />
      <div className={mapContainer}>
        <PanelMap
          analyte={analyte}
          program={program}
          region={region}
          setMapLoaded={setMapLoaded}
          setStation={setStation}
          setStationData={setStationData}
          stationData={stationData}
        />
      </div>
      { !loaded ? <LoaderDashboard /> : null }
      { station ? <PanelStation station={station} setStation={setStation} analyte={analyte} /> : 
          <PanelIndex 
              analyte={analyte}
              program={program}
              region={region}
              setAnalyte={setAnalyte}
              setProgram={setProgram}
              setRegion={setRegion}
          />
      }
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
