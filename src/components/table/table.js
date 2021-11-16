import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { Icon } from 'semantic-ui-react';
import { tableWrapper } from './table.module.css';


// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component

export default function Table({ selectedAnalyte, data, setSelectedSites }) {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(null); 

    console.log(data);

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
            name: 'Site Code',
            selector: row => row['StationCode'],
            width: '105px',
            sortable: true,
            wrap: true
        },
        siteName: {
            name: 'Site Name',
            selector: row => row['StationName'],
            width: '220px',
            sortable: true,
            wrap: true
        }, 
        region: {
            name: 'Region',
            selector: row => row['RegionName'],
            width: '130px',
            sortable: true
        },
        lastSample: {
            name: 'Last Sample',
            id: 'LastSampleDate',
            selector: row => row['LastSampleDate'],
            width: '115px',
            sortable: true
        },
        sitePage: {
            name: 'Site Page',
            selector: row => 'Link',
            width: '100px',
            sortable: false,
            format: row => <CustomLink row={row} />
        },
        analyte: {
            name: 'Analyte',
            selector: row => row['Analyte'],
            width: '120px',
            sortable: false
        },
        trend: {
            name: 'Trend',
            selector: row => row['Trend'],
            width: '140px',
            sortable: true,
            format: row => <CustomTrend row={row} />
        }
    }

    const CustomTrend = ({ row }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    { row['Trend'] === 'Increasing' ? <IconTrendingUp size={18} /> : row['Trend'] === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['Trend']} /> }
                    &nbsp;&nbsp;&nbsp;
                    <span>{row['Trend']}</span>
                </div>
            </div>
        )
    }

    const CustomLink = ({ row }) => {
        return (
            <div>
                <Icon name='linkify' />&nbsp;<a href={"/explore_data/station/?q=" + row['StationCode']} target="_blank" rel="noopener noreferrer">Link</a>
            </div>
        )
    }

    const handleSelectionUpdate = (rows) => {
        const selection = rows.selectedRows.map(d => d.StationCode);
        setSelectedSites(selection);
    };

    useEffect(() => {
        if (data) {
            if (loading) {
                setLoading(false);
            }
            // Render different table columns based on whether or not a parameter is selected
            const d = columnDict;
            if (!selectedAnalyte) {
                setColumns([d.siteCode, d.siteName, d.region, d.lastSample, d.sitePage]);
            } else {
                setColumns([d.siteCode, d.siteName, d.region, d.analyte, d.trend, d.lastSample, d.sitePage]);
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
                    selectableRows
                    selectableRowsHighlight
                    defaultSortFieldId={'LastSampleDate'}
                    defaultSortAsc={false}
                    onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                    dense
                />
            </div>
        )
    } else {
        return (
            <div className={tableWrapper}>
                Loading...
            </div>
        )
    }
}