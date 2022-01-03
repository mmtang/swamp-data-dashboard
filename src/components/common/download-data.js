import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { rowButton } from './download-data.module.css';

// This component renders a button. When the button is clicked, the array of JavaScript objects passed to the component is converted to a TSV file and downloaded in the browser.
// I chose tabs over commas because there are a lot of commas in the station names, and I did not want to add quotes around the string values (which is the common way of dealing with this issue).
export default function DownloadData({ children, data, fields }) {   
    const columnDelimiter = '\t';
	
    // This function converts an array of JavaScript objects to a tab delimited string.
    const convertArrayOfObjectsToTSV = (array) => {
        if (array.length > 0) {
            // Initialize empty string variable
            // Convert data records to strings and append them
            let dataString = '';
            const tsvFields = fields ? fields : Object.keys(array[0]);
            const header = tsvFields.join(columnDelimiter);
            const rows = data.map(obj => {
                return tsvFields.map(fieldName => { 
                        return obj[fieldName]; 
                    })
                    .join(columnDelimiter);
            });
            const body = rows.join('\r\n');
            dataString += header + '\r\n' + body;
            return dataString;
        }
    }

    const downloadTSV = (array) => {
        const link = document.createElement('a');
        let tsv = convertArrayOfObjectsToTSV(array);
        if (tsv == null) return;
        const filename = 'SWAMP_Data_Dashboard_' + Date.now() + '.tsv';

        // Two lines below are the old way. Doesn't work anymore. Cuts the file off at around 100 lines.
        // tsv = `data:text/tsv;charset=utf-8,${tsv}`;
        // link.setAttribute('href', encodeURI(tsv)); 

        // Two lines below are the new way. Required to export ALL rows in the file.
        // https://stackoverflow.com/questions/24610694/export-html-table-to-csv-in-google-chrome-browser/24611096#24611096
        var tsvData = new Blob([tsv], { type: 'text/tsv' }); 
        link.setAttribute('href', URL.createObjectURL(tsvData));

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    }

    const handleClick = () => {
        if (data.length > 0) {
            downloadTSV(data);
        } else {
            console.error('Empty data array');
        }
    }

    return (
        <Button 
            className={rowButton}
            compact 
            size='tiny'
            onClick={handleClick} 
            onKeyPress={handleClick}
        >
            <Icon name='download' />
            {children}
        </Button>
    )
}