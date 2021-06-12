import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DataTable from './data-table';
import ChemistrySubRowAsync from './chemistry-sub-row-async';
import { IconCirclePlus, IconCircleMinus, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';
import { trendWrapper } from './data-table.module.css';


export default function ChemistryTable(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.station) {
            const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=1000&fields=StationCode,Analyte,LastSampleDate,LastResult,Unit,AllYears_Min,AllYears_Max,AllYears_Median,AllYears_Mean,AllYears_Trend,AllYears_n';
            url += '&filters={%22StationCode%22:%22' + props.station + '%22}';
            fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                console.log(records);
                records.forEach(d => {
                    d.Unit = d.Analyte === 'pH' ? '' : d.Unit;
                    d.LastSampleDate = parseDate(d.LastSampleDate);
                    d.resultWithUnit = d.LastResult.toString() + ' ' + d.Unit;
                    //d.AllYears_Median = Math.round(d.AllYears_Mean * 10) / 10;
                    //d.AllYears_Median = Math.round(d.AllYears_Mean * 10) / 10;
                });
                setData(records);
            });
        }
    }, [props])

    const columns = useMemo(() => {
        const formatDate = timeFormat('%m/%d/%Y');
        return [
            {
                Header: () => null,  // no header for expander column
                id: 'expander',
                Cell: ({ row }) => (
                    // use cell to render an expander for each row
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span {...row.getToggleRowExpandedProps()}>
                            { row.isExpanded ? <IconCircleMinus size={18} color="#5d5d5d" stroke={2} /> : <IconCirclePlus size={18} color="#5d5d5d" stroke={2} /> }
                        </span>
                    </div>
                ),
                // override the cell renderer with a SubCell to be used with an expanded row
                SubCell: () => null  // no expander on an expanded row
            },
            {
                Header: 'Analyte',
                id: 'analyte',
                accessor: 'Analyte',
                sortType: 'string',
            },
            {
                Header: 'Samples',
                id: 'Samples',
                accessor: 'AllYears_n',
                sortType: 'number',
                Cell: props => <div style={{ textAlign: 'right' }}>{props.value}</div>
            },
            {
                Header: 'Last Sample Date',
                id: 'LastSampleDate',
                accessor: 'LastSampleDate',
                sortType: 'datetime',
                Cell: props => <div style={{ textAlign: 'center' }}>{formatDate(props.value)}</div>
            },
            {
                Header: 'Last Result',
                id: 'lastsampleresult',
                accessor: 'resultWithUnit',
                disableSortBy: true
            },
            {
                Header: 'Trend',
                id: 'trend',
                accessor: 'AllYears_Trend',
                Cell: props => <div style={{ textAlign: 'center' }}>{props.value === 'Increasing' ? <IconTrendingDown size={18} /> : props.value === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={props.value} /> }</div>
            },
            {
                Header: 'Min',
                id: 'min',
                accessor: 'AllYears_Min',
                Cell: props => <div style={{ textAlign: 'right' }}>{Math.round(props.value * 100) / 100}</div>,
                disableSortBy: true
            },
            {
                Header: 'Mean',
                id: 'mean',
                accessor: 'AllYears_Mean',
                Cell: props => <div style={{ textAlign: 'right' }}>{Math.round(props.value * 100) / 100}</div>,
                disableSortBy: true
            },
            {
                Header: 'Med',
                id: 'median',
                accessor: 'AllYears_Median',
                Cell: props => <div style={{ textAlign: 'right' }}>{Math.round(props.value * 100) / 100}</div>,
                disableSortBy: true
            },
            {
                Header: 'Max',
                id: 'max',
                accessor: 'AllYears_Max',
                Cell: props => <div style={{ textAlign: 'right' }}>{Math.round(props.value * 100) / 100}</div>,
                disableSortBy: true
            }
        ]
    }, [])

    const initialState = useMemo(() => {
        return {
            sortBy: [
                {
                    id: 'LastSampleDate',
                    desc: true
                }
            ]
        }
    }, [])

    const renderRowSubComponent = useCallback(({ row, rowProps, visibleColumns }) => (
        <ChemistrySubRowAsync row={row} rowProps={rowProps} visibleColumns={visibleColumns} />
    ), []);
    
    return (
        <div style={{ marginBottom: '100px' }}>
            <DataTable 
                columns={columns} 
                data={data} 
                initialState={initialState}
                renderRowSubComponent={renderRowSubComponent} />
        </div>
    )
}