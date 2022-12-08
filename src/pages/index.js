import React, { useState, useRef, useEffect } from 'react';
import InfoModalContent from '../components/common/info-modal-content';
import LayoutMap from '../components/layout/layout-map';
import Metadata from '../components/layout/metadata';
import PanelIndex from '../components/panels/panel-index';
import PanelMap from '../components/panels/panel-map';
import PanelStation from '../components/panels/panel-station';

import { Modal } from 'semantic-ui-react';

import { 
  capitalizeFirstLetter, 
  chemistryResourceId,
  formatDate, 
  habitatResourceId,
  parseDate, 
  regionDict,
  toxicityResourceId
} from '../utils/utils';

import { mapContainer } from './index.module.css';

export default function Index() {
  // Data for all stations
  const allStationRef = useRef();

  const [analyte, setAnalyte] = useState(null);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  const [comparisonSites, setComparisonSites] = useState([]);
  const [selecting, setSelecting] = useState(false);
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
            d.Analyte = d.AnalyteDisplay;
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
          whereStatements.push(`"AnalyteDisplay" = '${analyte.label}'`);
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
              d.LastResult = parseFloat((+d.ResultDisplay).toFixed(3));
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
      setDisclaimerVisible(true); // Show welcome modal
    });
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      setLoaded(true);
    }
  }, [mapLoaded]);

  useEffect(() => {
    setComparisonSites([]);
  }, [station]);

  return (
    <LayoutMap> 
      <div className={mapContainer}>
        <Metadata />
        <PanelMap
          analyte={analyte}
          mapLoaded={mapLoaded}
          program={program}
          region={region}
          comparisonSites={comparisonSites}
          selecting={selecting}
          setMapLoaded={setMapLoaded}
          setComparisonSites={setComparisonSites}
          setSelecting={setSelecting}
          setStation={setStation}
          setStationData={setStationData}
          setZoomToStation={setZoomToStation}
          station={station}
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
        analyte={analyte} 
        comparisonSites={comparisonSites}
        program={program}
        selecting={selecting}
        setComparisonSites={setComparisonSites}
        setSelecting={setSelecting}
        setStation={setStation} 
        setZoomToStation={setZoomToStation}
        station={station} 
      />
      { disclaimerVisible ? 
          <Modal
              closeIcon
              closeOnDimmerClick={true}
              open={disclaimerVisible}
              onClose={() => setDisclaimerVisible(false)}
              size='small'
          >
            <Modal.Content scrolling>
              <Modal.Description>
                <InfoModalContent setDisclaimerVisible={setDisclaimerVisible} />
              </Modal.Description>
            </Modal.Content>
          </Modal> 
      : '' }
    </LayoutMap>
  )
}
