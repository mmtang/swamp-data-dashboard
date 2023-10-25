import React from 'react';
import BulkDownloadResults from './bulk-download-results';
import BulkDownloadStations from './bulk-download-stations';
import MatrixTag from '../common/matrix-tag';

import { programDict, regionDict } from '../../utils/utils';
import { Button, Icon, Modal, Table } from 'semantic-ui-react';
import { buttonRow, downloadTable } from './bulk-download.module.css';

// This component generates the table in the Download section and calls the two components for downloading site data and results data. The table automatically updates to show the user's current filter selection. 
export default function BulkDownload({ 
    analyte, 
    dataModalVisible,
    program, 
    region, 
    setDataModalVisible,
    species,
    stationData 
}) {
    const handleClick = () => {
        if (dataModalVisible === false) {
            setDataModalVisible(true);
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
            { dataModalVisible ? 
                <Modal
                    /* closeIcon */
                    closeOnDimmerClick={true}
                    open={dataModalVisible}
                    onClose={() => setDataModalVisible(false)}
                    size='tiny'
                >
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <div>
                                <p>Download data (.csv) for all SWAMP stations based on the selection listed below. To change the current selection, close out of this window and select new filter values. The data file includes stations outside the current map extent.</p>
                                <Table 
                                    celled
                                    className={downloadTable} 
                                    color='blue' 
                                    compact
                                >
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Analyte:</Table.Cell>
                                            <Table.Cell>
                                                { analyte ? <MatrixTag matrix={analyte.matrix} /> : null }
                                                <i>{ analyte ? `${analyte.label}` : 'All' }</i>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Species:</Table.Cell>
                                            <Table.Cell><i>{ species && species.value ? species.value : 'All' }</i></Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Program:</Table.Cell>
                                            <Table.Cell><i>{ program ? programDict[program] : 'All' }</i></Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Region:</Table.Cell>
                                            <Table.Cell><i>{ region ? regionDict[region] : 'All' }</i></Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                                <div className={buttonRow}>
                                    <BulkDownloadResults 
                                        analyte={analyte} 
                                        program={program} 
                                        region={region} 
                                        species={species} 
                                    />
                                    <BulkDownloadStations stationData={stationData} />
                                </div>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color='grey'
                            onClick={() => setDataModalVisible(false)}
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