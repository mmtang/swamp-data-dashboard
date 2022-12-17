import React, { useEffect, useState } from 'react';

import { Button, Icon } from 'semantic-ui-react';
import { timeFormat } from 'd3';
import { rowButton } from './download-data.module.css';

// This component renders a button. When the button is clicked, the array of JavaScript objects passed to the component is converted to a CSV file and downloaded in the browser.
export default function DownloadData({ 
    children, 
    basic=false, 
    color=null, 
    compact=true,
    data, 
    fields, 
    fluid=false, 
    loading,
    size='mini' 
}) {   	
    const [dataLoaded, setDataLoaded] = useState(false);

    const formatDate = timeFormat('%Y-%m-%d %H:%M:%S'); // Date formatting for open data portal

    // This function converts an array of JavaScript objects to a tab delimited string.
    const convertArrayOfObjectsToCSV = (array, fields, columnDelimiter = ',') => {
        if (array.length > 0) {
            // Initialize empty string variable
            // Convert data records to strings and append them
            let dataString = '';
            const csvFields = fields ? fields : Object.keys(array[0]);
            const header = csvFields.join(columnDelimiter);
            const rows = array.map(obj => {
                return csvFields.map(fieldName => { 
                        if (fieldName === 'SampleDate') {
                            // Formatting of the date in file has to be done here, trying to do so elsewhere changes the date value of the data points in the chart, which breaks the tooltip. Not sure why. 
                            if (obj[fieldName]) {
                                return formatDate(obj[fieldName]); 
                            } else {
                                return null;
                            }
                        } else {
                            // If text string contains a comma, wrap double quotes around text string
                            if (obj[fieldName]) {
                                if (obj[fieldName].toString().includes(',')) {
                                    return `"${obj[fieldName]}"`;
                                } else {
                                    return obj[fieldName]; 
                                }
                            } else {
                                return null;
                            }
                        }
                    })
                    .join(columnDelimiter);
            });
            const body = rows.join('\r\n');
            dataString += header + '\r\n' + body;
            return dataString;
        }
    }

    const downloadCSV = (array) => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array, fields);
        if (csv == null) return;
        const filename = 'SWAMP_Data_Dashboard_' + Date.now() + '.csv';

        // Two lines below are the old way. Doesn't work anymore. Cuts the file off at around 100 lines.
        // tsv = `data:text/tsv;charset=ut-8,${tsv}`;
        // link.setAttribute('href', encodeURI(tsv)); 

        // Two lines below are the new way. Required to export ALL rows in the file.
        // https://stackoverflow.com/questions/24610694/export-html-table-to-csv-in-google-chrome-browser/24611096#24611096
        var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); 
        link.setAttribute('href', URL.createObjectURL(csvData));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    }

    const handleClick = () => {
        if (data.length > 0) {
            downloadCSV(data);
        } else {
            console.error('Empty data array');
        }
    }

    useEffect(() => {
        setDataLoaded(false);
        if (data) { 
            setTimeout(() => {
                setDataLoaded(true) 
            }, 500)
        };
    }, [data])

    useEffect(() => {
        if (loading) {
            setDataLoaded(false);
        }
    }, [loading]);

    return (
        <Button 
            basic={basic}
            className={rowButton}
            color={color}
            compact={compact}
            fluid={fluid}
            size={size}
            onClick={handleClick} 
            onKeyPress={handleClick}
            disabled={!dataLoaded}
        >
            <Icon name='download' />
            {children}
        </Button>
    )
}