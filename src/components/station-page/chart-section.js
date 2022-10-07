import React, { useEffect, useState, useRef } from 'react';
import { withPrefix } from 'gatsby';
import Chart from './chart';
import DownloadData from '../common/download-data';
import HelpIcon from '../icons/help-icon';
import MatrixTag from '../common/matrix-tag';
import MessageDismissible from '../common/message-dismissible';

import { Icon } from 'semantic-ui-react';
import { timeParse, extent } from 'd3';
import { analytes, chemDataFields, habitatDataFields, toxicityDataFields } from '../../constants/constants-data';

import { sectionContainer, analyteHeader, analyteTitle } from './chart-section.module.css';


export default function ChartSection({ station, selectedAnalytes }) {
    const [data, setData] = useState(null);
    const [overSelectionLimit, setOverSelectionLimit] = useState(false);

    const dateExtentRef = useRef(null);
    const vizAnalytes = useRef([]);
    const limitRef = useRef(5); // Limit number of analytes that can be graphed

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

    const overLimitMessage = `A maximum of ${limitRef.current.toLocaleString()} parameters can be graphed at one time. ${limitRef.current.toLocaleString()} of the ${selectedAnalytes.length} indicators you selected are graphed below.`;

    useEffect(() => {
        // Get data for all selected analytes
        if (station && selectedAnalytes) {
            if (data) { setData(null) };
            let analyteList = selectedAnalytes;
            if (selectedAnalytes.length > limitRef.current) {
                analyteList = selectedAnalytes.slice(0, limitRef.current);
                setOverSelectionLimit(true);
            } else {
                analyteList = selectedAnalytes;
                setOverSelectionLimit(false);
            }
            // Sort list ascending so that the graphed analytes are displayed in alphabetical order
            if (analyteList.length > 1) {
                analyteList.sort((a, b) => a['Analyte'].localeCompare(b['Analyte']));
            }
            vizAnalytes.current = analyteList;
            const promises = [];
            for (let i = 0; i < analyteList.length; i++) {
                promises.push(getData(station, analyteList[i].Analyte, analyteList[i].Matrix, analyteList[i].Source));
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
                    const analyteKey = results[i][0].Analyte + ' ' + results[i][0].MatrixDisplay;
                    // Get unique units for display in modal header
                    // Can have multiple (equivalent) units in one dataset
                    const units = [...new Set(results[i].map(d => d.Unit))];
                    const unitString = units.join(', ');
                    const data = results[i];
                    analyteData[analyteKey] = { 
                        data: data,
                        matrix: results[i][0].MatrixDisplay,
                        unit: unitString
                    };
                }
                setData(analyteData);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, [station, selectedAnalytes])

    const getData = (station, analyte, matrix, source) => {
        return new Promise((resolve, reject) => {
            const chemistryResourceId = '2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e';
            const habitatResourceId = '6d9a828a-d539-457e-922c-3cb54a6d4f9b';
            const toxicityResourceId = 'a6dafb52-3671-46fa-8d42-13ddfa36fd49';
            const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
            // Get data from the chemistry dataset
            if (source === 'chemistry') {
                const params = {
                    resource_id: chemistryResourceId,
                    sql: `SELECT * FROM "${chemistryResourceId}" WHERE "Analyte" = '${analyte}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                console.log(url + new URLSearchParams(params));
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(3));
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
                    sql: `SELECT * FROM "${habitatResourceId}" WHERE "Analyte" = '${analyte}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                console.log(url + new URLSearchParams(params));
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = parseFloat((+d.ResultDisplay).toFixed(3));
                            d.Censored = false;  // Convert string to boolean
                        });
                        resolve(records);
                    });
            } else if (source === 'toxicity') {
                // Get data from the toxicity dataset
                const params = {
                    resource_id: toxicityResourceId,
                    sql: `SELECT * FROM "${toxicityResourceId}" WHERE "Analyte" = '${analyte}' AND "MatrixDisplay" = '${matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                console.log(url + new URLSearchParams(params));
                fetch(url + new URLSearchParams(params))
                    .then(resp => resp.json())
                    .then(json => json.result.records)
                    .then(records => {
                        // Filter for records that meet data quality requirements
                        records.forEach(d => {
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = parseFloat((+d.MeanDisplay).toFixed(3));
                            d.Censored = false;  // Convert string to boolean
                        });
                        resolve(records);
                    });
            }
        });
    }

    return (
        <div className={sectionContainer}>
            {/* Display message if user selects too many sites */}
            { overSelectionLimit ? 
                <MessageDismissible color='red' message={overLimitMessage} />
            : null }
            { vizAnalytes.current.map(analyteObj => 
                <div key={analyteObj.Key}>
                    <div className={analyteHeader}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            { analyteObj.Matrix ? <MatrixTag matrix={analyteObj.Matrix} height={25} /> : null }
                            <h4 className={analyteTitle}>
                                {analyteObj.Analyte}
                                { analyteObj.Analyte === 'pH' ? null : 
                                data ? ` (${data[analyteObj.Key].unit})` :
                                null }
                                { analytes[analyteObj.Analyte] ? 
                                <HelpIcon position='right center' color='grey'>
                                    <div style={{ fontSize: '13px' }}>
                                        { analytes[analyteObj.Analyte]['blurb'] }
                                        &nbsp;
                                        { /* Display the 'Read more' link for those indicators that have an indicator page. Do not display the link if the page does not exist yet */ }
                                        { analytes[analyteObj.Analyte]['page'] ? <a href={withPrefix(`/learn/indicators/${analytes[analyteObj.Analyte]['page']}`)} target='_blank' rel='noreferrer noopener'>Read more&nbsp;&nbsp;<Icon name='external' /></a> : '' }
                                    </div>
                                </HelpIcon>
                                : null
                                }
                            </h4>
                        </div>
                        <DownloadData 
                            data={data ? data[analyteObj.Key].data : null}
                            fields={ 
                                analyteObj.Source === 'chemistry' ? chemDataFields 
                                : analyteObj.Source === 'habitat' ? habitatDataFields
                                : analyteObj.Source === 'toxicity' ? toxicityDataFields
                                : chemDataFields
                            }
                            color='grey'
                        >
                            Download data
                        </DownloadData>
                    </div>
                    <Chart 
                        station={station}
                        analyte={analyteObj.Analyte}
                        data={data ? data[analyteObj.Key].data : null}
                        dateExtent={dateExtentRef.current}
                    />
                </div>
            )}
        </div>
    )
}