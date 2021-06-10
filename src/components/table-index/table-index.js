import React, { useEffect, useState, useMemo } from 'react';
import DataTableIndex from './data-table-index';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData, regionDict } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';

export default function TableIndex({ selectedAnalyte, selectedRegion }) {
    const [data, setData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=StationName,StationCode,TargetLatitude,TargetLongitude,Region&limit=5000';
        fetchData(url)
            .then(json => json.result.records)
            .then(records => {
                records.forEach(d => {
                    d.RegionName = regionDict[d.Region];
                });
                setData(records);
                setTableData(records);
                setLoading(false);
            });
    }, [])

    useEffect(() => {
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
        if (data) {
            if (selectedAnalyte) {
                setLoading(true);
                let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=5000';
                url += '&filters={%22Analyte%22:%22' + selectedAnalyte + '%22}';
                fetchData(url)
                    .then(json => json.result.records)
                    .then(records => {
                        records.forEach(d => {
                            d.LastSampleDate = parseDate(d.LastSampleDate);
                            d.ResultWithUnit = d.LastResult + ' ' + d.Unit;
                        });
                        console.log(records);
                        setTableData(records);
                        setLoading(false);
                    })
            }
            if (selectedRegion) {
                const newData = data.filter(d => d.RegionName === selectedRegion);
            }
        }
    }, [selectedRegion, selectedAnalyte])

    const columns = useMemo(() => {
        return [
            {
                Header: 'Region',
                id: 'Region',
                accessor: 'RegionName',
                sortType: 'string',
            },
            {
                Header: 'Site Code',
                id: 'StationCode',
                accessor: 'StationCode',
                sortType: 'string'
            },
            {
                Header: 'Site Name',
                id: 'StationName',
                accessor: 'StationName',
                sortType: 'string'
            }
        ]
    }, [])

    const columnsSummary = useMemo(() => {
        const formatDate = timeFormat('%m/%d/%Y');
        return [
            {
                Header: 'Site Code',
                id: 'StationCode',
                accessor: 'StationCode',
                sortType: 'string'
            },
            {
                Header: 'Site Name',
                id: 'StationName',
                accessor: 'StationName',
                sortType: 'string'
            },
            {
                Header: 'Analyte',
                id: 'Analyte',
                accessor: 'Analyte',
                sortType: 'string'
            },
            {
                Header: 'Last Sample',
                id: 'LastSampleDate',
                accessor: 'LastSampleDate',
                sortType: 'datetime',
                Cell: props => <span>{formatDate(props.value)}</span>
            },
            {
                Header: 'Last Result',
                id: 'LastResult',
                accessor: 'ResultWithUnit',
                sortType: 'string'
            },
            {
                Header: 'Trend',
                id: 'Trend',
                accessor: 'AllYears_Trend',
                sortType: 'string',
                Cell: props => <div style={{ display: 'flex', justifyContent: 'center' }}>{props.value === 'Increasing' ? <IconTrendingUp size={18} /> : props.value === 'Decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} /> }</div>
            }
        ]
    }, [])

    const initialState = useMemo(() => {
        return {
            sortBy: [
                {
                    id: 'StationName',
                    desc: false
                }
            ]
        }
    }, [])

    const initialStateSummary = useMemo(() => {
        return {
            sortBy: [
                {
                    id: 'LastSampleDate',
                    desc: true
                }
            ]
        }
    }, [])

    if (!loading && tableData) {
        return (
            <div style={{ marginBottom: '100px' }}>
                <DataTableIndex 
                    columns={ selectedAnalyte ? columnsSummary : columns} 
                    data={tableData} 
                    initialState={ selectedAnalyte ? initialStateSummary : initialState }
                />
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}