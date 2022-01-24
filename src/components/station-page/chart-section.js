import React, { useEffect, useState, useRef } from 'react';
import { withPrefix } from 'gatsby';
import Chart from './chart';
import DownloadData from '../common/download-data';
import HelpIcon from '../icons/help-icon';
import { Icon } from 'semantic-ui-react';
import { timeParse, extent } from 'd3';
import { analytes, chemDataFields, habitatDataFields, habitatAnalytes, dataQualityCategories } from '../../constants/constants-data';
import { sectionContainer, analyteHeader, analyteTitle } from './chart-section.module.css';


export default function ChartSection({ station, selectedAnalytes }) {
    const [data, setData] = useState(null);
    const dateExtentRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

    useEffect(() => {
        // Get data for all selected analytes
        if (station && selectedAnalytes) {
            if (data) { setData(null) };
            // Limit number of analytes graphed to 4
            let vizAnalytes;
            if (selectedAnalytes.length > 4) {
                vizAnalytes = selectedAnalytes.slice(0, 4);
            } else {
                vizAnalytes = selectedAnalytes;
            }
            const promises = [];
            for (let i = 0; i < vizAnalytes.length; i++) {
                promises.push(getData(vizAnalytes[i], station));
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
                    const analyte = results[i][0].Analyte;
                    // Get unique units for display in modal header
                    // Can have multiple (equivalent) units in one dataset
                    const units = [...new Set(results[i].map(d => d.Unit))];
                    const unitString = units.join(', ');
                    const data = results[i];
                    analyteData[analyte] = { 
                        data: data,
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

    const getData = (analyte, station) => {
        return new Promise((resolve, reject) => {
            let url;
            // Get Habitat data
            if (habitatAnalytes.includes(analyte)) {
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=9ce012e2-5fd3-4372-a4dd-63294b0ce0f6&limit=500&filters={%22StationCode%22:%22' + encodeURIComponent(station) + '%22%2C%22Analyte%22:%22' + encodeURIComponent(analyte) + '%22}&sort=%22SampleDate%22%20desc';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    // Filter for records that meet data quality requirements
                    const data = records.filter(d => dataQualityCategories.includes(d['DataQuality']))
                    data.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultDisplay = +parseFloat(d.Result).toFixed(3);
                        d.Censored = false;
                        if (analyte === 'CSCI') {
                            d.Unit = 'score';
                        }
                    });
                    resolve(data);
                });
            } else {
                // Get chemistry data
                url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=8d5331c8-e209-4ec0-bf1e-2c09881278d4&limit=500&filters={%22StationCode%22:%22' + encodeURIComponent(station) + '%22%2C%22Analyte%22:%22' + encodeURIComponent(analyte) + '%22}&sort=%22SampleDate%22%20desc';
                fetch(url)
                .then(resp => resp.json())
                .then(json => json.result.records)
                .then(records => {
                    // Filter for records that meet data quality requirements
                    const data = records.filter(d => dataQualityCategories.includes(d['DataQuality']))
                    data.forEach(d => {
                        d.SampleDate = parseDate(d.SampleDate);
                        d.ResultDisplay = +d.ResultDisplay.toFixed(3);
                        d['Censored'] = d['Censored'].toLowerCase() === 'true';  // Convert string to boolean
                        if (analyte === 'pH') {
                            d.Unit = '';
                        }
                    });
                    resolve(data);
                });
            }
        });
    }

    return (
        <div className={sectionContainer}>
            { selectedAnalytes.map(analyteName => 
                <div key={analytes[analyteName].code}>
                    <div className={analyteHeader}>
                        <h4 className={analyteTitle}>
                            {analyteName}
                            { analyteName === 'pH' ? null : 
                              data ? ` (${data[analyteName].unit})` :
                              null }
                            <HelpIcon position='right center' color='grey'>
                                <div style={{ fontSize: '13px' }}>
                                    { analytes[analyteName]['blurb'] }
                                    &nbsp;
                                    { /* Display the 'Read more' link for those indicators that have an indicator page. Do not display the link if the page does not exist yet */ }
                                    { analytes[analyteName]['page'] ? <a href={withPrefix(`/learn/indicators/${analytes[analyteName]['page']}`)} target='_blank' rel='noreferrer noopener'>Read more&nbsp;&nbsp;<Icon name='external' /></a> : '' }
                                </div>
                            </HelpIcon>
                        </h4>
                        <DownloadData 
                            data={data ? data[analyteName].data : null}
                            fields={habitatAnalytes.includes(analyteName) ? habitatDataFields : chemDataFields}
                            color='grey'
                        >
                            Download data
                        </DownloadData>
                    </div>
                    <Chart 
                        station={station}
                        analyte={analyteName}
                        data={data ? data[analyteName].data : null}
                        dateExtent={dateExtentRef.current}
                    />
                </div>
            )}
        </div>
    )
}