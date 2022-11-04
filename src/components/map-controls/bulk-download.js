import React, { useEffect, useRef, useState } from 'react';
import DownloadData from '../common/download-data';
import MatrixTag from '../common/matrix-tag';

import { chemDataFields, habitatDataFields, toxicityDataFields } from '../../constants/constants-data';

import { 
    capitalizeFirstLetter,
    chemistryResourceId,
    habitatResourceId, 
    parseDate,
    programDict, 
    regionDict, 
    toxicityResourceId 
} from '../../utils/utils';

import { Button, Header, Icon, Modal, Table } from 'semantic-ui-react';

export default function BulkDownload({ analyte, program, region }) {
    const [dataError, setDataError] = useState(false);
    const [downloadData, setDownloadData] = useState(null);
    const [fetchingData, setFetchingData] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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
                let sql = `SELECT * FROM "${resource}" WHERE "Analyte" = '${analyte.label}' AND "MatrixDisplay" = '${analyte.matrix}' AND "DataQuality" NOT IN ('MetaData', 'Reject record')`;
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
        setDownloadData(null);
        setFetchingData(false);
        setDataError(false);
    }, [modalVisible]);

    return (
        <div>
            {/* Download button */}
            <Button 
                compact 
                onClick={() => setModalVisible(true)}
                onKeyPress={() => setModalVisible(true)}
                size='tiny'
            >
                Download data
            </Button>

            {/* Modal popup */}
            <Modal
              closeOnDimmerClick={false}
              open={modalVisible}
              onClose={() => setModalVisible(false)}
              size='tiny'
            >
                <Header as='h4' content='Download data' />
                <Modal.Content>
                    <p>Download data (.csv) for all SWAMP stations based on the current selection:</p>
                    <Table 
                        celled 
                        color='blue' 
                        compact
                    >
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Program:</Table.Cell>
                                <Table.Cell><i>{ program ? programDict[program] : 'All' }</i></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Region:</Table.Cell>
                                <Table.Cell><i>{ region ? regionDict[region] : 'All' }</i></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Parameter:</Table.Cell>
                                <Table.Cell>
                                    <MatrixTag matrix={analyte.matrix} />
                                    <i>{ `${analyte.label}` }</i>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    { !downloadData && !dataError  ? 
                        <Button 
                            basic
                            color='grey'
                            compact 
                            loading={fetchingData}
                            onClick={handleDownload}
                            onKeyPress={handleDownload}
                            size='tiny'
                        >
                            Get data
                        </Button>
                        : null
                    }
                    { downloadData && !dataError ?
                        <DownloadData 
                            basic={true}
                            color='blue'
                            data={downloadData} 
                            fields={fieldsRef.current}
                            size='tiny'
                        >
                            Download
                        </DownloadData>
                        : null
                    }
                    { dataError ? 
                        <Button 
                            basic
                            color='red'
                            compact 
                            onClick={handleErrorClick}
                            onKeyPress={handleErrorClick}
                            size='tiny'
                        >
                            <Icon name='exclamation' />
                            Unexpected error - Try again
                        </Button>
                        : null
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button
                            compact
                            onClick={() => setModalVisible(false)}
                            onKeyPress={() => setModalVisible(false)}
                            size='tiny'
                        >
                        Close
                    </Button>
                </Modal.Actions>
          </Modal> 

        </div>
        
    );
}