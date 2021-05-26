import React, { useEffect, useState } from 'react';
import { fetchData, chemistryEndpoint } from '../../utils/utils';

export default function ChemistrySubRowAsync({ row, rowProps, visibleColumns }) {
    const years = Object.keys(chemistryEndpoint).sort((a, b) => b - a);
    const fiveYears = years.slice(0, 5);
    const tenYears = years.slice(0, 9);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [timePeriod, setTimePeriod] = useState(fiveYears);

    const columns = ['Program', 'Analyte', 'SampleDate', 'Result', 'Unit'];

    useEffect(() => {
        console.log(timePeriod);

        let promises = [];
        // get data from all endpoints
        for (const i in timePeriod) {
            // build api query
            let url = chemistryEndpoint[timePeriod[i]];
            url += '&fields=' + columns.join();
            url += '&filters={%22Program%22:%22Surface Water Ambient Monitoring Program%22,%22StationCode%22:%22' + row.original.StationCode + '%22,%22Analyte%22:%22' + row.original.Analyte + '%22}';
            url += '&limit=500';
            promises.push(
                new Promise((resolve) => {
                    fetchData(url)
                    .then((json) => {
                        resolve(json);
                    });
                })
            );
        }

        Promise.all(promises)
        .then((data) => {
            const recordsOnly = data.map(d => d.result.records);
            const resData = [].concat.apply([], recordsOnly);
            setData(resData);
            setLoading(false);
        })

    }, [])

    function SubRows({ row, rowProps, visibleColumns, data, loading }) {
        if (loading) {
            return (
                <tr>
                    <td />
                    <td colSpan={visibleColumns.length - 1}>
                        Loading...
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td />
                    <td colSpan={visibleColumns.length - 1}>
                        Loaded {data.length} records!
                    </td>
                </tr>
            )
        }
    }
    
    return (
        <SubRows
            row={row}
            rowProps={rowProps}
            visibleColumns={visibleColumns}
            data={data}
            loading={loading} />
    )
}