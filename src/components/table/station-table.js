import React, { useEffect, useState } from 'react';
import MatrixTag from '../common/matrix-tag';
import DataTable from 'react-data-table-component';
import { tableWrapper } from './station-table.module.css';

// This component renders the table on the station page using data passed from index, the parent component
export default function StationTable({ data, selectedAnalytes, setSelectedAnalytes }) {
    const [showSpecies, setShowSpecies] = useState(false);
    const [toggledClearRows, setToggledClearRows] = useState(false);

    // Style overrides:
    // https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.js
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#e3e4e6',
                borderBottomWidth: '0px',
            }
        }, 
        headCells: {
            style: {
                color: '#103c68',
                fontWeight: 700,
            }
        }
    }

    // This function sorts an array of values where there might be a mix of null and non null values
    // https://react-data-table-component.netlify.app/?path=/docs/sorting-custom-column-sort--custom-column-sort
    // https://bobbyhadz.com/blog/javascript-sort-array-with-null-last
    const nullSort = (rowA, rowB) => {
        const a = rowA.Species ? rowA.Species.toLowerCase() : null;
        const b = rowB.Species ? rowB.Species.toLowerCase() : null;
        if (a === null) {
            return 1;
        }
        if (b === null) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    };

    const columns = [
        {
            id: 'matrix',
            name: 'Matrix',
            selector: row => row['MatrixDisplay'],
            width: '122px',
            wrap: true,
            sortable: true,
            format: row => <MatrixTag matrix={row['MatrixDisplay']} />
        },
        {
            id: 'parameter',
            name: 'Parameter',
            selector: row => row['AnalyteDisplay'],
            width: '200px',
            wrap: true,
            sortable: true
        },
        {
            id: 'results',
            name: '# Results',
            selector: row => row['NumResults'],
            width: '95px',
            sortable: true,
            format: row => row['NumResults'].toLocaleString(),
            right: true
        },
        {
            id: 'lastDate',
            name: 'Last Sample',
            selector: row => row['LastSampleDate'],
            width: '130px',
            sortable: true,
            right: true
        },
        {
            id: 'lastResult',
            name: 'Last Result',
            selector: row => row['ResultDisplay'] + ' ' + row['Unit'],
            width: '145px',
            sortable: false,
            format: row => row['ResultDisplay'].toLocaleString() + ' ' + row['Unit'],
            right: true
        },
        {
            id: 'min',
            name: 'Min',
            selector: row => row['Min'],
            width: '84px',
            sortable: false,
            format: row => row['Min'].toLocaleString(),
            right: true
        },
        {
            id: 'mean',
            name: 'Mean',
            selector: row => row['Mean'],
            width: '84px',
            sortable: false,
            format: row => row['Mean'].toLocaleString(),
            right: true
        },
        {
            id: 'max',
            name: 'Max',
            selector: row => row['Max'],
            width: '84px',
            sortable: false,
            format: row => row['Max'].toLocaleString(),
            right: true
        }
    ];

    const columnsSpecies = [
        {
            id: 'matrix',
            name: 'Matrix',
            selector: row => row['MatrixDisplay'],
            width: '122px',
            wrap: true,
            sortable: true,
            format: row => <MatrixTag matrix={row['MatrixDisplay']} />
        },
        {
            id: 'parameter',
            name: 'Parameter',
            selector: row => row['AnalyteDisplay'],
            width: '200px',
            wrap: true,
            sortable: true
        },
        {
            id: 'species',
            name: 'Species',
            selector: row => row['Species'],
            width: '140px',
            wrap: true,
            sortable: true,
            sortFunction: nullSort
        },
        {
            id: 'results',
            name: '# Results',
            selector: row => row['NumResults'],
            width: '95px',
            sortable: true,
            format: row => row['NumResults'].toLocaleString(),
            right: true
        },
        {
            id: 'lastDate',
            name: 'Last Sample',
            selector: row => row['LastSampleDate'],
            width: '130px',
            sortable: true,
            right: true
        },
        {
            id: 'lastResult',
            name: 'Last Result',
            selector: row => row['ResultDisplay'] + ' ' + row['Unit'],
            width: '145px',
            sortable: false,
            format: row => row['ResultDisplay'].toLocaleString() + ' ' + row['Unit'],
            right: true
        },
        {
            id: 'min',
            name: 'Min',
            selector: row => row['Min'],
            width: '84px',
            sortable: false,
            format: row => row['Min'].toLocaleString(),
            right: true
        },
        {
            id: 'mean',
            name: 'Mean',
            selector: row => row['Mean'],
            width: '84px',
            sortable: false,
            format: row => row['Mean'].toLocaleString(),
            right: true
        },
        {
            id: 'max',
            name: 'Max',
            selector: row => row['Max'],
            width: '84px',
            sortable: false,
            format: row => row['Max'].toLocaleString(),
            right: true
        }
    ];

    const handleSelectionUpdate = (rows) => {
        const newSelection = rows.selectedRows.map((d) => {
            return {
                Analyte: d.AnalyteDisplay,
                Matrix: d.MatrixDisplay,
                Source: d.Source,
                Species: d.Species,
                // Adding d.Species as a string when the value is null will append the text 'null'
                Key: d.AnalyteDisplay + ' ' + d.MatrixDisplay + ' ' + d.Species
            }
        });
        setSelectedAnalytes(newSelection);
    };

    // Commented out 11/13/22 - From a UX perspective, we may want the user selection to persist even when the category is changed. If the user is searching many records, then they may be trying to narrow down their selections, and resetting the selected analytes could cause a lot of frustration
    // Keep for reference or if we decide to add it back
    /*
    useEffect(() => {
        // Set toggledClearRows (state) to the opposite boolean value in order to clear all rows
        // https://react-data-table-component.netlify.app/?path=/docs/selectable-manage-selections--manage-selections
        setToggledClearRows(!toggledClearRows);
        // Also clear state for parent component to clear the analyte count displayed in button
        setSelectedAnalytes([]);
    }, [selectedCategory]);
    */

    useEffect(() => {
        if (data) {
            // Get array of species values to check if this site has any toxicity or tissue data
            const species = data.map(d => d.Species).filter(d => d != null);
            if (species.length > 0) {
                setShowSpecies(true);
            } else {
                setShowSpecies(false);
            }
        }
    }, [data]);

    useEffect(() => {
        if (selectedAnalytes.length === 0) {
            // Set toggledClearRows (state) to the opposite boolean value in order to clear all rows
            // https://react-data-table-component.netlify.app/?path=/docs/selectable-manage-selections--manage-selections
            setToggledClearRows(!toggledClearRows);
        }
    }, [selectedAnalytes]);
    
    return (
        <div className={tableWrapper}>
            <DataTable 
                clearSelectedRows={toggledClearRows}
                columns={ showSpecies ? columnsSpecies : columns } 
                customStyles={customStyles}
                data={data} 
                //fixedHeader
                highlightOnHover
                selectableRows
                selectableRowsHighlight
                defaultSortFieldId={'lastDate'}
                defaultSortAsc={false}
                onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                dense
            />
        </div>
    )
}