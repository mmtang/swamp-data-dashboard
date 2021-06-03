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
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=100';
            url += '&filters={%22StationCode%22:%22' + props.station + '%22}';
            fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.LastSampleDate = parseDate(d.LastSampleDate);
                    d.resultWithUnit = d.LastResult.toString() + ' ' + d.Unit
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
                Header: 'Last Sample Date',
                id: 'LastSampleDate',
                accessor: 'LastSampleDate',
                sortType: 'datetime',
                Cell: props => <span>{formatDate(props.value)}</span>
            },
            {
                Header: 'Last Sample Result',
                id: 'lastsampleresult',
                accessor: 'resultWithUnit',
                disableSortBy: true
            },
            {
                Header: 'Trend',
                id: 'trend',
                accessor: 'AllYears_Trend',
                Cell: props => <span>{props.value === 'Increasing' ? <TrendingUp /> : props.value === 'Decreasing' ? <TrendingDown /> : <Minus trend={props.value} /> }</span>
            }
        ]
    }, [])

    function TrendingUp() {
        return (
            <span className={trendWrapper}><IconTrendingUp size={18} />&nbsp;&nbsp;&nbsp;Increasing</span>
        )
    }

    function TrendingDown() {
        return (
            <span className={trendWrapper}><IconTrendingDown size={18} />&nbsp;&nbsp;&nbsp;Decreasing</span>
        )
    }

    function Minus({ trend }) {
        return (
            <span className={trendWrapper}><IconMinus size={18} />&nbsp;&nbsp;&nbsp;{trend}</span>
        )
    }

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