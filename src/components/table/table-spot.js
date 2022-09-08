import React, { useEffect, useState } from 'react';
import { withPrefix } from 'gatsby';
import LoaderBlock from '../common/loader-block';
import TrendHelpIcon from '../common/trend-help-icon';

import DataTable from 'react-data-table-component';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { Icon } from 'semantic-ui-react';

import { tableWrapper } from './table.module.css';


// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component

export default function TableSpot({ selectedAnalyte, data, selectedSites, setSelectedSites }) {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(null); 

    // Documentation of RDT styles that can be overrided or extended
    // https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts
    const customStyles = {
        headRow: {
            style: {
                minHeight: '38px',
                backgroundColor: '#f0f1f1',
                borderBottomWidth: '0px',
            }
        }, 
        headCells: {
            style: {
                minHeight: '38px',
                color: '#103c68',
            }
        },
        rows: {
            highlightOnHoverStyle: {
                backgroundColor: '#f0f1f1',
            },
        }
    }

    // Define dictionary of data columns to pass to table
    const columnDict = {
        siteCode: {
            name: 'Station Code',
            selector: row => row['StationCode'],
            width: '115px',
            sortable: true,
            wrap: true
        },
        siteName: {
            name: 'Station Name',
            selector: row => row['StationName'],
            width: '220px',
            sortable: true,
            wrap: true
        }, 
        lastSample: {
            name: 'Last Sample Date',
            id: 'LastSampleDate',
            selector: row => row['LastSampleDate'],
            width: '140px',
            sortable: true
        },
        lastResult: {
            name: 'Last Result',
            id: 'LastResult',
            selector: row => row['LastResult'],
            width: '135px',
            sortable: true,
            // Do the number formatting in format, not selector
            // Otherwise the column sorting doesn't work correctly
            format: row => row['LastResult'].toLocaleString()  
        },
        unit: {
            name: 'Unit',
            id: 'Unit',
            selector: row => row['Unit'],
            width: '105px',
            sortable: true
        },
        /*
        trend: {
            name: <TrendHelpIcon />,
            selector: row => row['Trend'],
            width: '165px',
            sortable: true,
            format: row => <CustomTrend row={row} />
        }
        */
    }

    const handleSelectionUpdate = (rows) => {
        const selection = rows.selectedRows.map(d => d.StationCode);
        setSelectedSites(selection);
    };

    useEffect(() => {
        if (data) {
            // Render different table columns based on whether or not a parameter is selected
            const d = columnDict;
            setColumns([d.siteCode, d.siteName, d.lastSample]);
            if (loading) {
                setLoading(false);
            }
        }
    }, [data])



    if (!loading) {
        return (
            <div className={tableWrapper}>
                <DataTable 
                    columns={columns} 
                    data={data} 
                    customStyles={customStyles}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    //selectableRows
                    //selectableRowsHighlight
                    defaultSortFieldId={'LastSampleDate'}
                    defaultSortAsc={false}
                    //onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                    //selectableRowSelected={isSelected}
                    dense
                />
            </div>
        )
    } else {
        return (
            <div className={tableWrapper}>
                <LoaderBlock />
            </div>
        )
    }
}