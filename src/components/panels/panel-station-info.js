import React, { useEffect, useRef, useState } from 'react';
import AnalyteMenu from '../station-page/analyte-menu';
import ChartPanel from '../chart/chart-panel';
import CompareSites from '../compare-sites/compare-sites';
import DownloadSection from '../station-page/download-section';
import LoaderBlock from '../loaders/loader-block';
import PanelTable from '../table/panel-table';
import { Menu, Segment } from 'semantic-ui-react';
import * as d3 from 'd3';

import { 
    capitalizeFirstLetter, 
    chemistryResourceId, 
    habitatResourceId, 
    parseDate, 
    tissueResourceId, 
    toxicityResourceId 
} from '../../utils/utils';

import { colorPaletteViz, roundPlaces } from '../../constants/constants-app';
import { chartContainer, menuContainer } from './panel-station-info.module.css';

const shapePaletteViz = [d3.symbolCircle, d3.symbolTriangle, d3.symbolSquare, d3.symbolDiamond, d3.symbolWye];

// This component generates the main content (below the site info) for when a station is selected. The dashboard loads different content based on whether or not an analyte/parameter was selected beforehand (or not)
export default function PanelStationInfo({ 
    analyte, 
    comparisonSites, 
    program,
    selecting, 
    setComparisonSites, 
    setSelecting, 
    species,
    station 
}) {  
    const unitRef = useRef(null);
    const [activeMenuItem, setActiveMenuItem] = useState('graph');
    const [allSites, setAllSites] = useState([]);  // list of station objects, no data
    const [allSitesData, setAllSitesData] = useState({}); // dictionary for site data, data is stored here to prevent requerying the same data over and over again
    const [chartData, setChartData] = useState(null); // list of objects that combine allSitesData into the correct format for charting
    const [loading, setLoading] = useState(true);
    const [panelAnalyte, setPanelAnalyte] = useState(analyte);
    const [panelSpecies, setPanelSpecies] = useState(species);
    // Make a copy of the colorPaletteViz array. Used to keep track of what colors are being used and not being used in the current render. We don't want color to be tied to array position; or else the color of a site will change every time a site is removed from the comparisonSites selection. Will use a fresh copy everytime the selected station changes
    const [vizColors, setVizColors] = useState(colorPaletteViz);  
    const [siteShapeDict, setSiteShapeDict] = useState({});

    // To show the CompareSites component, the selected analyte in the station panel must match the selected analyte in the filters. Also, an analyte must be selected. If a species is selected or not selected, the panel species must match the selected species. 
    console.log(species, panelSpecies);
    const showCompareSites = 
        (panelAnalyte && panelAnalyte.value != null) && 
        (analyte && analyte.value === panelAnalyte.value) && 
        (species ? JSON.stringify(species) === JSON.stringify(panelSpecies) : true) && 
        (species === null ? JSON.stringify(species) === JSON.stringify(panelSpecies) : true);

    // This function converts a JavaScript datetime object to the beginning of the year (01/01/YYYY).
    // This is used to ensure that tissue data points get plotted at the year tick and not in between ticks
    const dateToYear = (datetime) => {
        if (datetime) {
            let newDate = datetime;
            newDate.setMonth(0); // Set month to January
            newDate.setDate(1); // Set day to the 1st
            return newDate;
        } else {
            return datetime;
        }
    }

    const displayNone = {
        display: 'none'
    };

    const getData = (station, dataAnalyte) => {
        return new Promise((resolve, reject) => {
            if (dataAnalyte) {
                // Get the data source for data query
                let resource;
                let sql;
                if (dataAnalyte.source === 'chemistry') {
                    resource = chemistryResourceId;
                    sql = `SELECT * FROM "${resource}" WHERE "AnalyteDisplay" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                } else if (dataAnalyte.source === 'habitat') {
                    resource = habitatResourceId;
                    sql = `SELECT * FROM "${resource}" WHERE "AnalyteDisplay" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                } else if (dataAnalyte.source === 'toxicity') {
                    resource = toxicityResourceId;
                    sql = `SELECT * FROM "${resource}" WHERE "Analyte" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                } else if (dataAnalyte.source === 'tissue') {
                    resource = tissueResourceId;
                    sql = `SELECT * FROM "${resource}" WHERE "Analyte" = '${dataAnalyte.label}' AND "MatrixDisplay" = '${dataAnalyte.matrix}' AND "StationCode" = '${station.StationCode}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                }
                // Build query string
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                if (program) {
                    sql += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
                }
                if ((dataAnalyte.source === 'toxicity' || dataAnalyte.source ==='tissue') && panelSpecies) {
                    if (panelSpecies.source === 'toxicity') {
                        sql += ` AND "OrganismName" = '${panelSpecies.label}'`;
                    } else if (panelSpecies.source === 'tissue') {
                        sql += ` AND "CommonName" = '${panelSpecies.label}'`;
                    }
                }
                if (dataAnalyte.source === 'tissue') {
                    sql += ' ORDER BY "LastSampleDate" DESC'
                } else {
                    sql += ' ORDER BY "SampleDate" DESC'
                }
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
                                d.ResultDisplay = parseFloat(((+d.ResultDisplay)).toFixed(roundPlaces));
                                d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                                if (d.Unit === 'none') {
                                    d.Unit = '';  // for pH records
                                }
                            });
                        } else if (dataAnalyte.source === 'toxicity') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat(((+d.MeanDisplay).toFixed(roundPlaces)));  // Use the ResultDisplay name for consistency when reusing chart component
                                d.Species = d.OrganismName;
                                d.Censored = false;  // Convert string to boolean                            
                            });
                        } else if (dataAnalyte.source === 'tissue') {
                            data.forEach(d => {
                                d.SampleDate = dateToYear(parseDate(d.LastSampleDate));
                                d.ResultDisplay = parseFloat(((+d.Result).toFixed(roundPlaces)));  // Use the ResultDisplay name for consistency when reusing chart component
                                d.Species = d.CommonName;
                                d.Censored = false;  // Convert string to boolean   
                            });
                        }
                        resolve(data);
                    });
            }
        });
    }

    const handleMenuClick = (e, { name }) => {
        if (name) {
            setActiveMenuItem(name);
        }
    };

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
        setSelecting(false);
        setVizColors(colorPaletteViz);
        setAllSites([station]);
        setAllSitesData({});
        setComparisonSites([]);
        unitRef.current = null;
    }, [panelSpecies]);

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
                for (let i = 0; i < res.length; i++) {
                    const stationCode = res[i][0]['StationCode'];
                    dataDict[stationCode] = res[i];
                    // Append unit values to array
                    const units = res[i].map(d => d.Unit);
                    allUnitValues = [...allUnitValues, ...units];
                }
                // Get unique units, convert unit array to set. Can have multiple units for the same analyte
                const unitSet = new Set(allUnitValues);
                // Convert set back to an array
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
            setPanelSpecies(species);
            setAllSites([station]);
        }
    }, [station]);

    return (
        <div>
            {/* ----- Panel Analyte Menu */}
            <div>View data:</div>
            <AnalyteMenu 
                panelAnalyte={panelAnalyte} 
                panelSpecies={panelSpecies}
                setActiveMenuItem={setActiveMenuItem}
                setPanelAnalyte={setPanelAnalyte} 
                setPanelSpecies={setPanelSpecies}
                station={station} 
            />
            <div className={menuContainer}>
                <Menu size='tiny' tabular>
                    <Menu.Item
                        name='graph'
                        active={activeMenuItem === 'graph'}
                        onClick={handleMenuClick}
                    />
                    <Menu.Item
                        name='table'
                        active={activeMenuItem === 'table'}
                        onClick={handleMenuClick}
                    />
                </Menu>
            </div>
            {/* ------ Chart */}
            <div className={menuContainer} style={ activeMenuItem !== 'graph' ? displayNone : null }>
                {/* ----- Compare Sites
                If analyte selection matches analyte selection in map, then show the "Compare sites" content 
                Because the user will be selecting comparison sites in the map and table, the anayte selected in the panel MUST match the anayte selected for the main map/table in order for this content to be used
                There is no easy way to compare objects except to convert the object to string; this will work as long as the order of the attribute fields in both objects are the same
                */}
                { showCompareSites ? 
                    <CompareSites 
                        analyte={analyte}
                        comparisonSites={comparisonSites} 
                        selecting={selecting}
                        setSelecting={setSelecting}
                        setComparisonSites={setComparisonSites}
                        setVizColors={setVizColors}
                        siteShapeDict={siteShapeDict}
                        station={station} 
                        vizColors={colorPaletteViz}
                    />
                : null }
                <Segment className={chartContainer} placeholder textAlign='center'>
                    {/* ----- Download data */}
                    { panelAnalyte ? 
                        <DownloadSection data={chartData} loading={loading} />
                    : null }
                    { panelAnalyte && !loading ?  // If an analyte is selected and there is no loading status, show the chart
                        // ----- Chart
                        <ChartPanel 
                            analyte={panelAnalyte} 
                            data={chartData}
                            setSiteShapeDict={setSiteShapeDict}
                            species={panelSpecies}
                            unit={unitRef.current}
                            vizColors={colorPaletteViz}
                        />
                    : panelAnalyte && loading ?  // If an analyte is selected but still loading, show the loader
                        <LoaderBlock />
                    : !panelAnalyte ?  // If an analyte is not selected, show a message
                        <div style={{ fontStyle: 'italic' }}>Select an analyte</div>
                    : null }
                </Segment>
            </div>
            {/* ------ Table */}
            <div className={menuContainer} style={ activeMenuItem !== 'table' ? displayNone : null }>
                { panelAnalyte && !loading ?  // If an analyte is selected and there is no loading status, show the table
                    <PanelTable analyte={panelAnalyte} data={chartData} />
                : panelAnalyte && loading ?  // If an analyte is selected but still loading, show the loader
                    <LoaderBlock />
                : !panelAnalyte ?  // If an analyte is not selected, show a message
                    <Segment className={chartContainer} placeholder textAlign='center'>
                        <div style={{ fontStyle: 'italic' }}>Select an analyte</div>
                    </Segment>
                : null }
            </div>
        </div>
    )
}