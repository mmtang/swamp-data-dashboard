import React, { useState, useRef, useEffect } from 'react';
import ButtonReload from '../components/common/button-reload';
import ErrorFullscreen from '../components/layout/error-fullscreen';
import ModalContent from '../components/common/modal-content';
import LayoutMap from '../components/layout/layout-map';
import Metadata from '../components/layout/metadata';
import PanelIndex from '../components/panels/panel-index';
import PanelMap from '../components/panels/panel-map';
import PanelStation from '../components/panels/panel-station';

import { Modal } from 'semantic-ui-react';

import { linkColorAlt } from '../constants/constants-app';
import { 
  capitalizeFirstLetter, 
  chemistryResourceId,
  formatDate, 
  habitatResourceId,
  parseDate, 
  programDict,
  regionDict,
  regionUrlDict,
  tissueResourceId,
  toxicityResourceId
} from '../utils/utils';

import { mapContainer } from './index.module.css';

export default function Index() {
  // Data for all stations
  const allStationRef = useRef();

  const [analyte, setAnalyte] = useState(null);
  const [cursor, setCursor] = useState('auto');
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  const [comparisonSites, setComparisonSites] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [species, setSpecies] = useState(null);
  const [station, setStation] = useState(null);
  const [stationData, setStationData] = useState(null); // Data queried from the API and then passed to the map component
  const [tableData, setTableData] = useState(null); // The same station data from StationData but queried from the map (by current map extent) and passed to the table component
  const [view, setView] = useState('map');
  const [zoomToStation, setZoomToStation] = useState(false);

  const getAllStations = () => {
    return new Promise((resolve, reject) => {
      const params = {
        // SWAMP Stations: https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/df69fdd7-1475-4e57-9385-bb1514f0291e
        resource_id: 'df69fdd7-1475-4e57-9385-bb1514f0291e',
        limit: 8000
      };
      const url = 'https://data.ca.gov/api/3/action/datastore_search?';
      fetch(url + new URLSearchParams(params))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Network response error');
        }
        return resp.json();
      })
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
      .catch((error) => {
        setLoaded('error');
        console.error('Issue with the network response:', error);
      });
    });
  }

  const getStations = (params) => {
    return new Promise((resolve, reject) => {
      const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
      fetch(url + new URLSearchParams(params))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Network response error');
        }
        return resp.json();
      })
      .then((json) => json.result.records)
      .then((records) => {
        if (records) {
          records.forEach(d => {
            d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
            d.ResultDisplay = +d.resultdisplay
            d.RegionName = regionDict[d.Region];
            d.TargetLatitude = +d.TargetLatitude;
            d.TargetLongitude = +d.TargetLongitude;
          });
          resolve(records);
        }
      })
      .catch((error) => {
        setLoaded('error');
        console.error('Issue with the network response:', error);
      });
    })
  }

  const getTissueStations = (params) => {
    return new Promise((resolve, reject) => {
      const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
      console.log(url + new URLSearchParams(params));
      fetch(url + new URLSearchParams(params))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Network response error');
        }
        return resp.json();
      })
      .then((json) => json.result.records)
      .then((records) => {
        if (records) {
          records.forEach(d => {
            d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
            d.ResultDisplay = +d.resultdisplay
            d.RegionName = regionDict[d.Region];
            d.TargetLatitude = +d.TargetLatitude;
            d.TargetLongitude = +d.TargetLongitude;
          });
          resolve(records);
        }
      })
      .catch((error) => {
        setLoaded('error');
        console.error('Issue with the network response:', error);
      });
    })
  }

  // Check if url includes params for program or region, runs on initial load
  const checkForParams = () => {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams(document.location.search);
      // Convert to obj/dict
      const paramsDict = Object.fromEntries(params);
      const paramsKeys = Object.keys(paramsDict);
      const paramsValues = Object.values(paramsDict);
      // Resolve if no parameter is passed in
      if (paramsKeys.length === 0) {
        return resolve();
      }
      if (paramsKeys.length > 1) {
        // Show an error if more than one parameter is passed in (not allowed yet - maybe in the future?)
        setLoaded('error');
        console.error('Error: Too many URL params');
      } else if (paramsValues[0] === '') {
        // Show an error if the parameter value is an empty string (this results if the user does something like ?region=)
        setLoaded('error');
        console.error('Error: Parameter value is an empty string');
      } else {
        // The only params currently allowed are 'program' and 'region'
        if (paramsKeys[0] === 'program') {
          const program = params.get('program');
          // Check that the program is a valid match
          if (Object.keys(programDict).includes(program)) {
            return resolve({ type: 'program', value: program }) // There is a match
          } else {
            // There is no match, show an error
            setLoaded('error');
            console.error('Error: URL param value is not valid')
          }
        } else if (paramsKeys[0] === 'region') {
          const region = params.get('region');
          // Check that the region is a valid/matching value
          // Region could be a string (e.g., north_coast) or it could be a string number (e.g., 1)
          // Number from params is always captured as a string
          if (Object.keys(regionUrlDict).includes(region)) {
            // There is a match (string)
            return resolve({ type: 'region', value: regionUrlDict[region] }) 
          } else if (Object.keys(regionDict).includes(region)) {
            // There is a match (num/int)
            // The key values in regionDict are actually in number data type, but they get converted to string with the Object.keys operation
            // Because of this, there is no need to convert region to num/int when doing the comparison in the if clause, but it should be converted when resolving/passing the object
            return resolve({ type: 'region', value: +region }) 
          } else {
            // There is no match, show an error
            setLoaded('error');
            console.error('Error: URL param value is not valid')
          }
        } else {
          // Param is not 'program' or 'region' - show an error
          setLoaded('error');
          console.error('Error: URL param is not valid')
        }
      }
    });
  }

  const createParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "${ resource === toxicityResourceId ? 'MeanDisplay' : 'ResultDisplay' }" as ResultDisplay, "Unit" FROM "${resource}"`;
    };
    if (analyte || program || region || species) {
        // This block constucts the "WHERE" part of the select query
        // There can be one or more filters
        const whereStatements = [];
        if (analyte) {
          whereStatements.push(`"Analyte" = '${analyte.label}'`);
          whereStatements.push(`"MatrixDisplay" = '${analyte.matrix}'`);
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

  const createTissueParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("LastSampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("LastSampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "ResultAdjusted" as ResultDisplay, "Unit" FROM "${resource}"`;
    };
    if (analyte || program || region || species) {
        // This block constucts the "WHERE" part of the select query
        // There can be one or more filters
        const whereStatements = [];
        if (analyte) {
          whereStatements.push(`"Analyte" = '${analyte.label}'`);
          whereStatements.push(`"MatrixDisplay" = '${analyte.matrix}'`);
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
        if (species) {
          whereStatements.push(`"CommonName" = '${species}'`);
        }
        console.log(whereStatements);
        // Concat multiple join statements
        const concat = whereStatements.join(' AND ');
        querySql += ' WHERE ';
        querySql += concat;
        querySql += ` ORDER BY "StationCode", "LastSampleDate" DESC`
        console.log(querySql);
    }
    return { resource_id: resource, sql: querySql };
  }

  // This function runs whenever any of the three states (program, region, analyte, species) change
  // It resets the station dataset OR re-queries the open data portal for new data and initiates changing the underlying data populating the map and table
  useEffect(() => {
    const isDuplicate = (row, arr) => {
      return arr.some(x => (row.StationCode === x.StationCode))
    };

    setMapLoaded(false);
    setView('map') // We need to reset the view every time analyte, region, or program changes because the map must be in view in order to retrieve the extent (and then update tableData)
    // If none of the filters are selected, change state to the full station dataset
    if (!program && !region && !analyte && !species) {
      setStationData(allStationRef.current);
    } else {
      const paramsChem = createParams(chemistryResourceId);
      const paramsHabitat = createParams(habitatResourceId);
      const paramsTox = createParams(toxicityResourceId);
      const paramsTissue = createTissueParams(tissueResourceId);
      Promise.all([
        // Chemistry dataset
        getStations(paramsChem),
        // Habitat dataset
        getStations(paramsHabitat),
        // Tox dataset
        getStations(paramsTox),
        // Tissue dataset
        getTissueStations(paramsTissue)
      ]).then((res) => {
        if (res.length > 0) {
          console.log(res);
          // Concatenate the records into one array
          let allData = res[0].concat(res[1], res[2], res[3]);
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
          if (uniqueStations[0].resultdisplay) {
            uniqueStations.forEach(d => {
              d.LastResult = parseFloat((+d.ResultDisplay).toFixed(3));
            });
          };
          setStationData(uniqueStations);
        }
      })
    }
  }, [analyte, program, region, /*species*/ ])

  // This function runs upon initial load
  // Get full station dataset - data for use in map and table
  useEffect(() => {
    getAllStations()
    .then((data) => {
      //allStationRef.current = data; // moved below - delete this is all works well
      checkForParams()
      .then((selection) => {
        allStationRef.current = data;
        if (selection) {
          if (selection.type === 'program') {
              setProgram(selection.value);
          }
          else if (selection.type === 'region') {
              if (typeof selection.value === 'string') {
                setRegion(regionUrlDict[selection.value]);
              } else if (typeof selection.value === 'number') {
                setRegion(selection.value);
              }
          }
          else {
            // If there is no region or program value, set stations to all data (default)
            setStationData(data);
          }
        } else {
          // If there is no region or program value, set stations to all data (default)
          setStationData(data);
        }
        setDisclaimerVisible(true); // Show welcome modal
      });
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

  useEffect(() => {
    if (selecting) {
      setCursor('crosshair');
    } else if (!selecting) {
      setCursor('auto');
    }
  }, [selecting])

  return (
    <LayoutMap> 
      <div className={mapContainer}>
        <Metadata />
        <PanelMap
          analyte={analyte}
          cursor={cursor}
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
          setTableData={setTableData}
          setView={setView}
          setZoomToStation={setZoomToStation}
          station={station}
          stationData={stationData}
          tableData={tableData}
          view={view}
          zoomToStation={zoomToStation}
        />
      </div>
      { loaded === 'error' ? 
        <ErrorFullscreen>
          <div>There was an issue with the request.</div>
          <div>Try again later or contact us at <a href="mailto:swamp@waterboards.ca.gov" style={linkColorAlt}>swamp@waterboards.ca.gov</a>.</div>
          <div><ButtonReload /></div>
        </ErrorFullscreen> 
        : null 
      }
      {/* Render both panels at the same time but control visibility using styles around the parent divs in each component. Conditional rendering, which is what was in place before, causes the PanelIndex component and all select menus to re-render after closing out the station panel, which is not desirable. https://stackoverflow.com/questions/69009266/react-hiding-vs-removing-components */}
      <PanelIndex 
        analyte={analyte}
        program={program}
        region={region}
        setAnalyte={setAnalyte}
        setProgram={setProgram}
        setRegion={setRegion}
        setSpecies={setSpecies}
        species={species}
        station={station}
        stationData={stationData}
      />
      <PanelStation 
        analyte={analyte} 
        comparisonSites={comparisonSites}
        cursor={cursor}
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
                <ModalContent setDisclaimerVisible={setDisclaimerVisible} />
              </Modal.Description>
            </Modal.Content>
          </Modal> 
      : '' }
    </LayoutMap>
  )
}
