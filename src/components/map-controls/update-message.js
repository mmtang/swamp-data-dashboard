import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import { message, left, content, header, small, right } from './update-message.module.css';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';

// This component shows the data last updated date on the main dashboard page.
// It calls the open data portal API where the data is hosted and gets the date from the metadata.
export default function UpdateMessage() {   
    const [visible, setVisible] = useState(true);
    const dateRef = useRef('');
    const dateDifferenceRef = useRef('');

    // d3 functions for parsing and formatting dates.
    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%f');
    const formatDate = timeFormat('%Y/%m/%d'); // Change this value to change the formatting of the printed date

    const handleClick = () => {
        setVisible(false);
    }

    const getDate = () => {
        // Fetch metadata of resource and extract the last modified value
        // This URL points to the SWAMP Stations - Summary dataset on the portal. Any of the other SWAMP datasets could be used with the same result.
        // https://data.ca.gov/dataset/surface-water-ambient-monitoring-program/resource/555ee3bf-891f-4ac4-a1fc-c8855cf70e7e
        let url = 'https://data.ca.gov/api/3/action/resource_show?id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e';
        fetchData(url)
        .then(json => json.result)
        .then(result => {
            // Once data has been retrieved, parse and set formatted string date value to the ref variable.
            // This will automatically update the value in the renderer.
            const lastDate = parseDate(result['last_modified']);
            dateRef.current = formatDate(lastDate);
            const differenceDays = calculateDaysBetween(lastDate, new Date());
            dateDifferenceRef.current = differenceDays.toString() + ' days ago';
        })
        .catch(error => {
            console.error(error);
            dateRef.current = 'Error';
            dateDifferenceRef.current = 'Error';
        });
    }

    const calculateDaysBetween = (date1, date2) => {
        // Calculates the number of days between the two provided dates
        // Parameter dates should be in JS date object format
        // The order of the dates does not matter

        // The number of milliseconds in one day
        const ONE_DAY = 1000 * 60 * 60 * 24;
        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1 - date2);
        // Convert back to days and return
        const differenceDays = Math.round(differenceMs / ONE_DAY);
        return differenceDays;
    }

    useEffect(() => {
        getDate();
    }, [])

    if (visible === true) {
        return (
            <div className={message}>
                <div className={left}>
                    <Icon name='history' size='big' />
                </div>
                <div className={content}>
                    <span className={header}>Data Last Updated:</span><br />
                    <span className={small}>{dateRef.current} — {dateDifferenceRef.current}</span>
                </div>
                <div className={right}>
                    <Icon name='close' link onClick={handleClick} />
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}