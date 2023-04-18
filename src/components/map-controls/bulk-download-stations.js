import React, { useEffect, useState } from 'react';
import DownloadData from '../common/download-data';

import { Button, Icon } from 'semantic-ui-react';
import { downloadButton } from './bulk-download.module.css';

// This component generates the button in the main download section for downloading station data
// It will display one of three buttons based on the state.
// Reuse the data from the initial stations query on index.js with minor processing
export default function BulkDownloadStations({ stationData }) {
    const [dataError, setDataError] = useState(false);
    const [downloadData, setDownloadData] = useState(null);
    const [fetchingData, setFetchingData] = useState(false);

    const fields = [
        'StationCode',
        'StationName',
        'TargetLatitude',
        'TargetLongitude',
        'Region',
        'RegionName'
    ]

    const handleDownload = () => {
        setFetchingData(true);
        if (stationData.length > 0) {
            setFetchingData(false);
            setDownloadData(stationData);
        } else {
            console.log('Error: station data array is empty');
            setDataError(true);
        }
    }

    const handleErrorClick = () => {
        // Reset all
        setDownloadData(null);
        setFetchingData(false);
        setDataError(false);
    }

    useEffect(() => {
        setDownloadData(null);
        setFetchingData(false);
        setDataError(false);
    }, [stationData]);

    return (
        <div>
            { downloadData ?
                <DownloadData 
                    basic={true}
                    color='blue'
                    compact={true}
                    data={downloadData} 
                    disabled={ stationData ? false : true }
                    fields={fields}
                    size='tiny'
                >
                    Download stations
                </DownloadData>
            : dataError ?
                <Button 
                    basic
                    className={downloadButton}
                    color='red'
                    compact 
                    disabled={ stationData ? false : true }
                    onClick={handleErrorClick}
                    onKeyPress={handleErrorClick}
                    size='tiny'
                >
                    <Icon name='exclamation' />
                    Unexpected error - Try again
                </Button>
            :
                <Button 
                    basic
                    className={downloadButton}
                    color='grey'
                    compact 
                    disabled={ stationData ? false : true }
                    loading={fetchingData}
                    onClick={handleDownload}
                    onKeyPress={handleDownload}
                    size='tiny'
                >
                    Get stations
                </Button>
            }
        </div>
    )
}