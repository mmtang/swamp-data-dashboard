import React, { useEffect, useState } from 'react';
import { timeParse } from 'd3-time-format';
import TimeSeries from './time-series';
import { fetchData, chemistryEndpoint } from '../../utils/utils';


export default function ChemistrySubRowAsync({ row, rowProps, visibleColumns }) {
    const years = Object.keys(chemistryEndpoint).sort((a, b) => b - a);
    const fiveYears = years.slice(0, 5);
    const tenYears = years.slice(0, 9);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [timePeriod, setTimePeriod] = useState(fiveYears);

    const columns = ['Analyte', 'StationCode', 'SampleDate', 'Result', 'Unit'];
    const dateParser = timeParse('%Y-%m-%dT%H:%M:%S');

    useEffect(() => {
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
            let resData = [].concat.apply([], recordsOnly);
            resData = resData.filter(d => d.Result !== 'NaN');
            resData.forEach(d => {
                d.parsedDate = dateParser(d.SampleDate);
            });
            resData.sort((a, b) => a.parsedDate - b.parsedDate);
            setData(resData);
            setLoading(false);
        })

    }, [])

    function SubRows({ row, rowProps, visibleColumns, data, loading }) {
        if (loading) {
            return (
                <tr>
                    <td colSpan={visibleColumns.length}>
                        Loading...
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td colSpan={visibleColumns.length}>
                        <TimeSeries data={data} />
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