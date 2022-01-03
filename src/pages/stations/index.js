import React, { useEffect, useState, useRef  } from 'react';
import LayoutStation from '../../components/layout/layout-station';
import MapStation from '../../components/map/map-station';
import NearbyWaterbodies from '../../components/station-page/nearby-waterbodies';
import DownloadData from '../../components/common/download-data';
import ChartStation from '../../components/station-page/chart-station';
import StationTable from '../../components/station-page/station-table';
import LoaderDashboard from '../../components/common/loader-dashboard';
import ErrorFullscreen from '../../components/common/error-fullscreen';
import { regionDict } from '../../utils/utils';
import { leftContainer, titleContainer, siteMapContainer, rightContainer, stationName, buttonContainer } from './index.module.css';

export default function Station(props) {
    const stationCodeRef = useRef(null);
    const stationObjRef = useRef(null);
    const errorRef = useRef(null);

    const [loading, setLoading] = useState('true');
    const [tableData, setTableData] = useState([]);
    const [selectedAnalytes, setSelectedAnalytes] = useState([]);

    const parseStationCode = () => {
        return new Promise((resolve, reject) => {
            const url = props.location.href;
            // Use regex to get the station ID from the page URL
            const re = new RegExp(/stations\/\?id=([a-zA-Z0-9]+)$/i);
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

    const getStationData = () => {
        return new Promise((resolve, reject) => {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&limit=5';
            url += '&filters={%22StationCode%22:%22' + stationCodeRef.current + '%22}';
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    const data = json.result.records[0];
                    stationObjRef.current = data;
                    resolve();
                })
                .catch(error => {
                    console.error('Error getting station data');
                    errorRef.current = 'Error getting station data. Reload or try again later.'
                    setLoading('error');
                    reject();
                });
        })
    }

    useEffect(() => {
        parseStationCode()
            .then(() => getStationData())
            .then(() => setLoading('false'));
    }, []);

    const pageContent = () => {
        return (
            <React.Fragment>
                <div className={leftContainer}>
                    <section className={titleContainer}>
                        <h2 className={stationName}>{stationObjRef.current.StationName ? stationObjRef.current.StationName : null}</h2>
                        <span style={{ fontSize: '0.95em' }}>{stationObjRef.current.StationCode ? stationObjRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{regionDict[stationObjRef.current.Region]} Region</span>
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
                        <p>Use the table below to view a summary of the water quality data collected at this SWAMP monitoring station. For a more detailed view of the data, select an indicator (or multiple indicators) and click the "Graph data for selected indicators" button below.</p>
                    </section>
                    <section>
                        <div className={buttonContainer}>
                            <ChartStation
                                station={stationObjRef.current.StationCode} 
                                stationName={stationObjRef.current.StationName}
                                selectedAnalytes={selectedAnalytes} 
                            />
                            <DownloadData data={tableData}>
                                Download table data
                            </DownloadData>
                        </div>
                        <StationTable 
                            station={stationObjRef.current.StationCode} 
                            setTableData={setTableData}
                            setSelectedAnalytes={setSelectedAnalytes}
                        />
                    </section>
                </div>
            </React.Fragment>
        )
    }

    return (
        <LayoutStation>
            { loading === 'true' ? <LoaderDashboard /> :
              loading === 'error' ? <ErrorFullscreen>{errorRef.current}</ErrorFullscreen> :
              loading === 'false' && stationObjRef.current ? pageContent() :
              <LoaderDashboard /> // Catch all other values
            }
        </LayoutStation>
    )
    
    {/*
    if (loading === 'true') {
        return (
            <LayoutStation>
                <LoaderDashboard />
            </LayoutStation>
        )
    } else if (loading === 'false' && stationObjRef.current) {
        return (
            <LayoutStation>
                <div className={leftContainer}>
                    <section className={titleContainer}>
                        <h2 className={stationName}>{stationObjRef.current.StationName ? stationObjRef.current.StationName : null}</h2>
                        <span style={{ fontSize: '0.95em' }}>{stationObjRef.current.StationCode ? stationObjRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{regionDict[stationObjRef.current.Region]} Region</span>
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
                        <p>Use the table below to view a summary of the water quality data collected at this SWAMP monitoring station. For a more detailed view of the data, select a parameter (or multiple parameters) by checking the box to the left of the parameter and then clicking the "Graph selected parameters" button below.</p>
                    </section>
                    <section>
                        <ChartStation
                            station={stationObjRef.current.StationCode} 
                            stationName={stationObjRef.current.StationName}
                            selectedAnalytes={selectedAnalytes} 
                        />
                        <StationTable 
                            station={stationObjRef.current.StationCode} 
                            setSelectedAnalytes={setSelectedAnalytes}
                        />
                    </section>
                </div>
            </LayoutStation>
        );
    } else if (loading === 'error') {
        return (
            <LayoutStation>
                <LoaderDashboard />
            </LayoutStation>
        )
    } else {
        return (
            <LayoutStation>
                <LoaderDashboard />
            </LayoutStation>
        )
    }
    */}
}