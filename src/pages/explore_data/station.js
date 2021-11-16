import React, { useEffect, useState, useRef  } from 'react';
import LayoutStation from '../../components/layout/layout-station';
import MapStation from '../../components/map/map-station';
import NearbyWaterbodies from '../../components/station-page/nearby-waterbodies';
import NearbyStations from '../../components/station-page/nearby-stations';
import ChartStation from '../../components/station-page/chart-station';
import StationTable from '../../components/station-page/station-table';
import { regionDict } from '../../utils/utils';
import { leftContainer, titleContainer, siteMapContainer, rightContainer, stationName } from './station.module.css';


export default function Station(props) {
    const stationCodeRef = useRef(null);
    const stationObjRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [nearbyStations, setNearbyStations] = useState(null);
    const [selectedAnalytes, setSelectedAnalytes] = useState([]);

    const getStationCode = () => {
        return new Promise((resolve, reject) => {
            const url = props.location.href;
            const re = new RegExp(/station\/\?q=([a-z0-9]+)$/i);
            const matches = url.match(re);
            if (matches[1]) {
                stationCodeRef.current = matches[1];
            } else {
                console.error('Could not parse station code');
            }
            resolve();
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
        })
    }

    useEffect(() => {
        getStationCode()
            .then(() => getStationData())
            .then(() => setLoading(false));
    }, []);

    if (loading === true) {
        return (
            <div>Loading</div>
        );
    } else if (loading === false && stationObjRef.current) {
        return (
            <LayoutStation title='SWAMP Data Dashboard'>
                <div className={leftContainer}>
                    <section className={titleContainer}>
                        <h2 className={stationName}>{stationObjRef.current.StationName ? stationObjRef.current.StationName : null}</h2>
                        <span style={{ fontSize: '0.95em' }}>{stationObjRef.current.StationCode ? stationObjRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{regionDict[stationObjRef.current.Region]} Region</span>
                    </section>
                    <div className={siteMapContainer}>
                        <MapStation 
                            coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} 
                            stationCode={stationObjRef.current.StationCode}
                            region={stationObjRef.current.Region}
                            setNearbyStations={setNearbyStations}
                        />
                    </div>
                    <section style={{ margin: '1.1em 0' }}>
                        <NearbyWaterbodies coordinates={[stationObjRef.current.TargetLongitude, stationObjRef.current.TargetLatitude]} />
                    </section>
                    <section style={{ margin: '1.1em 0' }}>
                        <NearbyStations nearbyStations={nearbyStations} />
                    </section>
                </div>
                <div className={rightContainer}>
                    <section>
                        <h2>Water quality data and trends</h2>
                        <p>Use the table below to view a summary of the water quality data collected at this SWAMP monitoring site. For a more detailed view of the data, select a parameter (or multiple parameters) by checking the box to the left of the parameter and then clicking the "Graph selected parameters" button below.</p>
                    </section>
                    <section>
                        <ChartStation
                            station={stationObjRef.current.StationCode} 
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
    }
}