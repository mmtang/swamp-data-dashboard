import React, { useState, useRef, useEffect } from 'react';
import LayoutMap from '../../components/layout/layout-map';
import LoaderDashboard from '../../components/common/loader-dashboard';
import Metadata from '../../components/layout/metadata';
import PanelMap from '../../components/panels/panel-map';
import PanelSpot from '../../components/panels/panel-spot';
import PanelStation from '../../components/panels/panel-station';

import { formatDate, parseDate, regionDict } from '../../utils/utils';
import { mapContainer } from '../index.module.css';

export default function IndexSpot() {
    // Data for all stations
    const allStationRef = useRef();

    const [loaded, setLoaded] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [analyte, setAnalyte] = useState(null);
    const [region, setRegion] = useState(null);
    const [station, setStation] = useState(null);
    const [stationData, setStationData] = useState(null);

    const getAllStations = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e" ORDER BY "StationCode", "SampleDate" DESC`;
            let url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=' + sql;
            console.log(url);
            fetch(url)
            .then((resp) => resp.json())
            .then((json) => json.result.records)
            .then((records) => {
                if (records) {
                    console.log(records);
                    records.forEach(d => {
                        d.Region = d.Region.toString();
                        d.RegionName = regionDict[d.Region];
                        d.LastSampleDate = formatDate(parseDate(d.maxsampledate));
                        d.TargetLatitude = +d.TargetLatitude;
                        d.TargetLongitude = +d.TargetLongitude;
                    });
                    resolve(records);
                } else {
                    console.error('No station records retrieved');
                }
            });
        })
    }

    const getStationData = (analyte) => {
        return new Promise((resolve, reject) => {
            // In the future, add different urls for the analyte type
            const sql = `SELECT DISTINCT ON ("StationCode") "StationCode", "StationName", "TargetLatitude", "TargetLongitude", "Region", "Analyte", MAX("SampleDate") OVER (PARTITION BY "StationCode") as MaxSampleDate, "ResultDisplay", "Unit" FROM "2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e" WHERE "Analyte" = '${encodeURIComponent(analyte.name)}' AND "DataQuality" in ('Passed', 'Some review needed', 'Spatial accuracy unknown', 'Unknown data quality', 'Extensive review needed') ORDER BY "StationCode", "SampleDate" DESC`;
            let url = 'https://data.ca.gov/api/3/action/datastore_search_sql?sql=' + sql;
            fetch(url)
                .then((resp) => resp.json())
                .then((json) => json.result.records)
                .then((records) => {
                    if (records) {
                        console.log(records);
                        records.forEach(d => {
                            d.Region = d.Region.toString();
                            d.RegionName = regionDict[d.Region];
                            d.LastSampleDate = formatDate(parseDate(d.maxsampledate)); // API request returns calculated values in all lowercase
                            d.TargetLatitude = +d.TargetLatitude;
                            d.TargetLongitude = +d.TargetLongitude;
                            d.ResultDisplay = +parseFloat(d.ResultDisplay).toFixed(3); // Round to 3 decimal places (if needed)
                            //d.avgresult = (+d.avgresult).toFixed(1); // Round to one decimal and convert to string
                        });
                        resolve(records);
                    } else {
                        console.error('No station records retrieved');
                    }
                });  
            });
    }

    useEffect(() => {
        getAllStations()
            .then((res) => {
                // Save station data for future use
                allStationRef.current = res;
                // Set current station data
                setStationData(res);
            })
    }, [])

    useEffect(() => {
        if (mapLoaded) {
            setLoaded(true);
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (analyte) {
            getStationData(analyte)
            .then(res => {
                setStationData(res);
            });
        } else {
            setStationData(allStationRef.current);
        }
    }, [analyte])

    return (
        <LayoutMap>
            <Metadata />
            {/* Map */}
            <div className={mapContainer}>
                <PanelMap
                    analyte={analyte}
                    region={region}
                    setMapLoaded={setMapLoaded}
                    setStation={setStation}
                    setStationData={setStationData}
                    stationData={stationData}
                />
            </div>
            {/* Loader */} 
            { !loaded ? <LoaderDashboard /> : null }
            {/* Side panel */}
            { station ? <PanelStation station={station} setStation={setStation} analyte={analyte} /> : 
            <PanelSpot 
                setStationData={setStationData} 
                setAnalyte={setAnalyte}
                setRegion={setRegion}
                stationData={stationData} 
            /> }
        </LayoutMap>

    )
}
