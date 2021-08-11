import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData, regionDict, regionNumDict } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';

export default function TableIndex2({ selectedAnalyte, data }) {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(null); 

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#e3e4e6',
                borderBottomWidth: '0px',
            }
        }, 
        headCells: {
            style: {
                color: '#103c68',
                fontWeight: 700,
            }
        }
    }

    const CustomTrend = ({ row }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row['Trend'] === 'Increasing' ? <IconTrendingUp size={18} /> : row['Trend'] === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['Trend']} /> }
                    &nbsp;&nbsp;&nbsp;
                    <span>{row['Trend']}</span>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (data) {
            if (loading) {
                setLoading(false);
            }
            if (!selectedAnalyte) {
                setColumns([
                    {
                        name: 'Site ID',
                        selector: row => row['StationCode'],
                        width: '120px',
                        sortable: true
                    },
                    {
                        name: 'Site Name',
                        selector: row => row['StationName'],
                        width: '220px',
                        sortable: true,
                        wrap: true
                    },
                    {
                        name: 'Region',
                        selector: row => row['RegionName'],
                        width: '140px',
                        sortable: true
                    },
                    {
                        name: 'Last Sample',
                        id: 'LastSampleDate',
                        selector: row => row['LastSampleDate'],
                        width: '110px',
                        sortable: true
                    }
                ]);
            } else {
                setColumns([
                    {
                        name: 'Site ID',
                        selector: row => row['StationCode'],
                        width: '120px',
                        sortable: true
                    },
                    {
                        name: 'Site Name',
                        selector: row => row['StationName'],
                        width: '220px',
                        sortable: true,
                        wrap: true
                    },
                    {
                        name: 'Region',
                        selector: row => row['RegionName'],
                        width: '140px',
                        sortable: true
                    },
                    {
                        name: 'Analyte',
                        selector: row => row['Analyte'],
                        width: '120px',
                        sortable: false
                    },
                    {
                        name: 'Trend',
                        selector: row => row['Trend'],
                        width: '140px',
                        sortable: true,
                        format: row => <CustomTrend row={row} />
                    },
                    {
                        name: 'Last Sample',
                        id: 'LastSampleDate',
                        selector: row => row['LastSampleDate'],
                        width: '110px',
                        sortable: true
                    }
                ]);
            }
        }
    }, [data])


    if (!loading) {
        return (
            <div style={{ margin: '20px 0 100px 0' }}>
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
                    //onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                    dense
                />
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}