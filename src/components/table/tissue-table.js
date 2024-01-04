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
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState(null);

    const createParams = () => {
        let querySql = `SELECT DISTINCT ON ("StationCode", "Analyte", "CommonName", "SampleYear", "ResultType") "StationCode", "StationName", "Region", "SampleYear", "Analyte", "CommonName", "ResultType", "Result" as ResultDisplay, "Unit" FROM "${tissueResourceId}"`
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
                const groups = new Treeize();
                groups.grow(data);
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
                const data = records.map(d => {
                    return { 
                        //'code': d.StationCode,
                        'id': generateId(),
                        'label*': d.StationName,
                        //'region': regionDict[d.Region],
                        //'analyte': d.Analyte,
                        'children:id': generateId(),
                        'children:species': d.CommonName,
                        'children:year': d.SampleYear,
                        'children:result': +d.resultdisplay,
                        'children:unit': d.Unit,
                        'children:resulttype': d.ResultType,
                    }
                });
                // Transform data to tree structure
                const treeData = convertToDataTree(data);
                resolve(treeData);
            }
          })
          .catch((error) => {
            console.error('Issue with the network response:', error);
          });
        })
      }

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
                    isTree
                    virtualized
                    defaultExpandAllRows={true}
                    bordered
                    cellBordered
                    data={tableData}
                    fillHeight={true}
                    height={500}
                    rowHeight={38}
                    rowKey='id'
                    //onRowClick={handleClick}
                    //onSortColumn={handleSortColumn}
                    //sortColumn={sortColumn}
                    //affixHorizontalScrollbar={true}
                >
                    <Column width={200} fullText treeCol>
                        <HeaderCell>Station</HeaderCell>
                        <Cell dataKey='label' />
                    </Column>
                    <Column width={160} fullText align='left'>
                        <HeaderCell>Species</HeaderCell>
                        <Cell dataKey='species' />
                    </Column>
                    <Column width={70} align='center'>
                        <HeaderCell>Year</HeaderCell>
                        <Cell dataKey='year' />
                    </Column>
                    <Column width={90} align='right'>
                        <HeaderCell>Result</HeaderCell>
                        <Cell dataKey='result' />
                    </Column>
                    <Column width={90} align='left'>
                        <HeaderCell>Unit</HeaderCell>
                        <Cell dataKey='unit' />
                    </Column>
                    <Column width={210}>
                        <HeaderCell>Result Type</HeaderCell>
                        <Cell dataKey='resulttype' />
                    </Column>
                </Table> 
            : <div className={loaderContainer}><LoaderBlock /></div> }
        </div>
    )
}