import React, { memo, useEffect, useRef, useState } from 'react';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';
import { message } from './update-message.module.css';

// This component shows the data last updated date on the main dashboard page.
// It calls the open data portal API where the data is hosted and gets the date from the metadata.
const UpdateMessage = () => {   
    const [status, setStatus] = useState('loading');
    const dateRef = useRef('');

    useEffect(() => {
        // Use isMounted to deal with "Warning: Can't perform a React state update on an unmounted component" warning
        let isMounted = true;
        // d3 functions for parsing and formatting dates.
        // Placed these in the useEffect to avoid missing dependency warning
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%f');
        const formatDate = timeFormat('%Y/%m/%d'); // Change this value to change the formatting of the printed date

        const getDate = () => {
            // Fetch metadata of resource and extract the last modified value
            // This URL points to the SWAMP Stations dataset on the portal. Any of the other SWAMP datasets could be used with the same result.
            // https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/df69fdd7-1475-4e57-9385-bb1514f0291e
            let url = 'https://data.ca.gov/api/3/action/resource_show?id=df69fdd7-1475-4e57-9385-bb1514f0291e';
            fetchData(url)
            .then(json => json.result)
            .then(result => {
                // Once data has been retrieved, parse and set formatted string date value to the ref variable.
                // This will automatically update the value in the renderer.
                const lastDate = parseDate(result['last_modified']);
                dateRef.current = formatDate(lastDate);
                if (isMounted) {
                    setStatus('loaded');
                }
            })
            .catch(error => {
                console.error(error);
                if (isMounted) {
                    setStatus('error');
                }
            });
        }

        getDate();

        return () => {
            // when component unmounts, set isMounted to false
            isMounted = false;
        };
    }, [])

    return (
        <div className={message}>
            <strong>Data Last Updated:</strong>&nbsp;
            { status === 'loading' ? 'Loading': 
                status === 'loaded' ? dateRef.current : 
                status === 'error' ? 'Error getting data' :
                'Error' }
        </div>
    )
}

export default memo(UpdateMessage);