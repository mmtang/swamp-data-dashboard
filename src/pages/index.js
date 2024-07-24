import React, { useState, useRef, useEffect } from 'react';
import ButtonReload from '../components/common/button-reload';
import ErrorFullscreen from '../components/layout/error-fullscreen';
import MessageModal from '../components/common/message-modal';
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
  getCsciCategoryValue, 
  habitatResourceId,
  parseDate, 
  programDict,
  regionDict,
  regionUrlDict,
  stationsResourceId,
  tissueResourceId,
  toxicityResourceId
} from '../utils/utils';

import { mapContainer } from './index.module.css';

export default function Index() {
  // Data for all stations
  const allStationRef = useRef();

  const [analyte, setAnalyte] = useState(null);
  const [cursor, setCursor] = useState('auto');
  const [disableReferenceSites, setDisableReferenceSites] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [filterByMapExtent, setFilterByMapExtent] = useState(false);
  const [highlightReferenceSites, setHighlightReferenceSites] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);
  const [comparisonSites, setComparisonSites] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [messageModal, setMessageModal] = useState('');
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [species, setSpecies] = useState(null);
  const [station, setStation] = useState(null);
  const [stationLoading, setStationLoading] = useState(false); // This state was previously initiated and used in panel-station.js. Hoisted up to index because there was a slight delay when clicking/loading sites, and changes were rendering before the loading panel appeared. Initating the state here allows us to use setStationLoading in the map component for immediate effect
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
            d.ResultDisplay = parseFloat(d.ResultDisplay);
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
      //console.log(url + new URLSearchParams(params));
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
            d.ResultDisplay = parseFloat(d.resultdisplay);
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
        // The only params currently allowed are 'program', 'region', and 'station'
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
        } else if (paramsKeys[0] === 'station') {
            const stationCode = params.get('station');
            checkStation(stationCode)
            .then((res) => {
              if (res) {
                return resolve({ type: 'station', value: res });
              }
            });
        } else {
          // Param is not 'program' or 'region' or 'station' - show an error
          setLoaded('error');
          console.error('Error: URL param is not valid');
        }
      }
    });
  }

  const checkStation = (stationCode) => {
    return new Promise((resolve, reject) => {
        if (stationCode) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            const params = {
                sql: `SELECT "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", "StationCategory" FROM "${stationsResourceId}" WHERE UPPER("StationCode")=UPPER('${stationCode}')`
            };
            fetch(url + new URLSearchParams(params))
            .then((resp) => {
                if (!resp.ok) {
                  // There is a unexpected response from the server
                  throw new Error('Network response error');
                }
                return resp.json();
            })
            .then((json) => json.result.records)
            .then((records) => {
                if (records.length > 0) {
                    // There is a match (string). Return the entire record with all attributes - this is needed for the setStation value
                    records.forEach(d => {
                      d.RegionName = regionDict[d.Region];
                      d.TargetLatitude = +d.TargetLatitude;
                      d.TargetLongitude = +d.TargetLongitude;
                  });
                    resolve(records[0]);
                } else {
                  setLoaded('error');
                  console.error('Error: No station data. Not a valid station code');
                }
            })
            // Error catching for when there is not a valid response from the API
            .catch((error) => {
                setLoaded('error');
                console.error('Issue with the network response:', error);
            });
        };
    })
}

  const createParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "StationCategory" FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "ResultDisplay", "Unit", "AnalyteDisplay" AS "Analyte", "StationCategory" FROM "${resource}"`;
    };
    if (analyte || program || region) {
        // This block constucts the "WHERE" part of the select query
        // There can be one or more filters
        const whereStatements = [];
        if (analyte) {
          whereStatements.push(`"AnalyteDisplay" = '${analyte.label}'`);
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
        if (whereStatements.length > 0) {
          const concat = whereStatements.join(' AND ');
          querySql += ' WHERE ';
          querySql += concat;
        }
        querySql += ` ORDER BY "StationCode", "SampleDate" DESC`
    }
    return { resource_id: resource, sql: querySql };
  }

  const createTissueParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("LastSampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, MAX("SampleYear") OVER (PARTITION BY "StationCode") as "SampleYear", "CommonName", "ResultType", "StationCategory" FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("LastSampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, MAX("SampleYear") OVER (PARTITION BY "StationCode") as "SampleYear", "CommonName", "ResultType", "Result" as "ResultDisplay", "Unit", "AnalyteDisplay" AS "Analyte", "StationCategory" FROM "${resource}"`;
    };
    if (analyte || program || region || species) {
        // This block constucts the "WHERE" part of the select query
        // There can be one or more filters
        const whereStatements = [];
        if (analyte) {
          whereStatements.push(`"AnalyteDisplay" = '${analyte.label}'`);
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
          whereStatements.push(`"CommonName" = '${species.label}'`);
        }
        // Concat multiple join statements
        if (whereStatements.length > 0) {
          const concat = whereStatements.join(' AND ');
          querySql += ' WHERE ';
          querySql += concat;
        }
        querySql += ` ORDER BY "StationCode", "LastSampleDate" DESC`
    }
    return { resource_id: resource, sql: querySql };
  }

  const createToxicityParams = (resource) => {
    let querySql;
    if (!analyte) {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "StationCategory" FROM "${resource}"`;
    } else {
      querySql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "MeanDisplay" as "ResultDisplay", "Unit", "Analyte", "StationCategory" FROM "${resource}"`;
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
          whereStatements.push(`"OrganismName" = '${species.label}'`);
          whereStatements.push(`"MatrixDisplay" = '${species.matrix}'`);
        }
        // Concat multiple join statements
        if (whereStatements.length > 0) {
          const concat = whereStatements.join(' AND ');
          querySql += ' WHERE ';
          querySql += concat;
        }
        querySql += ` ORDER BY "StationCode", "SampleDate" DESC`
    }
    return { resource_id: resource, sql: querySql };
  }

  // This function runs whenever any of the four states (program, region, analyte, species) change
  // It resets the station dataset OR re-queries the open data portal for new data and initiates changing the underlying data populating the map and table
  useEffect(() => {
    const isDuplicate = (row, arr) => {
      return arr.some(x => (row.StationCode === x.StationCode))
    };

    const processData = (data) => {
      if (data && data.length > 0) {
        let newData = data.sort((a, b) => new Date(b.LastSampleDate).getTime() - new Date(a.LastSampleDate).getTime());
        // Iterate and find unique stations
        // https://stackoverflow.com/questions/61183837/how-to-remove-duplicate-from-array-of-objects-with-multiple-properties-as-unique
        const uniqueStations = [];
        for (const row of newData) {
          if (!isDuplicate(row, uniqueStations)) { 
            uniqueStations.push(row);
          }
        }
        /* Don't think the block below is needed
        if (uniqueStations[0].resultdisplay) {
          uniqueStations.forEach(d => {
            d.LastResult = parseFloat((+d.ResultDisplay).toFixed(3));
          });
        };
        */
       // Special case for CSCI; adding DisplayCategory values
        if (analyte && analyte.label === 'California Stream Condition Index (CSCI)') {
          // The CSCI map symbology includes the reference sites built into the renderer; disable the highlight reference sites option in the map legend as long as CSCI is selected
          setDisableReferenceSites(true);
          uniqueStations.forEach(d => {
            d.DisplayCategory = getCsciCategoryValue(d, true);
          });
        } else {
          setDisableReferenceSites(false);
        }
        return uniqueStations;
      } else {
        setLoaded('error');
        console.error('Station data is empty');
      }
    }

    setMapLoaded(false);
    setView('map') // We need to reset the view every time analyte, region, or program changes because the map must be in view in order to retrieve the extent (and then update tableData)
    // If none of the filters are selected, change state to the full station dataset
    // setFilterByMapExtent(false);
    if (!program && !region && !analyte && !species) {
      setDisableReferenceSites(false);
      setStationData(allStationRef.current);
    } else {
      const paramsChem = createParams(chemistryResourceId);
      const paramsHabitat = createParams(habitatResourceId);
      const paramsTox = createToxicityParams(toxicityResourceId);
      const paramsTissue = createTissueParams(tissueResourceId);
      // If the user selects a species, then the data must be sourced from the toxicity or tissue dataset. Reduce the number of API calls to these two resources only.
      if (species) {
        Promise.all([
          getStations(paramsTox), // Tox dataset
          getTissueStations(paramsTissue) // Tissue dataset
        ]).then((res) => {
          if (res.length > 0) {
            // Concatenate the records into one array
            const allData = res[0].concat(res[1]);
            const uniqueStations = processData(allData); 
            setStationData(uniqueStations);
          } else {
            setLoaded('error');
            console.error('Station data is empty');
          };
        });
      // If the user selects an analyte, then use the "source" property from the analyte state to determine which dataset we should pull from. This allows us to reduce the number of API calls to one dataset/resource.
      } else if (analyte) {
        if (analyte.source === 'chemistry') {
          getStations(paramsChem)
          .then((res) => {
            if (res.length > 0) {
              const uniqueStations = processData(res);
              setStationData(uniqueStations);
            } else {
              setLoaded('error');
              console.error('Station data is empty');
            }
          });
        } else if (analyte.source === 'habitat') {
          getStations(paramsHabitat)
          .then((res) => {
            if (res.length > 0) {
              const uniqueStations = processData(res);
              setStationData(uniqueStations);
            } else {
              setLoaded('error');
              console.error('Station data is empty');
            }
          });
        } else if ((analyte && analyte.source === 'toxicity') || (species && species.source === 'toxicity')) {
          getStations(paramsTox)
          .then((res) => {
            if (res.length > 0) {
              const uniqueStations = processData(res);
              setStationData(uniqueStations);
            } else {
              setLoaded('error');
              console.error('Station data is empty');
            }
          });
        } else if ((analyte && analyte.source === 'tissue') || (species && species.source === 'tissue')) {
          getTissueStations(paramsTissue)
          .then((res) => {
            if (res.length > 0) {
              const uniqueStations = processData(res);
              setStationData(uniqueStations);
            } else {
              setLoaded('error');
              console.error('Station data is empty');
            }
          });
        }
      } else {
        Promise.all([
          getStations(paramsChem), // Chemistry dataset
          getStations(paramsHabitat), // Habitat dataset
          getStations(paramsTox), // Tox dataset
          getTissueStations(paramsTissue) // Tissue dataset
        ]).then((res) => {
          if (res.length > 0) {
            let allData = res[0].concat(res[1], res[2], res[3]);
            const uniqueStations = processData(allData);
            setStationData(uniqueStations);
          }
        });
      }
    }
  }, [analyte, program, region, species])

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
          else if (selection.type === 'station') {
            setStation(selection.value);    
            setStationData(data);   
            setTimeout(() => {
              setZoomToStation(selection.value.StationCode);    
            }, 250);
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
          comparisonSites={comparisonSites}
          cursor={cursor}
          disableReferenceSites={disableReferenceSites}
          filterByMapExtent={filterByMapExtent}
          highlightReferenceSites={highlightReferenceSites}
          mapLoaded={mapLoaded}
          program={program}
          region={region}
          selecting={selecting}
          setFilterByMapExtent={setFilterByMapExtent}
          setMapLoaded={setMapLoaded}
          setMessageModal={setMessageModal}
          setMessageModalVisible={setMessageModalVisible}
          setComparisonSites={setComparisonSites}
          setHighlightReferenceSites={setHighlightReferenceSites}
          setSelecting={setSelecting}
          setStation={setStation}
          setStationData={setStationData}
          setTableData={setTableData}
          setView={setView}
          setZoomToStation={setZoomToStation}
          setStationLoading={setStationLoading}
          species={species}
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
        setAnalyte={setAnalyte}
        setProgram={setProgram}
        setRegion={setRegion}
        setSpecies={setSpecies}
        station={station}
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
        setStationLoading={setStationLoading}
        setZoomToStation={setZoomToStation}
        species={species}
        station={station} 
        stationLoading={stationLoading}
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
      { messageModalVisible ? 
        <MessageModal 
          message={messageModal}
          setMessageModalVisible={setMessageModalVisible} 
          visible={messageModalVisible} 
        />
      : '' }
    </LayoutMap>
  )
}
