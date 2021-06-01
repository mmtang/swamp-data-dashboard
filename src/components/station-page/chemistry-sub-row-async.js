import React, { useEffect, useState } from 'react';
import { timeParse } from 'd3-time-format';
import TimeSeries from './time-series';
import { fetchData, chemistryEndpoint } from '../../utils/utils';


export default function ChemistrySubRowAsync({ row, rowProps, visibleColumns }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const years = Object.keys(chemistryEndpoint).sort((a, b) => b - a);
        const timePeriod = years.slice(0, 5);
        const columns = ['Analyte', 'StationCode', 'SampleDate', 'Result', 'Unit'];
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

        /*
        let promises = [];
        // get data from all endpoints
        for (const i in timePeriod) {
            // build api query
            let url = chemistryEndpoint;
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
        */

        let url = chemistryEndpoint;
        url += '&fields=' + columns.join();
        url += '&filters={%22Program%22:%22Surface Water Ambient Monitoring Program%22,%22StationCode%22:%22' + row.original.StationCode + '%22,%22Analyte%22:%22' + row.original.Analyte + '%22}';
        url += '&limit=500';
        fetchData(url)
        .then((res) => res.result.records)
        .then((data) => {
            console.log(data);
            const resData = data.filter(d => d.Result !== 'NaN');
            resData.forEach(d => {
                d.Result = +d.Result;
                d.parsedDate = parseDate(d.SampleDate);
            });
            resData.sort((a, b) => a.parsedDate - b.parsedDate);
            setData(resData);
            setLoading(false);
        })

    }, [row])

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