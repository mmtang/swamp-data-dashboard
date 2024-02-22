import React, { useEffect, useRef, useState } from 'react';
import { Cell, Column, HeaderCell, Table,  } from 'rsuite-table';
// Import styles
import 'rsuite-table/dist/css/rsuite-table.css';
import { tableContainer } from './table2.module.css';

import { formatNumber } from '../../utils/utils';

// This component generates the data table on the dashboard index page.
// It makes use of the react-data-table-component library
// https://github.com/jbetancur/react-data-table-component
export default function Table2({ 
    analyte,
    comparisonSites, 
    program,
    region,
    selecting,
    setComparisonSites,
    setMessageModal,
    setMessageModalVisible,
    setSelecting,
    setStation, 
    setStationLoading,
    species,
    station, 
    tableData,
}) {
    // State
    const [loading, setLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState('LastSampleDate');
    const [sortType, setSortType] = useState('desc')
    // References
    const containerRef = useRef(null)

    // Custom formatting for number columns
    const NumberCell = ({ rowData, dataKey, ...props }) => (
        <Cell {...props}>
            {formatNumber(rowData[dataKey])}
        </Cell>
    );

    // Uses state variables sortColumn and sortType to return a dynamically sorted version of the stationData dataset
    // https://rsuite.github.io/rsuite-table/#10
    const getSortedData = () => {
        if (sortColumn && sortType && tableData) {
            return tableData.sort((a, b) => {
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
            return tableData;
        }
    }

    // This function checks if a station is already in the comparison sites array. If it does not already exist, then it adds the new value to the state array
    // This runs when a station on the table is clicked and the selecting mode is on (true)
    const addToComparisonList = (stationObj) => {
        if (stationObj) {
            // Check that the clicked site isn't the same as the currently selected site
            if (stationObj.StationCode !== station.StationCode) {
                // Check if site has already been selected. If not already selected (-1), add to existing array
                // Use the ref value here, not the state, because this function cannot get the updated state. There is a useEffect function that updates the ref value whenever state changes
                const selectedCodes = comparisonSites.map(d => d.StationCode);
                if (selectedCodes.indexOf(stationObj.StationCode) === -1) {
                    const newObj = {
                        StationCode: stationObj.StationCode,
                        StationName: stationObj.StationName
                    }
                    setComparisonSites(comparisonSites => [...comparisonSites, newObj]);
                } else {
                    setMessageModal(`${stationObj.StationCode} has already been selected. Try adding another station.`);
                    setMessageModalVisible(true);
                }
            } else {
                setMessageModal(`${stationObj.StationCode} is the currently selected station. Try adding another station.`);
                setMessageModalVisible(true);
            }
        }
    }

    // This function runs whenever a table row is clicked
    const handleClick = (clickedStation) => {
        if (!selecting) {
            setStationLoading(true);
            setStation(clickedStation);
        } else {
            addToComparisonList(clickedStation);
            // Reset the selecting state; this resets the selecting button after the user clicks a station
            setSelecting(false);
        }
    }

    // This function runs whenever a column header is clicked (user changes column sort)
    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        // Add a half second delay to show loading indicator
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    useEffect(() => {
        setLoading(true);
        // Reset state
        setSortColumn('LastSampleDate');
        setSortType('desc')
        setLoading(false);
    }, [analyte, program, region, species]);  // Using tableData as the sole dependency doesn't work. State needs to be reset before the new data is passed into the component. Else, the table will try to sort on a column like "ResultDisplay" when that column may not exist in the new dataset


    return (
        <div ref={containerRef} className={tableContainer}>
            { tableData ?
                <Table 
                    affixHorizontalScrollbar={true}
                    data={getSortedData()}
                    fillHeight={true}
                    loading={loading}
                    minHeight={800}
                    rowHeight={38}
                    onRowClick={handleClick}
                    onSortColumn={handleSortColumn}
                    sortColumn={sortColumn}
                    virtualized
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
                    <Column fullText sortable width={240}>
                        <HeaderCell>Station Name</HeaderCell>
                        <Cell dataKey='StationName' />
                    </Column>
                    <Column sortable width={120}>
                        <HeaderCell>Last Sample</HeaderCell>
                        <Cell dataKey='LastSampleDate' />
                    </Column>
                    {/* Check for undefined and null values here, not truthy/falsy because 0 is a valid result but it's not truthy */}
                    { tableData && tableData.length > 0 && tableData[0].ResultDisplay !== null ?  
                        <Column sortable width={85} align='right'>
                            <HeaderCell>Result</HeaderCell>
                            <NumberCell dataKey='ResultDisplay' />
                        </Column>
                    : null }
                    { tableData && tableData.length > 0 && tableData[0].Unit !== null ?  
                        <Column sortable width={95} align='left'>
                            <HeaderCell>Unit</HeaderCell>
                            <Cell dataKey='Unit' />
                        </Column>
                    : null }
                </Table> 
            : null }
        </div>
    )
}