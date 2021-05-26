import React, { useEffect, useState } from 'react';


export default function ChemistrySubRowAsync({ row, rowProps, visibleColumns }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setData('Hello');
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [])

    function SubRows({ row, rowProps, visibleColumns, data, loading }) {
        console.log(row);
        if (loading) {
            return (
                <tr>
                    <td />
                    <td colspan={visibleColumns.length - 1}>
                        Loading...
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td />
                    <td colspan={visibleColumns.length - 1}>
                        Loaded for {row.original.StationCode} for {row.original.Analyte}!
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