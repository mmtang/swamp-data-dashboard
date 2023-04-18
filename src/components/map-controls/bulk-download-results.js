import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';

import { popupStyle } from '../../constants/constants-app';
import { chemDataFields, habitatDataFields, toxicityDataFields } from '../../constants/constants-data';

import { 
    capitalizeFirstLetter,
    chemistryResourceId,
    habitatResourceId, 
    parseDate,
    toxicityResourceId 
} from '../../utils/utils';

import { Button, Icon, Popup } from 'semantic-ui-react';
import { downloadButton } from './bulk-download.module.css';

// This component generates the button in the main download section for downloading results data
// It will display one of three buttons based on state: fetch data, download data, error.
// The buttons can only be clicked if a parameter has been selected by the user
// The data must be fetched/queried before it can be downloaded
export default function BulkDownloadResults({ analyte, program, region }) {
    const [active, setActive] = useState(false); // State for controlling if button is active or disabled 
    const [dataError, setDataError] = useState(false);
    const [downloadData, setDownloadData] = useState(null);
    const [fetchingData, setFetchingData] = useState(false);

    const fieldsRef = useRef(null);

    const getData = (analyte, program, region) => {
        return new Promise((resolve, reject) => {
            if (analyte) {
                // Get the data source for data query
                let resource;
                if (analyte.source === 'chemistry') {
                    resource = chemistryResourceId;
                    fieldsRef.current = chemDataFields;
                } else if (analyte.source === 'habitat') {
                    resource = habitatResourceId;
                    fieldsRef.current = habitatDataFields;
                } else if (analyte.source === 'toxicity') {
                    resource = toxicityResourceId;
                    fieldsRef.current = toxicityDataFields;
                }
                // Build query string
                const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
                let sql = `SELECT * FROM "${resource}" WHERE "AnalyteDisplay" = '${analyte.label}' AND "MatrixDisplay" = '${analyte.matrix}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
                if (program) {
                    sql += ` AND "${capitalizeFirstLetter(program)}" = 'True'`;
                }
                if (region) {
                    // Region value on open data portal is string; convert value before appending to query string
                    let regionVal = region;
                    if (typeof regionVal === 'number') {
                        regionVal = region.toString();
                    }
                    sql += ` AND "Region" = '${regionVal}'`;
                }
                const params = {
                    resource_id: resource,
                    sql: sql
                }
                // Get data
                fetch(url + new URLSearchParams(params))
                    .then((resp) => resp.json())
                    .then((json) => json.result.records)
                    .then((records) => {
                        // Process the returned data based on the data source/type
                        let data = records;
                        if (analyte.source === 'chemistry' || analyte.source === 'habitat') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat(((+d.ResultDisplay)).toFixed(3));
                                d.Censored = d.Censored.toLowerCase() === 'true';  // Convert string to boolean
                            });
                        }
                        if (analyte.source === 'toxicity') {
                            data.forEach(d => {
                                d.SampleDate = parseDate(d.SampleDate);
                                d.ResultDisplay = parseFloat(((+d.MeanDisplay).toFixed(3)));  // Use the ResultDisplay name for consistency when reusing chart component
                                d.Censored = false;  // Convert string to boolean                            
                            });
                        }
                        resolve(data);
                    });
            }
        });
    }

    const handleDownload = () => {
        setFetchingData(true);
        getData(analyte, program, region)
        .then((data) => {
            if (data.length > 0) {
                setFetchingData(false);
                setDownloadData(data);
            } else {
                setDataError(true);
            }
        })
        .catch((error) => {
            console.log('Error:', error);
            setDataError(true);
        });
    }

    const handleErrorClick = () => {
        // Reset all
        setDownloadData(null);
        setFetchingData(false);
        setDataError(false);
    }

    useEffect(() => {
        // Set button active/disabled based on if a parameter has been selected
        if (analyte) {
            setActive(true);
        } else {
            setActive(false);
        }
        setDownloadData(null);
        setFetchingData(false);
        setDataError(false);
    }, [analyte, program, region]);

    return (
        <div>
            { downloadData ?
                <DownloadData 
                    basic={true}
                    color='blue'
                    compact={true}
                    data={downloadData} 
                    disabled={!active}
                    fields={fieldsRef.current}
                    size='tiny'
                >
                    Download results
                </DownloadData>
            : dataError ?
                <Button 
                    basic
                    className={downloadButton}
                    color='red'
                    compact 
                    disabled={!active}
                    onClick={handleErrorClick}
                    onKeyPress={handleErrorClick}
                    size='tiny'
                >
                    <Icon name='exclamation' />
                    Unexpected error - Try again
                </Button>
            :
                <Popup
                    content={'Select a parameter'}
                    disabled={analyte ? true : false}
                    inverted
                    size='tiny'
                    style={popupStyle}
                    trigger={
                        /* Wrap the button in a span for the popup to show on the button */
                        <span>
                            <Button 
                                active={active}
                                basic
                                className={downloadButton}
                                color='grey'
                                compact 
                                disabled={!active}
                                loading={fetchingData}
                                onClick={handleDownload}
                                onKeyPress={handleDownload}
                                size='tiny'
                            >
                                Get results
                            </Button>
                        </span>
                    }
                />
            }
        </div>
    )
}