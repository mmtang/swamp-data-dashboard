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
import { appContainer, mainGrid, header, leftContainer, siteMapContainer, rightContainer, stationName, buttonContainer } from './index.module.css';
import Metadata from '../../components/layout/metadata';


export default function Station(props) {
    const stationCodeRef = useRef(null);
    const stationObjRef = useRef(null);
    const errorRef = useRef(null);

    const [loading, setLoading] = useState('true');
    const [tableData, setTableData] = useState([]);
    const [selectedAnalytes, setSelectedAnalytes] = useState([]);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

    const parseStationCode = () => {
        return new Promise((resolve, reject) => {
            const url = props.location.href;
            // Use regex to get the station code from the page URL
            const re = new RegExp(/stations\/\?id=([a-zA-Z0-9-_]+)$/i);
            const matches = url.match(re);
            // Match returns null if no matches are found
            // If a match is found, get the second array item [1] (capturing group), not the first [0] array item (complete matching regular expression))
            if (matches) {
                stationCodeRef.current = matches[1];
                resolve();
            } else {
                console.error('Error parsing station code');
                errorRef.current = 'Error: Not a valid station code.'
                setLoading('error');
            }
        })
    }

    const getTableData = () => {
        return new Promise((resolve, reject) => {
            if (stationCodeRef.current) {
                let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=1000&fields=StationCode,StationName,Region,Analyte,LastSampleDate,LastResult,Unit,Min,Max,Median,Mean,Trend,NumResults,TargetLatitude,TargetLongitude';
                url += '&filters={%22StationCode%22:%22' + encodeURIComponent(stationCodeRef.current) + '%22}';
                fetchData(url)
                .then(json => json.result.records)
                .then(records => {
                    if (records.length > 0) {
                        records.forEach(d => {
                            d.Min = +d.Min.toFixed(2);
                            d.Mean = +d.Mean.toFixed(2);
                            d.Median = +d.Median.toFixed(2);
                            d.Max = +d.Max.toFixed(2);
                            d.Unit = (d.Analyte === 'pH' ? '' : d.Analyte === 'CSCI' ? 'score' : d.Unit);
                            d.LastSampleDate = formatDate(parseDate(d.LastSampleDate));
                            d.TargetLatitude = +d.TargetLatitude;
                            d.TargetLongitude = +d.TargetLongitude;
                            d.RegionName = regionDict[d.Region];
                        });
                        // Define stationObjRef to populate station values on page
                        stationObjRef.current = records[0];
                        setTableData(records);
                        resolve();
                    } else {
                        errorRef.current = `No data available. Check the Station ID or try again later.`;
                        setLoading('error');
                    }
                })
                .catch(error => {
                    console.error(error);
                    errorRef.current = 'Error getting station data. Reload or try again later.'
                    setLoading('error');
                });
            }
        })
    }

    useEffect(() => {
        parseStationCode()
            .then(() => getTableData())
            .then(() => setLoading('false'));
    }, []);

    const pageContent = () => {
        return (
            <div className={mainGrid}>
                <div className={header}>
                    <Navbar />
                </div>
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
                        <h2>Water quality data and trends</h2>
                        <p>Use the table below to view a summary of the water quality data collected at this SWAMP monitoring station. For a more detailed view of the data, select an indicator or indicators and click the "Graph data for selected indicators" button below.</p>
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