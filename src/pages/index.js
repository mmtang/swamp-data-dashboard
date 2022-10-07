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

  const chemistryResourceId = '2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e';
  const habitatResourceId = '6d9a828a-d539-457e-922c-3cb54a6d4f9b';
  const toxicityResourceId = 'a6dafb52-3671-46fa-8d42-13ddfa36fd49';
  

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

  const createParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "${ resource === toxicityResourceId ? 'MeanDisplay' : 'ResultDisplay' }", "Unit" FROM "${resource}"`;
    };
    if (analyte || program || region) {
        // This block constucts the "WHERE" part of the select query
        // There can be one or more filters
        const whereStatements = [];
        if (analyte) {
          whereStatements.push(`"Analyte" = '${analyte.label}'`);
          whereStatements.push(`"MatrixName" = '${analyte.matrix}'`);
        }
        if (program) {
          whereStatements.push(`"${capitalizeFirstLetter(program)}" = 'True'`);
        }
        if (region) {
          // Region value on open data portal is string; convert value before appending to query string
          let regionVal = region;
          if (typeof regionVal === 'number') {
            regionVal = region.toString();
          }
          whereStatements.push(`"Region" = '${regionVal}'`);
        }
        // Data quality
        whereStatements.push(`"DataQuality" NOT IN ('MetaData', 'Reject record')`);
        const concat = whereStatements.join(' AND ');
        querySql += ' WHERE ';
        querySql += concat;
        querySql += ` ORDER BY "StationCode", "SampleDate" DESC`
    }
    console.log(querySql);
    return { resource_id: resource, sql: querySql };
  }

  // This function runs whenever any of the three states (program, region, analyte) change
  // It resets the station dataset OR re-queries the open data portal for new data and initiates changing the underlying data populating the map and table
  useEffect(() => {
    const isDuplicate = (row, arr) => {
      return arr.some(x => (row.StationCode === x.StationCode))
    };

    setMapLoaded(false);
    // If none of the filters are selected, change state to the full station dataset
    if (!program && !region && !analyte) {
      setStationData(allStationRef.current);
    } else {
      const paramsChem = createParams(chemistryResourceId);
      const paramsHabitat = createParams(habitatResourceId);
      const paramsTox = createParams(toxicityResourceId);
      Promise.all([
        // Chemistry dataset
        getStations(paramsChem),
        // Habitat dataset
        getStations(paramsHabitat),
        // Tox dataset
        getStations(paramsTox)
      ]).then((res) => {
        if (res.length > 0) {
          // Concatenate the records into one array
          let allData = res[0].concat(res[1], res[2]);
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
          if (uniqueStations[0].ResultDisplay) {
            uniqueStations.forEach(d => {
              d.LastResult = +d.ResultDisplay
            });
          };
          setStationData(uniqueStations);
        }
      })
    }
  }, [analyte, program, region])

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
          mapLoaded={mapLoaded}
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
      {/*
      { !loaded ? <LoaderDashboard /> : null }
      */}
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
        setSelectedSites={setSelectedSites}
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
