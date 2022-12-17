import React, { useEffect, useRef, useState } from 'react';
import ChartPanel from '../chart/chart-panel';
import CompareSites from '../compare-sites/compare-sites';
import DownloadSection from '../station-page/download-section';
import LoaderBlock from '../loaders/loader-block';
import AnalyteMenu from '../station-page/analyte-menu';
import { Segment } from 'semantic-ui-react';

import { 
    capitalizeFirstLetter, 
    chemistryResourceId, 
    habitatResourceId, 
    parseDate, 
    toxicityResourceId 
} from '../../utils/utils';

import { colorPaletteViz } from '../../constants/constants-app';

export default function PanelStationInfo({ 
    analyte, 
    comparisonSites, 
    program,
    selecting, 
    setComparisonSites, 
    setSelecting, 
    station 
}) {  
    const [allSites, setAllSites] = useState([]);  // list of station objects, no data
    const [allSitesData, setAllSitesData] = useState({}); // dictionary for site data
    const [chartData, setChartData] = useState(null); // list of objects that combine allSitesData into the correct format for charting

     // Make a copy of the colorPaletteViz array. Used to keep track of what colors are being used and not being used in the current render. We don't want color to be tied to array position; or else the color of a site will change everytime a site before it is removed from the comparisonSites selection. Will use a fresh copy everytime the selected station changes.
     const [vizColors, setVizColors] = useState(colorPaletteViz);  

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
                // Build query string
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                let sql = `SELECT * FROM "${resource}" WHERE "AnalyteDisplay" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                if (program) {
                    sql += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
                }
                sql += ' ORDER BY "SampleDate" DESC'
                const params = {
                    resource_id: resource,
                    sql: sql
                }
                // Get data
                fetch(url + new URLSearchParams(params))
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        // Process the returned data based on the data source/type
                        let data = records;
                        if (dataAnalyte.source === 'chemistry' || dataAnalyte.source === 'habitat') {
                            data.forEach(d => {
                                d.Analyte = d.AnalyteDisplay;
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
    /*
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
    */

    useEffect(() => {
        setLoading(true);
        setSelecting(false);
        setVizColors(colorPaletteViz);
        setAllSitesData({}); // Have to reset this; otherwise, data for the original analyte will continue to show
        setComparisonSites([]);
        unitRef.current = null;
    }, [panelAnalyte]);

    useEffect(() => {
        setLoading(true);
        setAllSites([station, ...comparisonSites]);
    }, [comparisonSites]);

    // Compiles a dictionary of data for each selected site; intermediary step before setting as chart data
    useEffect(() => {
        // This function checks for if the data for this station needs to be fetched from the API or if it already exists in the site data dictionary. If the API is needed, it calls getData to fetch the data (and returns it). Otherwise, it takes the existing data and returns it. In both cases, it returns the array of the data for the station.
        const checkForData = (dict, station) => {
            return new Promise((resolve, reject) => {
                if (!(dict[station.StationCode])) {
                    // If the site's data does not already exist in the state dictionary, fetch the data and add a new dictionary entry for the site
                    getData(station, panelAnalyte)
                        .then(results => {
                            resolve(results);
                        });
                } else {
                    // If the site's data already exists in the state dictionary, grab it and assign the array 
                    resolve(dict[station.StationCode]);
                }
            });
        };

        if (allSites.length > 0) {
            let checks = [];
            for (let i = 0; i < allSites.length; i++) {
                const station = allSites[i];
                checks.push(checkForData(allSitesData, station));
            };
            // Use Promise.all to deal with sync/async issues
            Promise.all(checks)
            .then(res => {
                let dataDict = {}; // Dictionary to store data (key = StationCode)
                let allUnitValues = []; // Dictionary to store all unit values, will be used to find unique values
                // Assign arrays to dictionary using station name as key
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    const stationCode = res[i][0]['StationCode'];
                    dataDict[stationCode] = res[i];
                    // Append unit values to array
                    const units = res[i].map(d => d.Unit);
                    allUnitValues = [...allUnitValues, ...units];
                }

                // Get unique units, convert unit array to set. Can have multiple units for the same analyte
                const unitSet = new Set(allUnitValues);
                // Back to an array
                const uniqueUnits = Array.from(unitSet);
                const unitString = uniqueUnits.join(', ');
                unitRef.current = unitString;

                setAllSitesData(dataDict);
            });
        }
    }, [allSites]);

    useEffect(() => {
        if (Object.keys(allSitesData).length > 0) {
            const chartDict = {
                analyte: panelAnalyte,
                sites: allSitesData
            };
            setChartData(chartDict);
            setLoading(false);
        }
    }, [allSitesData]);

    // Runs initially when user selects a station
    useEffect(() => {
        // Reset state
        setAllSites([]);
        setAllSitesData({}); 
        setVizColors(colorPaletteViz);
        unitRef.current = null;

        if (station) {
            setLoading(true);
            // Reset analyte when another point is selected on map
            setPanelAnalyte(analyte);
            setAllSites([station]);
        }
    }, [station]);

    return (
        <div>
            {/* ----- Panel Analyte Menu */}
            <div>View data:</div>
            <AnalyteMenu 
                panelAnalyte={panelAnalyte} 
                program={program}
                setPanelAnalyte={setPanelAnalyte} 
                station={station} 
            />
            {/* ----- Download data */}
            { panelAnalyte ? 
                <DownloadSection data={chartData} loading={loading} />
            : null }
            {/* ------ Chart */}
            <Segment placeholder textAlign='center'>
                { panelAnalyte && !loading ?  // If an analyte is selected and there is no loading status, show the chart
                    <ChartPanel 
                        analyte={panelAnalyte} 
                        data={chartData}
                        unit={unitRef.current}
                        vizColors={vizColors}
                    />
                : panelAnalyte && loading ?  // If an analyte is selected but still loading, show the loader
                    <LoaderBlock />
                : !panelAnalyte ?  // If an analyte is not selected, show a message
                    <div style={{ fontStyle: 'italic' }}>Select a parameter</div>
                : null }
            </Segment>
            { console.log(analyte) }
            { console.log(panelAnalyte) }
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
                    setVizColors={setVizColors}
                    station={station} 
                    vizColors={vizColors}
                />
            : null }
        </div>
    )
}