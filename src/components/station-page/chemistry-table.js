import React, { useEffect, useState, useMemo } from 'react';
import DataTable from './data-table';


export default function ChemistryTable(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.station) {
            getData()
            .then((records) => {
                console.log(records);
                setData(records);
            });
        }
    }, [props])

    const columns = useMemo(() => {
        return [
            {
                Header: 'Analyte',
                accessor: 'Analyte'
            },
            {
                Header: 'Last Sample Date',
                accessor: 'SampleDate'
            },
            {
                Header: 'Last Sample Result',
                accessor: 'Result'
            },
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
    
    return (
        <DataTable columns={columns} data={data} />
    )
}