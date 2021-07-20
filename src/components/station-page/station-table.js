import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';


export default function StationTable({ station }) {
    const [data, setData] = useState([])

    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    //const formatDate = timeFormat('%m/%d/%Y');
    const formatDate = timeFormat('%Y/%m/%d');

    const customStyles = {
        headRow: {
            style: {
                color: '#103c68',
                backgroundColor: '#e3e4e6',
                borderBottomWidth: '0px',
            }
        }, 
        headCells: {
            style: {
                fontWeight: 700
            }
        }
    }

    const CustomTrend = ({ row }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row['AllYears_Trend'] === 'Increasing' ? <IconTrendingUp size={18} /> : row['AllYears_Trend'] === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['AllYears_Trend']} /> }
                    &nbsp;&nbsp;
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
            width: '70px',
            sortable: false,
            right: true
        },
        {
            name: 'Mean',
            selector: row => row['AllYears_Mean'],
            width: '70px',
            sortable: false,
            right: true
        },
        {
            name: 'Median',
            selector: row => row['AllYears_Median'],
            width: '70px',
            sortable: false,
            right: true
        },
        {
            name: 'Max',
            selector: row => row['AllYears_Max'],
            width: '70px',
            sortable: false,
            right: true
        }
    ];

    useEffect(() => {
        if (station) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=1000&fields=StationCode,Analyte,LastSampleDate,LastResult,Unit,AllYears_Min,AllYears_Max,AllYears_Median,AllYears_Mean,AllYears_Trend,AllYears_Tau,AllYears_PValue,AllYears_Slope,AllYears_Intercept,AllYears_n';
            url += '&filters={%22StationCode%22:%22' + station + '%22}';
            fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.AllYears_n = +d.AllYears_n;
                    d.AllYears_Min = +d.AllYears_Min;
                    d.AllYears_Mean = +d.AllYears_Mean;
                    d.AllYears_Median = +d.AllYears_Median;
                    d.AllYears_Max = +d.AllYears_Max;
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
                dense
            />
        </div>
    )
}