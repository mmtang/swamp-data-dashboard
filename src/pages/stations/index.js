import React, { useEffect, useState, useRef  } from 'react';
import ChartModal from '../../components/station-page/chart-modal';
import ErrorFullscreen from '../../components/layout/error-fullscreen';
import LayoutMap from '../../components/layout/layout-map';
import LoaderDashboard from '../../components/loaders/loader-dashboard';
import MapStation from '../../components/map/map-station';
import Metadata from '../../components/layout/metadata';
import Navbar from '../../components/navbar/navbar';
import NearbyWaterbodies from '../../components/station-page/nearby-waterbodies';
import Photos from '../../components/station-page/photos';
import StationTable from '../../components/table/station-table';
import TableClear from '../../components/station-page/table-clear';
import TableMenu from '../../components/station-page/table-menu';
import TableSearch from '../../components/station-page/table-search';

import { Label, Popup } from 'semantic-ui-react';
import { linkColorAlt, popupStyle, referenceSitesText, roundPlaces } from '../../constants/constants-app';
import { 
    chemistryResourceId, 
    habitatResourceId, 
    regionDict, 
    stationsResourceId, 
    tissueResourceId, 
    toxicityResourceId 
} from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';
import { 
    appContainer, 
    buttonContainer, 
    contentGrid, 
    header, 
    leftContainer, 
    mainGrid, 
    rightContainer, 
    siteMapContainer, 
    stationName,
    tagContainer
} from './index.module.css';

export default function Station(props) {
    const allDataRef = useRef(null);  // Save all analyte data points for this station; for filtering
    const categoriesRef = useRef(null);
    const stationCodeRef = useRef(null);
    const stationObjRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [imageStationUrl, setImageStationUrl] = useState(null);
    const [loading, setLoading] = useState('true');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAnalytes, setSelectedAnalytes] = useState([]);
    const [tableData, setTableData] = useState(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

    const parseStationCode = () => {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams(document.location.search);
            const stationCode = params.get('id');
            if (stationCode) {
                stationCodeRef.current = stationCode.toUpperCase();
                resolve(stationCode);
            } else {
                // Error catching for when there is not an id param in the page request (cannot parse id value). Does not check if the station value/code is valid (see getStationInfo)
                console.error('Error parsing id value');
                setErrorMessage(<div>Error: Not a valid request.<br />Check the URL and try again.</div>);
                setLoading('error');
            };
        });
    };

    // This function checks to see if an image exists (on the Water Boards web server) for the given station. If it exists, then it will change the reference variable
    const checkImage = (stationCode) => {
        if (stationCode) {
            const baseUrl = 'https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/images/csci_scores_map/';
            const imgUrl = baseUrl + stationCode.toLowerCase() + '.jpg';
            const image = new Image();
            image.onload = () => {
                setImageStationUrl(imgUrl);
            };
            image.onerror = () => {
                console.log('Site does not have an image');
            }
            image.src = imgUrl;
        } else {
            console.error('Empty station code')
        }
    }

    const getStationInfo = (stationCode) => {
        return new Promise((resolve, reject) => {
            if (stationCode) {
                let url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                const params = {
                    sql: `SELECT "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", "StationCategory" FROM "${stationsResourceId}" WHERE UPPER("StationCode")=UPPER('${stationCode}')`
                };
                fetch(url + new URLSearchParams(params))
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error('Network response error');
                    }
                    return resp.json();
                })
                .then((json) => json.result.records)
                .then((records) => {
                    if (records.length > 0) {
                        records.forEach(d => {
                            d.RegionName = regionDict[d.Region];
                            d.TargetLatitude = +d.TargetLatitude;
                            d.TargetLongitude = +d.TargetLongitude;
                        });
                        // Define stationObjRef to populate station values on page
                        stationObjRef.current = records[0];
                        resolve();
                    } else {
                        // Error catching for if the response from API is empty
                        // No matches or data returned will return an empty array
                        console.error('Error getting station information. Not a valid station code.');
                        setErrorMessage('Error: Not a valid station code.');
                        setLoading('error');
                    }
                })
                // Error catching for when there is not a valid response from the API
                .catch((error) => {
                    setErrorMessage(<div>There was an issue with the request.<br />Try again later or contact us at <a href="mailto:swamp@waterboards.ca.gov" style={linkColorAlt}>swamp@waterboards.ca.gov</a>.</div>);
                    setLoading('error');
                    console.error('Issue with the network response:', error);
                });
            };
        })
    }

    const getCategories = (data) => {
        const categories = data.map(d => d.AnalyteGroup1);
        let uniqueCategories = [...new Set(categories)];
        uniqueCategories.sort();
        // Filter out null values, don't want this value to show in the select menu
        uniqueCategories = uniqueCategories.filter(d => d !== null);
        categoriesRef.current = uniqueCategories;
    }

    const getData = (params, source) => {
        return new Promise((resolve, reject) => {
            if (params) {
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                fetch(url + new URLSearchParams(params))
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error('Network response error');
                    }
                    return resp.json();
                })
                .then(json => json.result.records)
                .then(records => {
                    if (records.length > 0) {
                        records.forEach(d => {
                            d.NumResults = +d.count;
                            d.Min = parseFloat((+d.minresult).toFixed(roundPlaces));
                            d.Mean = parseFloat((+d.avgresult).toFixed(roundPlaces));
                            d.Max = parseFloat((+d.maxresult).toFixed(roundPlaces));
                            d.Unit = (d.Analyte === 'pH' ? '' : d.Unit);
                            d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(roundPlaces));
                            d.Source = source;
                        });
                    }
                    resolve(records);
                })
                // Error catching for when there is not a valid response from the API
                .catch(error => {
                    setErrorMessage(<div>There was an issue with the request.<br />Try again later or contact us at <a href="mailto:swamp@waterboards.ca.gov" style={linkColorAlt}>swamp@waterboards.ca.gov</a>.</div>);
                    setLoading('error');
                    console.error('Issue with the network response:', error);
                });
            }
        })
    }

    useEffect(() => {
        parseStationCode()
            .then((stationCode) => getStationInfo(stationCode))
            .then(() => {
                // Chemistry
                const chemParams = { 
                    resource_id: chemistryResourceId, 
                    sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay") as MaxSampleDate, "ResultDisplay", "Unit", COUNT("AnalyteDisplay") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay"), AVG("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as AvgResult, MIN("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as MinResult, MAX("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as MaxResult FROM "${chemistryResourceId}" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "AnalyteDisplay", "MatrixDisplay", "SampleDate" DESC` 
                };
                // Habitat
                const habitatParams = { 
                    resource_id: habitatResourceId, 
                    sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay") "StationCode", "AnalyteDisplay", "MatrixDisplay", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay") as MaxSampleDate, "ResultDisplay", "Unit", COUNT("AnalyteDisplay") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay"), AVG("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as AvgResult, MIN("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as MinResult, MAX("ResultDisplay") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay") as MaxResult FROM "${habitatResourceId}" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "AnalyteDisplay", "MatrixDisplay", "SampleDate" DESC` 
                };
                // Tissue
                const tissueParams = {
                    resource_id: tissueResourceId,
                    sql: `SELECT DISTINCT ON ("AnalyteDisplay", "MatrixDisplay", "CommonName") "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName" as "Species", "AnalyteGroup1", MAX("LastSampleDate") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName") as MaxSampleDate, "Result" as "ResultDisplay", "Unit", COUNT("AnalyteDisplay") OVER (PARTITION BY "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName"), AVG("Result") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName") as AvgResult, MIN("Result") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName") as MinResult, MAX("Result") OVER (Partition By "StationCode", "AnalyteDisplay", "MatrixDisplay", "CommonName") as MaxResult FROM "${tissueResourceId}" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "AnalyteDisplay", "MatrixDisplay", "CommonName", "LastSampleDate" DESC` 
                };
                // Toxicity
                const toxParams = {
                    resource_id: toxicityResourceId,
                    sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay", "OrganismName") "StationCode", "Analyte" as "AnalyteDisplay", "MatrixDisplay", "OrganismName" as "Species", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay", "OrganismName") as MaxSampleDate, "MeanDisplay" as "ResultDisplay", "Unit", COUNT("Analyte") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay", "OrganismName"), AVG("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay", "OrganismName") as AvgResult, MIN("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay", "OrganismName") as MinResult, MAX("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay", "OrganismName") as MaxResult FROM "${toxicityResourceId}" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "Analyte", "MatrixDisplay", "OrganismName", "SampleDate" DESC` 
                };
                // Send all API data requests
                Promise.all([
                    getData(chemParams, 'chemistry'),
                    getData(habitatParams, 'habitat'),
                    getData(tissueParams, 'tissue'),
                    getData(toxParams, 'toxicity')
                ]).then((res) => {
                    const allRecords = res[0].concat(res[1], res[2], res[3]);
                    allRecords.forEach((d) => {
                        d.SearchText = d.AnalyteDisplay + (d.Species ? ' ' + d.Species : ''); // Create a new attribute concatenating the analyte and species values, to be used for searches
                        d.Species = d.Species || null; // Replace undefined values with null
                    });
                    getCategories(allRecords);
                    allDataRef.current = allRecords; // Save for use later (filtering)
                    setTableData(allRecords);
                    checkImage(stationCodeRef.current);
                    setLoading('false');
                });
            });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const newSelection = allDataRef.current.filter(d => d.AnalyteGroup1 === selectedCategory.value);
            setTableData(newSelection);
        } else {
            setTableData(allDataRef.current);
        }
    }, [selectedCategory])

    // This function handles changes to the search bar input element. It filters the table data and then changes the table data state to the newly selected records. This function also handles resetting the table data state (when the user clears the search bar). 
    // The search filter builds upon the category filter. As in, the search filter is applied after the category flter. If the search input is cleared, the table data will revert to the dataset that was filtered by category (if a category was selected). If no category was selected, then the table data will be reset to the original dataset with all records.
    useEffect(() => {
        if (filterText.length > 0) {
            // Filter records based on search input
            let records = [];
            if (selectedCategory) {
                records = allDataRef.current.filter(d => d.AnalyteGroup1 === selectedCategory.value);
            } else {
                records = allDataRef.current;
            }
            const newSelection = records.filter(d => {
                return d.SearchText.toLowerCase().includes(filterText.toLowerCase());
            });
            setTableData(newSelection);
        } else {
            // Reset records
            let resetRecords = [];
            if (selectedCategory) {
                resetRecords = allDataRef.current.filter(d => d.AnalyteGroup1 === selectedCategory.value);
            } else {
                resetRecords = allDataRef.current;
            }
            setTableData(resetRecords);
        }
    }, [filterText])

    const pageContent = () => {
        return (
            <div className={mainGrid}>
                <div className={header}>
                    <Navbar setDisclaimerVisible={false} />
                </div>
                <div className={contentGrid}>
                    <div className={leftContainer}>
                        <section>
                            <h2 className={stationName}>{stationObjRef.current.StationName ? stationObjRef.current.StationName : null}</h2>
                            <span style={{ fontSize: '0.95em' }}>{stationObjRef.current.StationCode ? stationObjRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{stationObjRef.current.RegionName} Region</span>
                            { stationObjRef.current && stationObjRef.current.StationCategory === 'Reference' ? 
                            <div className={tagContainer}>
                                <Popup
                                    inverted
                                    content={referenceSitesText}
                                    style={popupStyle}
                                    trigger={
                                        <Label basic color='orange' size='small' style={{ borderRadius: 0 }}>
                                            Reference site
                                        </Label>
                                    }
                                />
                            </div>
                            : null }
                        </section>
                        <div className={siteMapContainer}>
                            <MapStation coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} stationCategory={stationObjRef ? stationObjRef.current.StationCategory : null } />
                        </div>
                        <section style={{ margin: '1.1em 0' }}>
                            <NearbyWaterbodies coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} />
                            <Photos image={imageStationUrl} />
                        </section>
                    </div>
                    <div className={rightContainer}>
                        <section>
                            <h2>Explore station data</h2>
                            <p>The table below offers a summary of the data collected at this SWAMP monitoring station. For a more detailed view of the data, select an analyte or multiple analytes and click the "Graph data" button below.</p>
                        </section>
                        <section>
                            <div className={buttonContainer}>
                                <ChartModal
                                    station={stationObjRef.current.StationCode} 
                                    stationName={stationObjRef.current.StationName}
                                    selectedAnalytes={selectedAnalytes} 
                                />
                                <TableMenu 
                                    categories={categoriesRef.current} 
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                />
                                <TableSearch
                                    filterText={filterText}
                                    setFilterText={setFilterText} 
                                />
                            </div>
                            <TableClear
                                selectedAnalytes={selectedAnalytes} 
                                setSelectedAnalytes={setSelectedAnalytes}
                            />
                            <StationTable 
                                data={tableData}
                                selectedAnalytes={selectedAnalytes}
                                setSelectedAnalytes={setSelectedAnalytes}
                            />
                        </section>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={appContainer}>
            <Metadata title='Monitoring Station' />
            { loading === 'true' ? 
                <LayoutMap search={false}>
                    <LoaderDashboard />
                </LayoutMap> 
            : loading === 'error' ? 
                <LayoutMap search={false}>
                    <ErrorFullscreen>
                        <div>{errorMessage}</div>
                    </ErrorFullscreen>
                </LayoutMap> 
            : loading === 'false' && stationObjRef.current ? pageContent() :
                <LoaderDashboard /> 
            }
        </div>
    )
}