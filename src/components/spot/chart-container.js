import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';
import SpotStationChart from './spot-station-chart';

import { extent, timeParse } from 'd3';

import { chemDataFields, dataQualityCategories, habitatDataFields } from '../../constants/constants-data';
import { analyteHeader, analyteTitle, sectionContainer } from './chart-container.module.css';

export default function ChartContainer({ station, analyte }) {
    const [data, setData] = useState(null);
    const dateExtentRef = useRef(null);

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

    const getWqData = (analyte) => {
        return new Promise((resolve, reject) => {
            if (analyte) {
                const url = `https://data.ca.gov/api/3/action/datastore_search?resource_id=2bfd92aa-7256-4fd9-bfe4-a6eff7a8019e&limit=500&filters={%22Analyte%22:%22${encodeURIComponent(analyte)}%22%2C%22StationCode%22:%22${station}%22}`;
                fetch(url)
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        // Filter for records that meet data quality requirements
                        const data = records.filter(d => dataQualityCategories.includes(d['DataQuality']))
                        data.forEach(d => {
                            d.SampleDate = parseDate(d.SampleDate);
                            d.ResultDisplay = +parseFloat(d.ResultDisplay).toFixed(3);
                            d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                            if (d.Unit === 'none') {
                                d.Unit = '';
                            }
                            resolve(data);
                        });
                    });
            }
        });
    }

    useEffect(() => {
        if (station) {
            getWqData(analyte.name)
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
                        <h4 className={analyteTitle}>
                            {analyte.name}
                        </h4>
                        <DownloadData 
                            data={data}
                            fields={analyte.type === 'wq' ? chemDataFields : habitatDataFields}
                            color='grey'
                        >
                            Download
                        </DownloadData>
                    </div>
                <SpotStationChart analyte={analyte} data={data} extent={dateExtentRef.current} station={station} />
                </div>
        </div>
    )
}