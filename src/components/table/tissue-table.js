import React, { useEffect, useState } from 'react';
import LoaderBlock from '../loaders/loader-block';
import { capitalizeFirstLetter, tissueResourceId } from '../../utils/utils';

import Treeize from 'treeize';
import { Cell, Column, HeaderCell, Table,  } from 'rsuite-table';

// Import styles
import 'rsuite-table/dist/css/rsuite-table.css';
import { tableContainer } from './table2.module.css';
import { loaderContainer } from './tissue-table.module.css';

// This component generates the data table for tissue data on the dashboard index page.
export default function TissueTable({ 
    analyte,
    program,
    region,
    species,
    view
}) {
    // State variables
    const [flatData, setFlatData] = useState(null); // The original fetched data, flat structure, used for sorting data
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('SampleYear');
    const [sortType, setSortType] = useState('desc')
    const [tableData, setTableData] = useState(null); // The original flat dataset in tree structure, used for the table

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
            if (data.length > 0) {
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
                resolve(null);
            }
        });
    }

    const generateId = () => {
        const randomId = Math.floor((Math.random() * 100000).toString());
        return randomId;
    }

    // Uses state variables sortColumn and sortType to return a dynamically sorted version of the stationData dataset
    // https://rsuite.github.io/rsuite-table/#10
    const getSortedData = () => {
        return new Promise((resolve, reject) => {
            if (sortColumn && sortType && flatData) {
                const sortedData = flatData.sort((a, b) => {
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
                convertToDataTree(sortedData)
                .then((data) => {
                    resolve(data);
                });
            } else {
                resolve(tableData);
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
                resolve(records);
            }
          })
          .catch((error) => {
            console.error('Issue with the network response:', error);
          });
        })
    }

    // This function runs whenever a column header is clicked (user changes column sort)
    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setSortColumn(sortColumn);
        setSortType(sortType);
    };

    useEffect(() => {
        getSortedData()
        .then((data) => {
            setTableData(data);
            setLoading(false);
        });
    }, [sortColumn, sortType]);

    useEffect(() => {
        if (view === 'summary') {
            setLoading(true);
            // Get data based on filter selection
            const params = createParams();
            getTissueData(params)
            .then((data) => {
                convertToDataTree(data)
                .then((treeData) => {
                    if (treeData) {
                        setTableData(treeData);
                        setLoading(false);
                    }
                });
            });
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        setTableData(null);
        const params = createParams();
        getTissueData(params)
        .then((data) => {
            convertToDataTree(data)
            .then((treeData) => {
                if (treeData) {
                    setTableData(treeData);
                    setLoading(false);
                }
            });
        });
    }, [analyte, species, region, program]);

    return (
        <div className={tableContainer}>
            { tableData ? 
                <Table 
                    bordered
                    cellBordered
                    data={tableData}
                    defaultExpandAllRows={true}
                    fillHeight={true}
                    height={500}
                    isTree
                    loading={loading}
                    rowHeight={38}
                    rowKey='id'
                    shouldUpdateScroll={false}
                    virtualized
                    //onRowClick={handleClick}
                    onSortColumn={handleSortColumn}
                    sortColumn={sortColumn}
                >
                    <Column align='left' sortable width={130}>
                        <HeaderCell>Station Code</HeaderCell>
                        <Cell dataKey='StationCode' />
                    </Column>
                    <Column fullText sortable width={130}>
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
                    <Column width={100} fullText>
                        <HeaderCell>Tissue Prep</HeaderCell>
                        <Cell dataKey='TissuePrep' />
                    </Column>
                </Table> 
            : <div className={loaderContainer}><LoaderBlock /></div> }
        </div>
    )
}