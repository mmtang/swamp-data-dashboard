import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';


export default function StationTable({ station, setSelectedAnalytes }) {
    const [data, setData] = useState([])

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%Y/%m/%d');

    // overrides:
    // https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.js
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
                    {row['AllYears_Trend'] === 'Increasing' ? <IconTrendingUp size={18} /> : row['AllYears_Trend'] === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['AllYears_Trend']} /> }
                    &nbsp;&nbsp;&nbsp;
                    <span>{row['AllYears_Trend']}</span>
                </div>
            </div>
        )
    }

    const columns = [
        {
            name: 'Parameter',
            selector: row => row['Analyte'],
            width: '180px',
            wrap: true,
            sortable: true
        },
        {
            name: 'Samples',
            selector: row => row['AllYears_n'],
            width: '95px',
            sortable: true,
            format: row => row['AllYears_n'],
            right: true
        },
        {
            name: 'Last Sample Date',
            selector: row => formatDate(row['LastSampleDate']),
            width: '140px',
            sortable: true,
            right: true
        },
        {
            name: 'Last Result',
            selector: row => row['LastResult'] + ' ' + row['Unit'],
            width: '130px',
            sortable: false,
            right: true
        },
        {
            name: 'Trend',
            selector: row => row['AllYears_Trend'],
            width: '125px',
            sortable: true,
            format: row => <CustomTrend row={row} />
        },
        {
            name: 'Min',
            selector: row => row['AllYears_Min'],
            width: '75px',
            sortable: false,
            right: true
        },
        {
            name: 'Mean',
            selector: row => row['AllYears_Mean'],
            width: '75px',
            sortable: false,
            right: true
        },
        {
            name: 'Median',
            selector: row => row['AllYears_Median'],
            width: '75px',
            sortable: false,
            right: true
        },
        {
            name: 'Max',
            selector: row => row['AllYears_Max'],
            width: '75px',
            sortable: false,
            right: true
        }
    ];

    const handleSelectionUpdate = (rows) => {
        const newSelection = rows.selectedRows.map(d => d.Analyte);
        setSelectedAnalytes(newSelection);
    };

    useEffect(() => {
        if (station) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=1000&fields=StationCode,Analyte,LastSampleDate,LastResult,Unit,AllYears_Min,AllYears_Max,AllYears_Median,AllYears_Mean,AllYears_Trend,AllYears_Tau,AllYears_PValue,AllYears_Slope,AllYears_Intercept,AllYears_n';
            url += '&filters={%22StationCode%22:%22' + station + '%22}';
            fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.AllYears_n = +d.AllYears_n;
                    d.AllYears_Min = +d.AllYears_Min.toFixed(3);
                    d.AllYears_Mean = +d.AllYears_Mean.toFixed(3);
                    d.AllYears_Median = +d.AllYears_Median.toFixed(3);
                    d.AllYears_Max = +d.AllYears_Max.toFixed(3);
                    d.Unit = d.Analyte === 'pH' ? '' : d.Unit;
                    d.LastSampleDate = parseDate(d.LastSampleDate);
                    d.ResultWithUnit = d.LastResult.toString() + ' ' + d.Unit;
                });
                setData(records);
            });
        }
    }, [station])
    
    return (
        <div style={{ marginTop: '1.4em', marginBottom: '100px' }}>
            <DataTable 
                columns={columns} 
                data={data} 
                customStyles={customStyles}
                highlightOnHover
                pagination
                selectableRows
                selectableRowsHighlight
                onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                dense
            />
        </div>
    )
}