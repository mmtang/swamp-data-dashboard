import React from 'react';
import TrendHelpIcon from '../common/trend-help-icon';
import DataTable from 'react-data-table-component';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { tableWrapper } from './station-table.module.css';

// This component renders the data (passed from index, the parent component) on the station page.
export default function StationTable({ data, setSelectedAnalytes }) {
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

    // Function for rendering the trend and accompanying icon in the table
    const CustomTrend = ({ row }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row['Trend'] === 'Possibly increasing' ? <IconTrendingUp size={18} /> : row['Trend'] === 'Possibly decreasing' ? <IconTrendingDown size={18} /> : <IconMinus size={18} alt={row['Trend']} /> }
                    &nbsp;&nbsp;&nbsp;
                    <span>{row['Trend']}</span>
                </div>
            </div>
        )
    }

    const columns = [
        {
            id: 'indicator',
            name: 'Indicator',
            selector: row => row['Analyte'],
            width: '180px',
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
            name: 'Last Sample Date',
            selector: row => row['LastSampleDate'],
            width: '140px',
            sortable: true,
            right: true
        },
        {
            id: 'lastResult',
            name: 'Last Result',
            selector: row => row['LastResult'] + ' ' + row['Unit'],
            width: '145px',
            sortable: false,
            format: row => row['LastResult'].toLocaleString() + ' ' + row['Unit'],
            right: true
        },
        {
            id: 'trend',
            name: <TrendHelpIcon />,
            selector: row => row['Trend'],
            width: '165px',
            sortable: true,
            format: row => <CustomTrend row={row} />
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
            id: 'median',
            name: 'Median',
            selector: row => row['Median'],
            width: '84px',
            sortable: false,
            format: row => row['Median'].toLocaleString(),
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
        const newSelection = rows.selectedRows.map(d => d.Analyte);
        setSelectedAnalytes(newSelection);
    };
    
    return (
        <div className={tableWrapper}>
            <DataTable 
                columns={columns} 
                data={data} 
                customStyles={customStyles}
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