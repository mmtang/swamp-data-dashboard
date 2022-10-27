import React, { useEffect, useState } from 'react';
import MatrixTag from '../common/matrix-tag';
import DataTable from 'react-data-table-component';
import { tableContainer } from './table.module.css';

// This component renders the data (passed from index, the parent component) on the station page.
export default function PanelStationTable({ data }) {
    const [loading, setLoading] = useState(true);

    // Overrides:
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
            selector: row => row['Analyte'],
            width: '180px',
            wrap: true,
            sortable: true
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
        }
    ];

    const handleSelectionUpdate = (rows) => {
        console.log(rows);
    };

    useEffect(() => {
        if (data) {
            setLoading(false);
        }
    }, [data]);
    
    if (loading || !data) {
        return (
            <div className={tableContainer}>
                Loading...
            </div>
        );
    } else {
        return (
            <div className={tableContainer}>
                <DataTable 
                    columns={columns} 
                    customStyles={customStyles}
                    data={data} 
                    fixedHeader
                    highlightOnHover
                    defaultSortFieldId={'lastDate'}
                    defaultSortAsc={false}
                    //onSelectedRowsChange={(rows) => handleSelectionUpdate(rows)}
                    dense
                />
            </div>
        )
    }
}