import React, { useEffect, useRef, useState } from 'react';

import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import 'rsuite-table/dist/css/rsuite-table.css';
import { tableContainer } from './table.module.css';


// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component

export default function Table2({ setStation, stationData }) {
    const containerRef = useRef(null)

    const [loading, setLoading] = useState(false)
    const [height, setHeight] = useState(0);
    const [sortColumn, setSortColumn] = useState('LastSampleDate');
    const [sortType, setSortType] = useState('desc')
    const [width, setWidth] = useState(0);

    /*
    useEffect(() => {
        setWidth(containerRef.current.parentElement.offsetWidth);
        setHeight(containerRef.current.parentElement.offsetHeight);
    }, []);
    */

    // Uses state variables sortColumn and sortType to return a dynamically sorted version of the stationData dataset
    // https://rsuite.github.io/rsuite-table/#10
    const getSortedData = () => {
        if (sortColumn && sortType) {
            return stationData.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (sortType === 'asc') {
                    return x.localeCompare(y)
                } else {
                    return y.localeCompare(x);
                }
            });
        } else {
            return stationData;
        }
    }

    // This function runs whenever a table row is clicked
    const handleClick = (clickedStation) => {
        setStation(clickedStation);
    }

    // This function runs whenever a column header is clicked (user changes column sort)
    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        // Add a half second delay to show loading indicator
        setTimeout(() => {
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500)
        setLoading(false);
    }

    return (
        <div ref={containerRef} className={tableContainer}>
            { stationData &&
                <Table 
                    virtualized
                    data={getSortedData()}
                    fillHeight={true}
                    height={500}
                    loading={loading}
                    rowHeight={38}
                    onRowClick={handleClick}
                    onSortColumn={handleSortColumn}
                    sortColumn={sortColumn}
                    affixHorizontalScrollbar={true}
                >
                    <Column fixed width={10}>
                        <HeaderCell></HeaderCell>
                        <Cell></Cell>
                    </Column>
                    <Column sortable width={132}>
                        <HeaderCell>Region</HeaderCell>
                        <Cell dataKey='RegionName' />
                    </Column>
                    <Column sortable width={110}>
                        <HeaderCell>Station Code</HeaderCell>
                        <Cell dataKey='StationCode' />
                    </Column>
                    <Column sortable width={240}>
                        <HeaderCell>Station Name</HeaderCell>
                        <Cell dataKey='StationName' />
                    </Column>
                    <Column sortable width={110}>
                        <HeaderCell>Last Sample</HeaderCell>
                        <Cell dataKey='LastSampleDate' />
                    </Column>
                </Table> 
            }
        </div>
    )
}