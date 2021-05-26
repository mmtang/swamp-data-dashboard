import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DataTable from './data-table';
import ChemistrySubRowAsync from './chemistry-sub-row-async';
import { timeParse } from 'd3-time-format';



export default function ChemistryTable(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.station) {
            getData()
            .then((records) => {
                const parseDate = timeParse('%Y-%m-%d')
                records.forEach(d => {
                    d.resultWithUnit = d.Result.toString() + ' ' + d.Unit
                });
                setData(records);
            });
        }
    }, [props])

    const columns = useMemo(() => {
        return [
            {
                Header: () => null,  // no header for expander column
                id: 'expander',
                Cell: ({ row }) => (
                    // use cell to render an expander for each row
                    <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? 'v' : '>'}
                    </span>
                ),
                // override the cell renderer with a SubCell to be used with an expanded row
                SubCell: () => null  // no expander on an expanded row
            },
            {
                Header: 'Analyte',
                accessor: 'Analyte',
                sortType: 'string'
            },
            {
                Header: 'Last Sample Date',
                accessor: 'SampleDate',
                sortType: 'string'
            },
            {
                Header: 'Last Sample Result',
                accessor: 'resultWithUnit',
                disableSortBy: true
            }
        ]
    }, [])

    
    const getData = () => {
        return new Promise((resolve, reject) => {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=100';
            url += '&filters={%22StationCode%22:%22' + props.station + '%22}';
            fetch(url)
            .then((res) => res.json())
            .then((json) => {
                const records = json.result.records;
                resolve(records);
            })
        })
    }

    const renderRowSubComponent = useCallback(({ row, rowProps, visibleColumns }) => (
        <ChemistrySubRowAsync row={row} rowProps={rowProps} visibleColumns={visibleColumns} />
    ), []);
    
    return (
        <div style={{ marginBottom: '100px' }}>
            <DataTable 
                columns={columns} 
                data={data} 
                renderRowSubComponent={renderRowSubComponent} />
        </div>
    )
}