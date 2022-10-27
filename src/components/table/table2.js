import React, { useRef, useState } from 'react';

import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import 'rsuite-table/dist/css/rsuite-table.css';
import { tableContainer } from './table.module.css';


// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component

export default function Table2({ comparisonSites, setComparisonSites, setStation, stationData }) {
    const containerRef = useRef(null)

    const [loading, setLoading] = useState(false)
    // const [height, setHeight] = useState(0);
    const [sortColumn, setSortColumn] = useState('LastSampleDate');
    const [sortType, setSortType] = useState('desc')
    // const [width, setWidth] = useState(0);

    /*
    useEffect(() => {
        setWidth(containerRef.current.parentElement.offsetWidth);
        setHeight(containerRef.current.parentElement.offsetHeight);
    }, []);
    */

    // This function checks if a station is already in the selected sites array;
    // If it does not already exist, then it adds the new value to the state array
    const addToComparisonList = (stationCode) => {
        if (stationCode) {
            setComparisonSites(comparisonSites => {
                // Ideally we would put this conditional statement outside (and just before) the set state function, but doing that would give us an stale, empty state array because the value is based off what it is when the function is initiated. Using this anonymous function is the only way I've tried that gives the correct, updated state array
                if (comparisonSites.indexOf(stationCode) === -1) {
                    return new Array(stationCode);
                    // Change the above line to the one below to keep track of multiple selections
                    // return [...comparisonSites, stationCode];
                } else {
                    // Even though we are returning a new value, state does not update because the new array is unchanged from the current array
                    return comparisonSites;
                }
            });
        }
    }

    // Uses state variables sortColumn and sortType to return a dynamically sorted version of the stationData dataset
    // https://rsuite.github.io/rsuite-table/#10
    const getSortedData = () => {
        if (sortColumn && sortType) {
            return stationData.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (typeof x === 'number') {
                    // Sort numbers
                    if (sortType === 'asc') {
                        return x - y;
                    } else {
                        return y - x;
                    }
                } else {
                    // Sort strings
                    if (sortType === 'asc') {
                        return x.localeCompare(y)
                    } else {
                        return y.localeCompare(x);
                    }
                }
            });
        } else {
            return stationData;
        }
    }

    // This function runs whenever a table row is clicked
    const handleClick = (clickedStation) => {
        addToComparisonList(clickedStation.StationCode);  // Must add site to selected list in order for the highlight on the map to appear
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
                    <Column sortable width={120}>
                        <HeaderCell>Last Sample</HeaderCell>
                        <Cell dataKey='LastSampleDate' />
                    </Column>
                    { stationData[0].LastResult ?  
                        <Column sortable width={90} align='left'>
                            <HeaderCell>Result</HeaderCell>
                            <Cell dataKey='LastResult' />
                        </Column>
                    : null }
                    { stationData[0].Unit ?  
                        <Column sortable width={90} align='left'>
                            <HeaderCell>Unit</HeaderCell>
                            <Cell dataKey='Unit' />
                        </Column>
                    : null }
                </Table> 
            }
        </div>
    )
}