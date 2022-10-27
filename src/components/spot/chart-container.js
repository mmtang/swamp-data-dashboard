import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';
import MatrixTag from '../common/matrix-tag';
import SpotStationChart from './spot-station-chart';

import { extent, timeParse } from 'd3';

import { chemistryResourceId, habitatResourceId, toxicityResourceId } from '../../utils/utils';
import { chemDataFields, dataQualityCategories, habitatDataFields } from '../../constants/constants-data';
import { analyteHeader, analyteTitle, sectionContainer } from './chart-container.module.css';

export default function ChartContainer({ station, analyte }) {
    const [data, setData] = useState(null);
    const dateExtentRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

    console.log(analyte);

    const getData = (analyte) => {
        return new Promise((resolve, reject) => {
            if (analyte) {
                // Get the data source for data query
                let resource;
                if (analyte.source === 'chemistry') {
                    resource = chemistryResourceId;
                } else if (analyte.source === 'habitat') {
                    resource = habitatResourceId;
                } else if (analyte.source === 'toxicity') {
                    resource = toxicityResourceId;
                }
                // Build query string and get data
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                const params = {
                    resource_id: resource,
                    sql: `SELECT * FROM "${resource}" WHERE "Analyte" = '${analyte.label}' AND "MatrixDisplay" = '${analyte.matrix}' AND "StationCode" = '${station}' AND "DataQuality" NOT IN ('MetaData', 'Reject record') ORDER BY "SampleDate" DESC`
                }
                fetch(url + new URLSearchParams(params))
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        // Process the returned data based on the data source/type
                        let data = records;
                        if (analyte.source === 'chemistry' || analyte.source === 'habitat') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat((+d.ResultDisplay)).toFixed(3);
                                d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                                if (d.Unit === 'none') {
                                    d.Unit = '';  // for pH records
                                }
                            });
                        }
                        if (analyte.source === 'toxicity') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat((+d.MeanDisplay).toFixed(3));  // Use the ResultDisplay name for consistency when reusing chart component
                                d.Censored = false;  // Convert string to boolean                            
                            });
                        }
                        resolve(data);
                    });
            }
        });
    }

    useEffect(() => {
        if (station) {
            getData(analyte)
                .then((data) => {
                    // Calculate date extent (range) for data
                    dateExtentRef.current = extent(data.map(d => d['SampleDate']));
                    // Change state for data
                    setData(data);
                })
        }
    }, [station])

    return (
        <div className={sectionContainer}>
                <div key={analyte.name}>
                    <div className={analyteHeader}>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                            <MatrixTag matrix={analyte.matrix} height='25' />
                            <span className={analyteTitle}>
                                {analyte.label}&nbsp;&nbsp;
                            </span>
                        </div>
                        <DownloadData 
                            data={data}
                            fields={analyte.type === 'wq' ? chemDataFields : habitatDataFields}
                            color='grey'
                        >
                            Data
                        </DownloadData>
                    </div>
                <SpotStationChart analyte={analyte} data={data} extent={dateExtentRef.current} station={station} />
                </div>
        </div>
    )
}