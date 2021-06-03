import React, { useEffect, useState } from 'react';
import { timeParse } from 'd3-time-format';
import { extent } from 'd3-array';
import TimeSeries from './time-series';
import Trend from './trend';
import { fetchData, chemistryEndpoint } from '../../utils/utils';


export default function ChemistrySubRowAsync({ row, rowProps, visibleColumns }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [yearRange, setYearRange] = useState(null);
    const [trend, setTrend] = useState({
        trend: row.original['AllYears_Trend'],
        intercept: parseFloat(row.original['AllYears_Intercept']),
        pValue: row.original['AllYears_PValue'],
        slope: parseFloat(row.original['AllYears_Slope']),
        tau: row.original['AllYears_Tau']
    })

    useEffect(() => {
        //const years = Object.keys(chemistryEndpoint).sort((a, b) => b - a);
        //const timePeriod = years.slice(0, 5);
        const columns = ['Analyte', 'StationCode', 'SampleDate', 'Result', 'Unit'];
        const parseDate = timeParse('%Y-%m-%dT%H:%M:%S');

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
            // Get year range for passing to time series and trend components
            const years = extent(resData, (d) => { return d.parsedDate; });
            years[0] = years[0].getFullYear();
            years[1] = years[1].getFullYear();
            setYearRange(years)
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
                        <div style={{ display: 'flex', flexDirection: 'row', margin: '1em' }}>
                            <div style={{ flexBasis: '66%' }}>
                                <TimeSeries data={data} trend={trend} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '34%' }}>
                                <Trend trend={trend} yearRange={yearRange} />
                            </div>
                        </div>
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