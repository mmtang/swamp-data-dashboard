import React, { useState, useRef, useEffect } from 'react';
import LayoutMap from '../components/layout/layout-map';
import LoaderDashboard from '../components/common/loader-dashboard';
import Metadata from '../components/layout/metadata';
import PanelIndex from '../components/panels/panel-index';
import PanelMap from '../components/panels/panel-map';
import PanelStation from '../components/panels/panel-station';

import { capitalizeFirstLetter, formatDate, parseDate, regionDict } from '../utils/utils';

import { mapContainer } from './index.module.css';

export default function Index() {
  // Data for all stations
  const allStationRef = useRef();

  const [analyte, setAnalyte] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [station, setStation] = useState(null);
  const [stationData, setStationData] = useState(null);
  const [zoomToStation, setZoomToStation] = useState(false);

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
          records.forEach(d => {
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

  const getStations = (params) => {
    return new Promise((resolve, reject) => {
      const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
      console.log(url + new URLSearchParams(params));
      fetch(url + new URLSearchParams(params))
      .then((resp) => resp.json())
      .then((json) => json.result.records)
      .then((records) => {
        if (records) {
          records.forEach(d => {
            d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
            d.RegionName = regionDict[d.Region];
            d.TargetLatitude = +d.TargetLatitude;
            d.TargetLongitude = +d.TargetLongitude;
          });
          resolve(records);
        }
      });
    })
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

  // This function runs whenever any of the three states (program, region, analyte) change
  // It resets the station dataset OR re-queries the open data portal for new data and initiates changing the underlying data populating the map and table
  useEffect(() => {
    const isDuplicate = (row, arr) => {
      return arr.some(x => (row.StationCode === x.StationCode))
    };

    // If none of the filters are selected, change state to the full station dataset
    if (!program && !region && !analyte) {
      setStationData(allStationRef.current);
    }

    if (program) {
      const paramsChem = {
        sql: `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e" WHERE "${capitalizeFirstLetter(program)}" = 'True' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "StationCode", "SampleDate" DESC`
      }
      const paramsTox = {
        sql: `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "a6dafb52-3671-46fa-8d42-13ddfa36fd49" WHERE "${capitalizeFirstLetter(program)}" = 'True' ORDER BY "StationCode", "SampleDate" DESC`
      }
      Promise.all([
        // Chemistry dataset
        getStations(paramsChem),
        // Tox dataset
        getStations(paramsTox)
      ]).then((res) => {
        if (res.length > 0) {
          // Concatenate the records into one array
          let allData = res[0].concat(res[1]);
          // Sort desc by last sample date
          allData.sort((a, b) => new Date(b.LastSampleDate).getTime() - new Date(a.LastSampleDate).getTime());
          // Iterate and find unique stations
          // https://stackoverflow.com/questions/61183837/how-to-remove-duplicate-from-array-of-objects-with-multiple-properties-as-unique
          const uniqueStations = [];
          for (const row of allData) {
            if (!isDuplicate(row, uniqueStations)) { 
              uniqueStations.push(row);
            }
          }
          setStationData(uniqueStations);
        }
      })
    }
  }, [program])

  return (
    <LayoutMap> 
      <Metadata />
      <div className={mapContainer}>
        <PanelMap
          analyte={analyte}
          program={program}
          region={region}
          selectedSites={selectedSites}
          setMapLoaded={setMapLoaded}
          setSelectedSites={setSelectedSites}
          setStation={setStation}
          setStationData={setStationData}
          setZoomToStation={setZoomToStation}
          stationData={stationData}
          zoomToStation={zoomToStation}
        />
      </div>
      { !loaded ? <LoaderDashboard /> : null }
      {/* Render both panels at the same time but control visibility using styles around the parent divs in each component. Conditional rendering, which is what was in place before, causes the PanelIndex component and all select menus to re-render after closing out the station panel, which is not desirable. https://stackoverflow.com/questions/69009266/react-hiding-vs-removing-components */}
      <PanelIndex 
        analyte={analyte}
        program={program}
        region={region}
        setAnalyte={setAnalyte}
        setProgram={setProgram}
        setRegion={setRegion}
        station={station}
      />
      <PanelStation 
        station={station} 
        setStation={setStation} 
        analyte={analyte} 
        setZoomToStation={setZoomToStation}
      />
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
