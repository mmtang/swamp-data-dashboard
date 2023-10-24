import React, { useState } from 'react';
import BulkDownloadResults from './bulk-download-results';
import BulkDownloadStations from './bulk-download-stations';
import MatrixTag from '../common/matrix-tag';

import { programDict, regionDict } from '../../utils/utils';
import { Button, Icon, Modal, Table } from 'semantic-ui-react';
import { buttonRow, downloadTable } from './bulk-download.module.css';

// This component generates the table in the Download section and calls the two components for downloading site data and results data. The table automatically updates to show the user's current filter selection. 
export default function BulkDownload({ analyte, program, region, stationData }) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleClick = () => {
        if (modalVisible === false) {
            setModalVisible(true);
        }
    }

    return (
        <div>
            <div onClick={handleClick}>
                <Icon fitted inverted 
                        size='large'
                        name='download'
                    />
                <span>Data</span>
            </div>
            { modalVisible ? 
                <Modal
                    /* closeIcon */
                    closeOnDimmerClick={true}
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                    size='tiny'
                >
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <div>
                                <p>Download data (.csv) for all SWAMP stations based on the current selection listed below. Includes stations outside the current map extent.</p>
                                <Table 
                                    celled
                                    className={downloadTable} 
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
                                            <Table.Cell>Analyte:</Table.Cell>
                                            <Table.Cell>
                                                { analyte ? <MatrixTag matrix={analyte.matrix} /> : null }
                                                <i>{ analyte ? `${analyte.label}` : 'All' }</i>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                                <div className={buttonRow}>
                                    <BulkDownloadResults analyte={analyte} program={program} region={region} />
                                    <BulkDownloadStations stationData={stationData} />
                                </div>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color='grey'
                            onClick={() => setModalVisible(false)}
                            size='small'
                        >
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal> 
            : '' }
        </div>
    );
}