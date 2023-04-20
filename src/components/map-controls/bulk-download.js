import React from 'react';
import BulkDownloadResults from './bulk-download-results';
import BulkDownloadStations from './bulk-download-stations';
import MatrixTag from '../common/matrix-tag';

import { programDict, regionDict } from '../../utils/utils';
import { Table } from 'semantic-ui-react';
import { buttonRow, downloadTable } from './bulk-download.module.css';

// This component generates the table in the Download section and calls the two components for downloading site data and results data. The table automatically updates to show the user's current filter selection. 
export default function BulkDownload({ analyte, program, region, stationData }) {
    return (
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
                        <Table.Cell>Parameter:</Table.Cell>
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
    );
}