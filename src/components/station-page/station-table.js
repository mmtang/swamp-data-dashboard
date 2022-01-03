import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';
import { tableWrapper } from './station-table.module.css';

// This component renders the data on the station page. It gets the data from the portal and passes it back to the parent component (to go to DownloadData). I had thought about getting the table data in the parent component and passing it to the table component but decided against it for various reasons. One, I prefer to keep table-related tasks in the table component. Two, could later add table-specific error messages for when the data doesn't load.
export default function StationTable({ station, setTableData, setSelectedAnalytes }) {
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
                    {row['AllYears_R_Trend'] === 'Possibly increasing' ? <IconTrendingUp size={18} /> : row['AllYears_R_Trend'] === 'Possibly decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['AllYears_R_Trend']} /> }
                    &nbsp;&nbsp;&nbsp;
                    <span>{row['AllYears_R_Trend']}</span>
                </div>
            </div>
        )
    }

    const columns = [
        {
            id: 'indicator',
            name: 'Indicator',
            selector: row => row['Analyte'],
            width: '180px',
            wrap: true,
            sortable: true
        },
        {
            id: 'results',
            name: '# Results',
            selector: row => row['AllYears_n'],
            width: '95px',
            sortable: true,
            format: row => row['AllYears_n'].toLocaleString(),
            right: true
        },
        {
            id: 'lastDate',
            name: 'Last Sample Date',
            selector: row => row['LastSampleDate'],
            width: '140px',
            sortable: true,
            right: true
        },
        {
            id: 'lastResult',
            name: 'Last Result',
            selector: row => row['LastResult'] + ' ' + row['Unit'],
            width: '145px',
            sortable: false,
            format: row => row['LastResult'].toLocaleString() + ' ' + row['Unit'],
            right: true
        },
        {
            id: 'trend',
            name: 'Trend',
            selector: row => row['AllYears_R_Trend'],
            width: '165px',
            sortable: true,
            format: row => <CustomTrend row={row} />
        },
        {
            id: 'min',
            name: 'Min',
            selector: row => row['AllYears_Min'],
            width: '84px',
            sortable: false,
            format: row => row['AllYears_Min'].toLocaleString(),
            right: true
        },
        {
            id: 'mean',
            name: 'Mean',
            selector: row => row['AllYears_Mean'],
            width: '84px',
            sortable: false,
            format: row => row['AllYears_Mean'].toLocaleString(),
            right: true
        },
        {
            id: 'median',
            name: 'Median',
            selector: row => row['AllYears_Median'],
            width: '84px',
            sortable: false,
            format: row => row['AllYears_Median'].toLocaleString(),
            right: true
        },
        {
            id: 'max',
            name: 'Max',
            selector: row => row['AllYears_Max'],
            width: '84px',
            sortable: false,
            format: row => row['AllYears_Max'].toLocaleString(),
            right: true
        }
    ];

    const handleSelectionUpdate = (rows) => {
        const newSelection = rows.selectedRows.map(d => d.Analyte);
        setSelectedAnalytes(newSelection);
    };

    useEffect(() => {
        if (station) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=1000&fields=StationCode,Analyte,LastSampleDate,LastResult,Unit,AllYears_Min,AllYears_Max,AllYears_Median,AllYears_Mean,AllYears_R_Trend,AllYears_n';
            url += '&filters={%22StationCode%22:%22' + station + '%22}';
            fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.AllYears_n = +d.AllYears_n;
                    d.AllYears_Min = +d.AllYears_Min.toFixed(2);
                    d.AllYears_Mean = +d.AllYears_Mean.toFixed(2);
                    d.AllYears_Median = +d.AllYears_Median.toFixed(2);
                    d.AllYears_Max = +d.AllYears_Max.toFixed(2);
                    d.Unit = (d.Analyte === 'pH' ? '' : d.Analyte === 'CSCI' ? 'score' : d.Unit);
                    d.LastSampleDate = formatDate(parseDate(d.LastSampleDate));
                });
                setData(records);
                setTableData(records);
            });
        }
    }, [station])
    
    return (
        <div className={tableWrapper}>
            <DataTable 
                columns={columns} 
                data={data} 
                customStyles={customStyles}
                highlightOnHover
                selectableRows
                selectableRowsHighlight
                defaultSortFieldId={'lastDate'}
                defaultSortAsc={false}
                onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                dense
            />
        </div>
    )
}