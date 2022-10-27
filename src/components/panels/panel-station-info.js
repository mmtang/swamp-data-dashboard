import React, { useEffect, useRef, useState } from 'react';
import ChartPanel from '../chart-index/chart-panel';
import CompareSites from '../compare-sites/compare-sites';
import LoaderBlock from '../common/loader-block';
import StationAnalyteMenu from '../station-page/station-analyte-menu';
import { Segment } from 'semantic-ui-react';

import { chemistryResourceId, formatDate, habitatResourceId, parseDate, toxicityResourceId } from '../../utils/utils';

export default function PanelStationInfo({ 
    analyte, 
    comparisonSites, 
    selecting, 
    setComparisonSites, 
    setSelecting, 
    station 
}) {  
    const [allSites, setAllSites] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [downloadData, setDownloadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [panelAnalyte, setPanelAnalyte] = useState(analyte);

    const unitRef = useRef(null);

    const getData = (station, dataAnalyte) => {
        return new Promise((resolve, reject) => {
            if (dataAnalyte) {
                // Get the data source for data query
                let resource;
                if (dataAnalyte.source === 'chemistry') {
                    resource = chemistryResourceId;
                } else if (dataAnalyte.source === 'habitat') {
                    resource = habitatResourceId;
                } else if (dataAnalyte.source === 'toxicity') {
                    resource = toxicityResourceId;
                }
                // Build query string and get data
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                const params = {
                    resource_id: resource,
                    sql: `SELECT * FROM "${resource}" WHERE "Analyte" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                fetch(url + new URLSearchParams(params))
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        // Process the returned data based on the data source/type
                        let data = records;
                        if (dataAnalyte.source === 'chemistry' || dataAnalyte.source === 'habitat') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat(((+d.ResultDisplay)).toFixed(3));
                                d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                                if (d.Unit === 'none') {
                                    d.Unit = '';  // for pH records
                                }
                            });
                        }
                        if (dataAnalyte.source === 'toxicity') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat(((+d.MeanDisplay).toFixed(3)));  // Use the ResultDisplay name for consistency when reusing chart component
                                d.Censored = false;  // Convert string to boolean                            
                            });
                        }
                        resolve(data);
                    });
            }
        });
    }

    // This function packages the chart data into a form that is ready for download.
    // It combines multiple sites' data into one array. No need to worry about different data structures because all sites under the same analyte should have the same structure.
    const processDataForDownload = (obj) => {
        if (obj.sites) {
            const siteDicts = obj.sites;
            let dictValues = [];
            Object.keys(siteDicts).forEach(key => {
                dictValues.push(siteDicts[key]);
            });
            const mergedData = [].concat(...dictValues);
            setDownloadData(mergedData);
        }
    }

    useEffect(() => {
        if (panelAnalyte) {
            setLoading(true);

            let promises = [];
            for (let i = 0; i < allSites.length; i++) {
                promises.push(getData(allSites[i], panelAnalyte));
            }
            Promise.all(promises)
                .then((results) => {
                    const obj = {
                        analyte: panelAnalyte,
                        sites: {}
                    };
                    const unitArray = [];
                    for (let i = 0; i < results.length; i++) {
                        const station = results[i][0].StationCode;
                        const data = results[i];
                        const units = results[i].map(d => d.Unit);
                        unitArray.push(...units);
                        obj.sites[station] = data;
                    }
                    // Get unique units for display in modal header
                    // Can have multiple (equivalent) units in one dataset
                    const unitSet = new Set(unitArray);
                    // Back to an array
                    const uniqueUnits = Array.from(unitSet);
                    const unitString = uniqueUnits.join(', ');
                    unitRef.current = unitString;

                    setChartData(obj);
                    //processDataForDownload(obj);
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                    
                });
        }
    }, [allSites, panelAnalyte]);

    useEffect(() => {
        setLoading(true);
        // Reset analyte when another point is selected on map
        setPanelAnalyte(analyte);
        setAllSites(new Array(station));
    }, [station]);

    return (
        <div>
                {/* ----- Panel Analyte Menu */}
                <div>View data:</div>
                <StationAnalyteMenu 
                    panelAnalyte={panelAnalyte} 
                    setPanelAnalyte={setPanelAnalyte} 
                    station={station.StationCode} 
                />
                {/* ------ Chart */}
                <Segment placeholder  textAlign='center'>
                    { panelAnalyte && !loading ?  // If an analyte is selected and there is no loading status, show the chart
                        <ChartPanel 
                            analyte={panelAnalyte} 
                            data={chartData}
                            unit={unitRef.current}
                        />
                    : panelAnalyte && loading ?  // If an analyte is selected but still loading, show the loader
                        <LoaderBlock />
                    : !panelAnalyte ?  // If an analyte is not selected, show a message
                        <div style={{ fontStyle: 'italic' }}>Select a parameter</div>
                    : null }
                </Segment>
                {/* ----- Compare Sites
                If analyte selection matches analyte selection in map, then show the "Compare sites" content 
                Because the user will be selecting comparison sites in the map and table, the anayte selected in the panel MUST match the anayte selected for the main map/table in order for this content to be used
                There is no easy way to compare objects except to convert the object to string; this will work as long as the order of the attribute fields in both objects are the same
                */}
                { (JSON.stringify(analyte) === JSON.stringify(panelAnalyte)) && (analyte !== null) ? 
                    <CompareSites 
                        comparisonSites={comparisonSites} 
                        selecting={selecting}
                        setSelecting={setSelecting}
                        setComparisonSites={setComparisonSites}
                        station={station} 
                    />
                : null }
        </div>
    )
}