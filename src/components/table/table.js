import React, { useEffect, useState } from 'react';
import LoaderBlock from '../common/loader-block';

import DataTable from 'react-data-table-component';

import { tableContainer } from './table.module.css';


// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component

export default function Table({ setStation, stationData }) {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(null); 

    // Documentation of RDT styles that can be overrided or extended
    // https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f0f1f1',
                borderBottomWidth: '0px',
                minHeight: '38px'
            }
        }, 
        headCells: {
            style: {
                color: '#103c68',
                minHeight: '38px'
            }
        },
        rows: {
            highlightOnHoverStyle: {
                backgroundColor: '#f0f1f1',
                cursor: 'pointer'
            }
        }
    }

    // Define dictionary of data columns to pass to table
    const columnDict = {
        region: {
            name: 'Region',
            selector: row => row['RegionName'],
            width: '130px',
            sortable: true
        },
        siteCode: {
            name: 'Station Code',
            selector: row => row['StationCode'],
            width: '114px',
            sortable: true,
            wrap: true
        },
        siteName: {
            name: 'Station Name',
            selector: row => row['StationName'],
            width: '235px',
            sortable: true,
            wrap: true
        }, 
        lastSample: {
            name: 'Last Sample',
            id: 'LastSampleDate',
            selector: row => row['LastSampleDate'],
            width: '95px',
            sortable: true
        },
        lastResult: {
            name: 'Result',
            id: 'LastResult',
            selector: row => row['ResultDisplay'],
            width: '85px',
            sortable: true,
            // Do the number formatting in format, not selector
            // Otherwise the column sorting doesn't work correctly
            format: row => row['ResultDisplay'].toLocaleString(),
            right: true
        },
        unit: {
            name: 'Unit',
            id: 'Unit',
            selector: row => row['Unit'],
            width: '100px',
            sortable: true
        }
    }

    /*
    const handleSelectionUpdate = (rows) => {
        const selection = rows.selectedRows.map(d => d.StationCode);
        setSelectedSites(selection);
    };
    */

    /*
    const CustomLink = ({ row }) => {
        return (
            <div>
                <a href={withPrefix("/stations?id=" + encodeURIComponent(row['StationCode']))} target="_blank" rel="noopener noreferrer">Link</a>&nbsp;&nbsp;&nbsp;<Icon name='external' />
            </div>
        )
    }
    */

    // This event handler fires when a table row is clicked; it changes the selected station
    const handleClick = (row) => {
        if (row) {
            setStation(row);
        }
    }

    useEffect(() => {
        if (stationData) {
            // Render different table columns based on whether or not an analyte is selected
            const d = columnDict;
            if (stationData[0].ResultDisplay) {
                setColumns([d.region, d.siteCode, d.siteName, d.lastSample, d.lastResult, d.unit]);
            } else {
                setColumns([d.region, d.siteCode, d.siteName, d.lastSample]);
            }
            // Turn off loader
            if (loading) {
                setLoading(false);
            }
        }
    }, [stationData])



    if (!loading) {
        return (
            <div className={tableContainer}>
                <DataTable 
                    columns={columns} 
                    customStyles={customStyles}
                    data={stationData} 
                    highlightOnHover
                    pagination
                    //selectableRows
                    //selectableRowsHighlight
                    defaultSortFieldId={'LastSampleDate'}
                    defaultSortAsc={false}
                    dense
                    //onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                    //selectableRowSelected={isSelected}
                    fixedHeader={true}
                    fixedHeaderScrollHeight='calc(100vh - 60px - 50px - 38px)'  // does not accept percentages (inside or outside a calc function), subtract main navbar (60px), sub navbar (50px), and table header (38px)
                    onRowClicked={handleClick}
                />
            </div>
        )
    } else {
        return (
            <div className={tableContainer}>
                <LoaderBlock />
            </div>
        )
    }
}