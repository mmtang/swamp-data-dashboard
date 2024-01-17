import React, { useEffect, useState } from 'react';
import LoaderBlock from '../loaders/loader-block';
import { capitalizeFirstLetter, tissueResourceId } from '../../utils/utils';

import Treeize from 'treeize';
import { Cell, Column, HeaderCell, Table  } from 'rsuite-table';

// Import styles
import 'rsuite-table/dist/css/rsuite-table.css';
import { tableContainer } from './table2.module.css';
import { loaderContainer } from './summary-table.module.css';

// This component generates the data table for tissue data on the dashboard index page.
export default function SummaryTable({ 
    analyte,
    expandedRowKeys,
    program,
    region,
    searchText,
    setAllRowKeys,
    setExpandedRowKeys,
    species,
    view
}) {
    // State variables
    const [flatData, setFlatData] = useState(null); // The original dataset in flat structure, serves as a copy of the original dataset, used for filtering. This dataset gets updated whenever one of the filters from the main page are used and applied
    const [filteredData, setFilteredData] = useState(null); // The filtered data in flat structure, used for sorting
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('SampleYear');
    const [sortType, setSortType] = useState('desc')
    const [tableData, setTableData] = useState(null); // The filtered dataset in tree structure, used for the table

    const createParams = () => {
        let querySql = `SELECT DISTINCT ON ("StationCode", "Analyte", "CommonName", "SampleYear", "ResultType", "TissueName", "TissuePrep") "StationCode", "StationName", "Region", "SampleYear", "Analyte", "CommonName", "ResultType", "Result", "Unit", "TissueName", "TissuePrep" FROM "${tissueResourceId}"`
        const whereStatements = [];
        if (analyte || program || region || species) {
            // This block constucts the "WHERE" part of the select query
            // There can be one or more filters
            if (analyte) {
                whereStatements.push(`"Analyte" = '${analyte.label}'`);
                whereStatements.push(`"MatrixDisplay" = '${analyte.matrix}'`);
            }
            if (program) {
                whereStatements.push(`"${capitalizeFirstLetter(program)}" = 'True'`);
            }
            if (region) {
                // Region value on open data portal is string; convert value before appending to query string
                let regionVal = region;
                if (typeof regionVal === 'number') {
                    regionVal = region.toString();
                }
                whereStatements.push(`"Region" = '${regionVal}'`);
            }
            if (species) {
                whereStatements.push(`"CommonName" = '${species.value}'`);
            }
            // Concat multiple join statements
            if (whereStatements.length > 0) {
                const concat = whereStatements.join(' AND ');
                querySql += ' WHERE ';
                querySql += concat;
            }
            querySql += ` ORDER BY "SampleYear" DESC, "CommonName"`
        }
        return { resource_id: tissueResourceId, sql: querySql };
    }

    // This function takes an array of JSON objects and converts it to a tree structure
    const convertToDataTree = (data) => {
        return new Promise((resolve, reject) => {
            if (data && data.length > 0) {
                // Define structure of the tree dataset by renaming the fields, see Treeize package
                const remappedData = data.map(d => {
                    return { 
                        'id': generateId(),
                        'StationCode': d.StationCode,
                        'StationName*': d.StationName,
                        'Analyte': d.Analyte,
                        'children:id': generateId(),
                        'children:Species': d.CommonName,
                        'children:SampleYear': +d.SampleYear,
                        'children:Result': +d.Result,
                        'children:Unit': d.Unit,
                        'children:ResultType': d.ResultType,
                        'children:TissuePrep': d.TissuePrep
                    }
                });
                // Create tree dataset
                const groups = new Treeize();
                groups.grow(remappedData);
                const treeData = groups.getData();
                resolve(treeData);
            } else {
                resolve([]);
            }
        });
    }

    const generateId = () => {
        const randomId = Math.floor((Math.random() * 10000000).toString());
        return randomId;
    }

    const getFilteredData = (data, searchString) => {
        return new Promise((resolve, reject) => {
            if (data && data.length > 0) {
                // Filtering the data - return all objects where any of the object's properties includes the search term
                const filtered = data.filter(d => Object.keys(d).some(k => String(d[k]).toLowerCase().includes(searchString.toLowerCase())));
                setFilteredData(filtered);
                resolve(filtered);
            } else {
                resolve([]);
            }
        });
    }

    // Function for getting an array of row keys/ids from the given array of data objects
    const getRowKeys = (data) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            if (data && data.length > 0) {
                const rowKeys = data.map(d => d.id);
                resolve(rowKeys);
            } else {
                resolve([]);
            }
        })
    }

    // Uses state variables sortColumn and sortType to return a dynamically sorted version of the stationData dataset: https://rsuite.github.io/rsuite-table/#10
    const getSortedData = (data) => {
        return new Promise((resolve, reject) => {
            if (sortColumn && sortType && data) {
                if (data.length > 0) {
                    const sortedData = data.sort((a, b) => {
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
                    resolve(sortedData);
                } else {
                    resolve([]);
                }
            } else {
                resolve(data);
            }
        })
    }

    const getTissueData = (params) => {
        return new Promise((resolve, reject) => {
          const url = 'https://data.ca.gov/api/3/action/datastore_search_sql?';
          console.log(url + new URLSearchParams(params));
          fetch(url + new URLSearchParams(params))
          .then((resp) => {
            if (!resp.ok) {
              throw new Error('Network response error');
            }
            return resp.json();
          })
          .then((json) => json.result.records)
          .then((records) => {
            if (records.length > 0) {
                records.forEach((d) => {
                    d.Result = +d.Result;
                    d.SampleYear = +d.SampleYear;
                });
                setFlatData(records);
                setFilteredData(records);
                resolve(records);
            }
          })
          .catch((error) => {
            console.error('Issue with the network response:', error);
          });
        })
    }

    // Returns index position in array where is a match
    const findValueInArray = (arr, value) => {
        const matchedIndex = arr.findIndex((d) => d === value);
        return matchedIndex;
    }

    // Add a single row key/id to the existing expanded list and update state
    const addToExpandedList = (val) => {
        if (val) {
            let newArr = [...expandedRowKeys];
            newArr.push(val);
            setExpandedRowKeys(newArr);
        }
    }

    // Remove a single row key/id from the existing expanded list and update state
    const removeFromExpandedList = (key) => {
        const matchedIndex = findValueInArray(expandedRowKeys, key);
        // Remove site
        const newArr = removeObjByIndex(expandedRowKeys, matchedIndex);
        setExpandedRowKeys(newArr);
    }

    // Removes object in an array by index value, used in handleRemove function
    const removeObjByIndex = (arr, index) => {
        // When copying the state array, use the spread operator or slice the array to create a copy; or else, React will copy the same reference to the state array and any changes made using the set function won't trigger a rerender (https://stackoverflow.com/a/67354136)
        let newArr = [...arr];
        // Only splice if the item is found
        if (index > -1) {
            newArr.splice(index, 1);
        }
        return newArr;
    }

    const handleExpandToggle = (isOpen, rowData) => {
        // A bit confusing: isOpen returns true when you click to expand a row, and it returns false when you click to collapse a row. Therefore, add the value to the expanded row list when isOpen === true
        const rowId = rowData.id;
        if (isOpen === true) {
            addToExpandedList(rowId); // Add rowId to expand list
        } else {
            removeFromExpandedList(rowId); // Remove rowId from expand list
        }
    }

    // This function runs whenever a column header is clicked (user changes column sort)
    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    useEffect(() => {
        getSortedData(filteredData)
        .then((data) => convertToDataTree(data))
        .then((data) => {
            getRowKeys(data)
            .then((keys) => {
                setExpandedRowKeys(keys);
                setTableData(data);
                setLoading(false);
            });
        });
    }, [sortColumn, sortType]);

    useEffect(() => {
        if (view === 'summary') {
            setLoading(true);
            // Get data based on filter selection
            const params = createParams();
            getTissueData(params)
            .then((data) => convertToDataTree(data))
            .then((treeData) => {
                if (treeData) {
                    getRowKeys(treeData)
                    .then((keys) => {
                        setExpandedRowKeys(keys);
                        setTableData(treeData);
                        setLoading(false);
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        // Reset state
        setLoading(true);
        setExpandedRowKeys([]);
        setTableData(null);
        setSortColumn('SampleYear');
        setSortType('desc');
        // Get data
        const params = createParams();
        getTissueData(params)
        .then((data) => getSortedData(data))
        .then((data) => convertToDataTree(data))
        .then((treeData) => {
            if (treeData) {
                getRowKeys(treeData)
                .then((keys) => {
                    setExpandedRowKeys(keys);
                    setTableData(treeData);
                    setLoading(false);
                });
            }
        });
    }, [analyte, species, region, program]);

    useEffect(() => {
        // SearchText should be a string, even if a number is searched
        // Capture empty searches (passed as an empty string ('')) in the else statement
        if (searchText) {
            getFilteredData(flatData, searchText)
            .then((data) => getSortedData(data))
            .then((data) => convertToDataTree(data))
            .then((data) => {
                getRowKeys(data)
                .then((keys) => {
                    setExpandedRowKeys(keys);
                    setTableData(data);
                });
            });
        } else {
            // User cleared search - reset the filtered dataset state to the original dataset
            setFilteredData(flatData);
            getSortedData(flatData)
            .then((data) => convertToDataTree(data))
            .then((data) => {
                getRowKeys(data)
                .then((keys) => {
                    setExpandedRowKeys(keys);
                    setTableData(data);
                });
            });
        }
    }, [searchText]);

    useEffect(() => {
        if (tableData) {
            getRowKeys(tableData)
            .then((keys) => {
                setAllRowKeys(keys);
            });
        } else {
            setAllRowKeys([]);
        }
    }, [tableData]);

    return (
        <div className={tableContainer}>
            { tableData ? 
                <Table 
                    bordered
                    cellBordered
                    data={tableData}
                    defaultExpandAllRows={true}
                    expandedRowKeys={expandedRowKeys}
                    fillHeight={true}
                    isTree
                    loading={loading}
                    rowHeight={38}
                    rowKey='id'
                    shouldUpdateScroll={false}
                    virtualized
                    //onRowClick={handleClick}
                    onExpandChange={handleExpandToggle}
                    onSortColumn={handleSortColumn}
                    sortColumn={sortColumn}
                >
                    <Column align='left' fullText sortable width={160}>
                        <HeaderCell>Station Code</HeaderCell>
                        <Cell dataKey='StationCode' />
                    </Column>
                    <Column fullText sortable width={140}>
                        <HeaderCell>Station Name</HeaderCell>
                        <Cell dataKey='StationName' />
                    </Column>
                    <Column width={150} fullText align='left'>
                        <HeaderCell>Species</HeaderCell>
                        <Cell dataKey='Species' />
                    </Column>
                    <Column align='center' sortable width={70}>
                        <HeaderCell>Year</HeaderCell>
                        <Cell dataKey='SampleYear' />
                    </Column>
                    <Column align='right' sortable width={90}>
                        <HeaderCell>Result</HeaderCell>
                        <Cell dataKey='Result' />
                    </Column>
                    <Column align='left' width={90} >
                        <HeaderCell>Unit</HeaderCell>
                        <Cell dataKey='Unit' />
                    </Column>
                    <Column width={170} fullText>
                        <HeaderCell>Result Type</HeaderCell>
                        <Cell dataKey='ResultType' />
                    </Column>
                    <Column width={130} fullText>
                        <HeaderCell>Tissue Prep</HeaderCell>
                        <Cell dataKey='TissuePrep' />
                    </Column>
                </Table> 
            : <div className={loaderContainer}><LoaderBlock /></div> }
        </div>
    )
}