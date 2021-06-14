import React, { useEffect, useState, useMemo } from 'react';
import DataTableIndex from './data-table-index';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { fetchData, regionDict, regionNumDict } from '../../utils/utils';
import { timeParse, timeFormat } from 'd3';

export default function TableIndex({ selectedRegion, setRegion, selectedAnalyte, setAnalyte, setSite }) {
    const [stationData, setStationData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');
    const formatDate = timeFormat('%m/%d/%Y');

    useEffect(() => {
        if (loading) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&fields=StationName,StationCode,TargetLatitude,TargetLongitude,Region,LastSampleDate&limit=5000';
            fetchData(url)
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.Region = regionDict[d.Region];
                        d.LastSampleDate = parseDate(d.LastSampleDate);
                    });
                    setStationData(records);
                    setTableData(records);
                    setLoading(false);
                });
        }
    }, [])

    useEffect(() => {
        // if only region is selected
        if (selectedRegion && !(selectedAnalyte)) {
            const newData = stationData.filter(d => d.Region === selectedRegion);
            setTableData(newData);
        }
        // if only analyte is selected
        if (!(selectedRegion) && selectedAnalyte) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=5000';
            url += '&filters={%22Analyte%22:%22' + encodeURIComponent(selectedAnalyte) + '%22}';
            fetchData(url)
                .then(json => json.result.records)
                .then(records => {
                    records.forEach(d => {
                        d.LastSampleDate = parseDate(d.LastSampleDate);
                        d.Region = regionDict[d.Region];
                        d.LastResult = Math.round(d.LastResult * 100) / 100;
                        d.Unit = d.Analyte === 'pH' ? '' : d.Unit;
                        d.ResultWithUnit = d.LastResult + ' ' + d.Unit;
                    });
                    setTableData(records);
                });
        }
        // if both region and analyte are selected
        if (selectedRegion && selectedAnalyte) {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=555ee3bf-891f-4ac4-a1fc-c8855cf70e7e&limit=5000';
            url += '&filters={%22Analyte%22:%22' + selectedAnalyte + '%22,%22Region%22:%22' + regionNumDict[selectedRegion] + '%22}';
            fetchData(url)
                .then(json => json.result.records)
                .then(records => {
                    console.log(records);
                    records.forEach(d => {
                        d.LastSampleDate = parseDate(d.LastSampleDate);
                        d.Region = regionDict[d.Region];
                        d.LastResult = Math.round(d.LastResult * 100) / 100;
                        d.Unit = d.Analyte === 'pH' ? '' : d.Unit;
                        d.ResultWithUnit = d.LastResult + ' ' + d.Unit;
                    });
                    setTableData(records);
                });
        }
        // if neither are selected
        if (!loading && !selectedRegion && !selectedAnalyte) {
            setTableData(stationData);
        }
    }, [selectedRegion, selectedAnalyte])

    const columns = useMemo(() => {
        return [
            {
                Header: 'Region',
                id: 'Region',
                accessor: 'Region',
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
            },
            {
                Header: 'Last Sample',
                id: 'LastSampleDate',
                accessor: 'LastSampleDate',
                sortType: 'datetime',
                Cell: props => <span>{formatDate(props.value)}</span>
            }
        ]
    }, [])

    const columnsSummary = useMemo(() => {
        return [
            {
                Header: 'Region',
                id: 'Region',
                accessor: 'Region',
                sortType: 'string',
            },
            /*
            {
                Header: 'Site Code',
                id: 'StationCode',
                accessor: 'StationCode',
                sortType: 'string'
            },
            */
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
                    initialState={initialState}
                    selectedRegion={selectedRegion}
                    setRegion={setRegion}
                    selectedAnalyte={selectedAnalyte}
                    setAnalyte={setAnalyte}
                    setSite={setSite}
                />
            </div>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}