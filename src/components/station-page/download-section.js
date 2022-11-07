import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';

import { chemDataFields, habitatDataFields, toxicityDataFields } from '../../constants/constants-data';

export default function DownloadSection({ data, loading }) {
    const [downloadData, setDownloadData] = useState(null);

    const fieldsRef = useRef(null);

    useEffect(() => {
        if (data) {
            console.log(data);
            // Reset state
            fieldsRef.current = null;
            setDownloadData(null);
            // Set fields reference
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
        <div style={{ width: '100%' }}>
        <DownloadData
            basic={true}
            compact={false}
            data={downloadData}
            fields={fieldsRef.current}
            fluid={true} 
            loading={loading}
            size='small'
        >
            Download data
        </DownloadData>
        </div>
    )
}