import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';

// These imported variables define the column names (and their order) for the CSV downloads
import { chemDataFields, habitatDataFields, toxicityDataFields } from '../../constants/constants-data';

export default function DownloadSection({ data, loading }) {
    const [downloadData, setDownloadData] = useState(null);
    const fieldsRef = useRef(null);

    const wrapper = {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
    }

    useEffect(() => {
        if (data) {
            // Reset state
            fieldsRef.current = null;
            setDownloadData(null);
            // Set fields based on data source
            const dataSource = data.analyte.source;
            if (dataSource === 'chemistry') { 
                fieldsRef.current = chemDataFields;
            } else if (dataSource === 'habitat') {
                fieldsRef.current = habitatDataFields;
            } else if (dataSource === 'toxicity') {
                fieldsRef.current = toxicityDataFields;
            }
            // Compile all site data into a single array
            let dataArr = [];
            Object.keys(data.sites).forEach(key => {
                dataArr = [...dataArr, ...data.sites[key]];
            });
            setDownloadData(dataArr);
        }
    }, [data]);

    return (
        <div style={wrapper}>
            <DownloadData
                basic={true}
                compact={true}
                data={downloadData}
                fields={fieldsRef.current}
                fluid={false} 
                loading={loading}
                size='mini'
            >
                Download data
            </DownloadData>
        </div>
    )
}