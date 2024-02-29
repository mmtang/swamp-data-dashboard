import React, { useEffect, useState, useRef } from 'react';
import AboutDataLegend from '../learn/about-data-legend';
import AboutDataShort from '../learn/about-data-short';
import Chart from './chart';
import DownloadData from '../common/download-data';
import MatrixTag from '../common/matrix-tag';
import NdMessage from '../common/nd-message';

import { timeParse, extent, selectAll } from 'd3';
import { roundPlaces } from '../../constants/constants-app';
import { chemDataFields, habitatDataFields, tissueDataFields, toxicityDataFields } from '../../constants/constants-data';
import { chemistryResourceId, habitatResourceId, tissueResourceId, toxicityResourceId } from '../../utils/utils';

import { analyteHeader, analyteTitle, sectionContainer } from './chart-section.module.css';

export default function ChartSection({ station, selectedAnalytes }) {
    // State variables
    const [data, setData] = useState(null);
    const [vizAnalytes, setVizAnalytes] = useState([]);
    // Reference variables
    const dateExtentRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

    useEffect(() => {
        // Get data for all selected analytes
        if (station && selectedAnalytes) {
            // Remove old chart tooltips
            selectAll('.station-chart-tooltip').remove();
            if (data) { setData(null) };
            let analyteList = selectedAnalytes;
            // Sort list ascending so that the graphed analytes are displayed in alphabetical order
            if (analyteList.length > 1) {
                analyteList.sort((a, b) => a['Analyte'].localeCompare(b['Analyte']));
            }
            // Render
            setVizAnalytes(analyteList);

            const promises = [];
            for (let i = 0; i < analyteList.length; i++) {
                promises.push(getData(station, analyteList[i].Analyte, analyteList[i].Matrix, analyteList[i].Source, analyteList[i].Species));
            }
            Promise.all(promises)
            .then((results) => {
                // *** Find common xExtent for all graphs
                // Initialize am empty array for storing all date values across analytes.
                // Will be used to calculate a common date extent for all graphs. Assigned to xExtentRef and then passed to graph components.
                let allDates = [];
                for (let i = 0; i < results.length; i++) {
                    const dates = results[i].map(d => d.SampleDate);
                    allDates.push(dates);
                }
                const mergedDates = [].concat(...allDates);  // Merge into a single array
                // Calculate extent
                const dateExtent = extent(mergedDates);
                dateExtentRef.current = dateExtent;

                // *** Organize the returned data into a dictionary organized by analyte name
                let analyteData = {};
                for (let i = 0; i < results.length; i++) {
                    const species = results[i][0].OrganismName || results[i][0].CommonName || null;
                    // Adding d.Species to a string when the value is null will append the text 'null' to the end of the string. This will result in a value like "Ammonia as N, Total samplewater null". Looks ugly, but it will work as long as it matches the key values coming from station-table.js
                    const analyteKey = results[i][0].Analyte + ' ' + results[i][0].MatrixDisplay + ' ' + species;
                    // Get unique units for display in modal header
                    // Can have multiple (equivalent) units in one parameter dataset
                    const units = [...new Set(results[i].map(d => d.Unit))];
                    const unitString = units.join(', ');
                    // Determine if there is a ND or DNQ value in the data
                    const data = results[i];
                    let hasCensoredData = false;
                    if (data[0].Censored) {
                        const values = data.map(d => d['Censored']);
                        if (values.includes(true)) {
                            hasCensoredData = true;
                        }
                    };
                    analyteData[analyteKey] = { 
                        data: data,
                        matrix: results[i][0].MatrixDisplay,
                        unit: unitString,
                        hasCensoredData: hasCensoredData
                    };
                }
                setData(analyteData);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, [station, selectedAnalytes])

    const getData = (station, analyte, matrix, source, species) => {
        return new Promise((resolve, reject) => {
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            // Get data from the chemistry dataset
            if (source === 'chemistry') {
                const params = {
                    resource_id: chemistryResourceId,
                    sql: `SELECT * FROM "${chemistryResourceId}" WHERE "AnalyteDisplay" = '${analyte}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.Analyte = d.AnalyteDisplay;
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(roundPlaces));
                            d['Censored'] = d['Censored'].toLowerCase() === 'true';  // Convert string to boolean
                            if (analyte === 'pH') {
                                d.Unit = '';
                            }
                        });
                        resolve(records);
                    });
            } else if (source === 'habitat') {
                // Get data from the habitat dataset
                const params = {
                    resource_id: habitatResourceId,
                    sql: `SELECT * FROM "${habitatResourceId}" WHERE "AnalyteDisplay" = '${analyte}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.Analyte = d.AnalyteDisplay;
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(roundPlaces));
                            d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                        });
                        resolve(records);
                    });
            } else if (source === 'toxicity') {
                // Get data from the toxicity dataset
                const params = {
                    resource_id: toxicityResourceId,
                    sql: `SELECT * FROM "${toxicityResourceId}" WHERE "Analyte" = '${analyte}' AND "OrganismName" = '${species}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.SampleDate = parseDate(d.SampleDate);
                            d.Species = d.OrganismName;
                            d.ResultDisplay = parseFloat((+d.MeanDisplay).toFixed(roundPlaces));
                            d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                        });
                        resolve(records);
                    });
            } else if (source === 'tissue') {
                // Get data from the tissue dataset
                const params = {
                    resource_id: tissueResourceId,
                    sql: `SELECT * FROM "${tissueResourceId}" WHERE "AnalyteDisplay" = '${analyte}' AND "CommonName" = '${species}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "LastSampleDate" DESC`
                };
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.Analyte = d.AnalyteDisplay;
                            d.SampleDate = parseDate(d.LastSampleDate);
                            d.Species = d.CommonName;
                            d.ResultDisplay = parseFloat((+d.Result).toFixed(roundPlaces));
                            d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean

                        });
                        resolve(records);
                    });
            }
        });
    }

    return (
        <div className={sectionContainer}>
            { vizAnalytes.map(analyteObj => 
                <div key={analyteObj.Key}>
                    <div className={analyteHeader}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            { analyteObj.Matrix ? <MatrixTag matrix={analyteObj.Matrix} height={25} /> : null }
                            <h4 className={analyteTitle}>
                                {analyteObj.Analyte} 
                                {analyteObj.Species ? ` (${analyteObj.Species})` : null}
                                <AboutDataShort analyte={analyteObj} /> 
                            </h4>
                        </div>
                        <DownloadData 
                            basic={true}
                            color='grey'
                            data={data ? data[analyteObj.Key].data : null}
                            fields={ 
                                analyteObj.Source === 'chemistry' ? chemDataFields 
                                : analyteObj.Source === 'habitat' ? habitatDataFields
                                : analyteObj.Source === 'toxicity' ? toxicityDataFields
                                : analyteObj.Source === 'tissue' ? tissueDataFields
                                : chemDataFields
                            }
                        >
                            Download data
                        </DownloadData>
                    </div>
                    <Chart 
                        analyte={analyteObj.Analyte}
                        data={data ? data[analyteObj.Key].data : null}
                        dateExtent={dateExtentRef.current}
                        unit={data ? data[analyteObj.Key].unit : null}
                    />
                    <AboutDataLegend analyte={analyteObj} />
                    { data && data[analyteObj.Key].hasCensoredData ?
                        <div style={{ marginBottom: '0.8em' }}>
                            <NdMessage />
                        </div>
                    : null }
                </div>
            )}
        </div>
    )
}