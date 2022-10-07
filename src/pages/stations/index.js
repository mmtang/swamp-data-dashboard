import React, { useEffect, useState, useRef  } from 'react';
import DownloadData from '../../components/common/download-data';
import ChartModal from '../../components/station-page/chart-modal';
import ErrorFullscreen from '../../components/common/error-fullscreen';
import LayoutMap from '../../components/layout/layout-map';
import LoaderDashboard from '../../components/common/loader-dashboard';
import MapStation from '../../components/map/map-station';
import Navbar from '../../components/navbar/navbar';
import NearbyWaterbodies from '../../components/station-page/nearby-waterbodies';
import StationTable from '../../components/station-page/station-table';
import { regionDict, fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';
import { appContainer, buttonContainer, contentGrid, header, leftContainer, mainGrid, rightContainer, siteMapContainer, stationName } from './index.module.css';
import Metadata from '../../components/layout/metadata';


export default function Station(props) {
    const stationCodeRef = useRef(null);
    const stationObjRef = useRef(null);
    const errorRef = useRef(null);

    const [loading, setLoading] = useState('true');
    const [tableData, setTableData] = useState(null);
    const [selectedAnalytes, setSelectedAnalytes] = useState([]);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

    const parseStationCode = () => {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams(document.location.search);
            const stationCode = params.get('id');
            if (stationCode) {
                stationCodeRef.current = stationCode;
                resolve(stationCode);
            } else {
                console.error('Error parsing station code');
                errorRef.current = 'Error: Not a valid station code.'
                setLoading('error');
            };
        });
    };

    const getStationInfo = (stationCode) => {
        return new Promise((resolve, reject) => {
            if (stationCode) {
                let url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                const params = {
                    sql: `SELECT "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region" FROM "df69fdd7-1475-4e57-9385-bb1514f0291e" WHERE "StationCode"='${stationCode}'`
                };
                console.log(url + new URLSearchParams(params));
                fetch(url + new URLSearchParams(params))
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    if (records) {
                        records.forEach(d => {
                            d.RegionName = regionDict[d.Region];
                            d.TargetLatitude = +d.TargetLatitude;
                            d.TargetLongitude = +d.TargetLongitude;
                        });
                        // Define stationObjRef to populate station values on page
                        stationObjRef.current = records[0];
                        resolve();
                    } else {
                        console.error('Error getting station information');
                    errorRef.current = 'Error: Could not retrieve station information.'
                    setLoading('error');
                    }
                });
            };
        })
    }

    const getData = (params, source) => {
        return new Promise((resolve, reject) => {
            if (params) {
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                console.log(url + new URLSearchParams(params));
                fetchData(url + new URLSearchParams(params))
                .then(json => json.result.records)
                .then(records => {
                    if (records.length > 0) {
                        records.forEach(d => {
                            d.NumResults = +d.count;
                            d.Min = parseFloat((+d.minresult).toFixed(2));
                            d.Mean = parseFloat((+d.avgresult).toFixed(2));
                            d.Max = parseFloat((+d.maxresult).toFixed(2));
                            d.Unit = (d.Analyte === 'pH' ? '' : d.Unit);
                            d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(2));
                            d.Source = source;
                        });
                    }
                    resolve(records);
                })
                .catch(error => {
                    console.error(error);
                    //errorRef.current = 'Error getting station data. Reload or try again later.'
                    //setLoading('error');
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
                    resource_id: '2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e', 
                    sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay") as MaxSampleDate, "ResultDisplay", "Unit", COUNT("Analyte") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay"), AVG("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as AvgResult, MIN("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MinResult, MAX("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MaxResult FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "Analyte", "MatrixDisplay", "SampleDate" DESC` 
                }
                // Habitat
                const habitatParams = { 
                    resource_id: '6d9a828a-d539-457e-922c-3cb54a6d4f9b', 
                    sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay") as MaxSampleDate, "ResultDisplay", "Unit", COUNT("Analyte") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay"), AVG("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as AvgResult, MIN("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MinResult, MAX("ResultDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MaxResult FROM "6d9a828a-d539-457e-922c-3cb54a6d4f9b" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "Analyte", "MatrixDisplay", "SampleDate" DESC` 
                }
                // Toxicity
                const toxParams = {
                    resource_id: 'a6dafb52-3671-46fa-8d42-13ddfa36fd49',
                    sql: `SELECT DISTINCT ON ("Analyte", "MatrixDisplay") "StationCode", "Analyte", "MatrixDisplay", "AnalyteGroup1", MAX("SampleDate") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay") as MaxSampleDate, "MeanDisplay" as "ResultDisplay", "Unit", COUNT("Analyte") OVER (PARTITION BY "StationCode", "Analyte", "MatrixDisplay"), AVG("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as AvgResult, MIN("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MinResult, MAX("MeanDisplay") OVER (Partition By "StationCode", "Analyte", "MatrixDisplay") as MaxResult FROM "a6dafb52-3671-46fa-8d42-13ddfa36fd49" WHERE "StationCode" = '${encodeURIComponent(stationCodeRef.current)}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "Analyte", "MatrixDisplay", "SampleDate" DESC` 
                }
                // Send all API data requests
                Promise.all([
                    getData(chemParams, 'chemistry'),
                    getData(habitatParams, 'habitat'),
                    getData(toxParams, 'toxicity')
                ]).then((res) => {
                    const allRecords = res[0].concat(res[1], res[2]);
                    setTableData(allRecords);
                    setLoading('false');
                });
            });
    }, []);

    const pageContent = () => {
        return (
            <div className={mainGrid}>
                <div className={header}>
                    <Navbar />
                </div>
                <div className={contentGrid}>
                    <div className={leftContainer}>
                        <section>
                            <h2 className={stationName}>{stationObjRef.current.StationName ? stationObjRef.current.StationName : null}</h2>
                            <span style={{ fontSize: '0.95em' }}>{stationObjRef.current.StationCode ? stationObjRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{stationObjRef.current.RegionName} Region</span>
                        </section>
                        <div className={siteMapContainer}>
                            <MapStation coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} />
                        </div>
                        <section style={{ margin: '1.1em 0' }}>
                            <NearbyWaterbodies coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} />
                        </section>
                    </div>
                    <div className={rightContainer}>
                        <section>
                            <h2>Explore station data</h2>
                            <p>The table below offers a summary of the data collected at this SWAMP monitoring station. For a more detailed view of the data, select a parameter or multiple parameters and click the "Graph data" button below.</p>
                        </section>
                        <section>
                            <div className={buttonContainer}>
                                <ChartModal
                                    station={stationObjRef.current.StationCode} 
                                    stationName={stationObjRef.current.StationName}
                                    selectedAnalytes={selectedAnalytes} 
                                />
                                <DownloadData 
                                    data={tableData}
                                    fields={['StationCode', 'StationName', 'RegionName', 'TargetLatitude', 'TargetLongitude', 'Analyte', 'NumResults', 'LastSampleDate', 'LastResult', 'Unit', 'Trend', 'Min', 'Mean', 'Median', 'Max']}
                                >
                                    Download table data
                                </DownloadData>
                            </div>
                            <StationTable 
                                station={stationObjRef.current.StationCode} 
                                data={tableData}
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
            { loading === 'true' ? <LayoutMap><LoaderDashboard /></LayoutMap> :
            loading === 'error' ? <LayoutMap><ErrorFullscreen>{errorRef.current}</ErrorFullscreen></LayoutMap> :
            loading === 'false' && stationObjRef.current ? pageContent() :
            <LoaderDashboard /> // Catch all other values
            }
        </div>
    )
}