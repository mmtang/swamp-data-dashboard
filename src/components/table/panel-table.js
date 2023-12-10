import React, { useEffect, useState } from 'react';
import { Cell, Column, CustomHeaderCell, Table,  } from 'rsuite-table';
// Import styles
import 'rsuite-table/dist/css/rsuite-table.css';
import { container } from './panel-table.module.css';

// This component renders the table on the station page using data passed from index, the parent component
export default function PanelTable({ data }) {
    const [tableData, setTableData] = useState(null);

    const CustomHeaderCell = props => <CustomHeaderCell {...props} style={{ backgroundColor: '#ececed' }} />;

    useEffect(() => {
        if (data && data.sites) {
            // Get site keys/codes
            const stationKeys = Object.keys(data.sites);
            let allSitesData = [];
            for (const i of stationKeys) {
                allSitesData = allSitesData.concat(data.sites[i]);
            }
            setTableData(allSitesData);
        }
    }, [data]);

    return (
        <div className={container}>
            { tableData ? 
                <Table 
                    data={tableData}
                    autoHeight={true}
                    bordered={true}
                    cellBordered={true}
                    //loading={loading}
                    //fillHeight={true}
                    headerHeight={38}
                    rowHeight={38}
                    //onRowClick={handleClick}
                    //onSortColumn={handleSortColumn}
                    //sortColumn={sortColumn}
                    affixHorizontalScrollbar={true}
                >
                    <Column sortable width={125}>
                        {/*<CustomHeaderCell>Species</CustomHeaderCell>*/}
                        <CustomHeaderCell>Species</CustomHeaderCell>
                        <Cell dataKey='Species' />
                    </Column>
                    <Column sortable width={70} align='right'>
                        <CustomHeaderCell>Year</CustomHeaderCell>
                        <Cell dataKey='SampleYear' />
                    </Column>
                    <Column sortable width={65} align='right'>
                        <CustomHeaderCell>Result</CustomHeaderCell>
                        <Cell dataKey='ResultDisplay' />
                    </Column>
                    <Column sortable width={70} align='right'>
                        <CustomHeaderCell>Unit</CustomHeaderCell>
                        <Cell dataKey='Unit' />
                    </Column>
                    <Column sortable width={120} align='right'>
                        <CustomHeaderCell>Sample Type</CustomHeaderCell>
                        <Cell dataKey='CompositeIndividual' />
                    </Column>
                </Table> 
            : null }
        </div>
    )
}