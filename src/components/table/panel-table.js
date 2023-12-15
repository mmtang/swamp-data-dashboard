import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format, timeFormat } from 'd3';
// Import styles
import { container } from './panel-table.module.css';

// This component renders the table on the station page using data passed from index, the parent component
export default function PanelTable({ analyte, data }) {
    const [tableData, setTableData] = useState([]);

    const formatDate = timeFormat('%m/%d/%Y');
    const formatResult = format(","); // Format numbers with commas to delimit thousands, millions, etc.

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
        },
        pagination: {
            style: {
                fontSize: '12px',
            }
        }

    }

    const chemistryColumns = [
        {
            id: 'stationcode',
            name: 'Station',
            selector: row => row['StationCode'],
            width: '95px',
            wrap: true,
            sortable: true,
        },
        {
            id: 'sampledate',
            name: 'Sample Date',
            selector: row => row['SampleDate'],
            width: '113px',
            wrap: true,
            sortable: true,
            format: row => formatDate(row['SampleDate']),
            right: true
        },
        {
            id: 'result',
            name: 'Result',
            selector: row => row['ResultDisplay'],
            width: '90px',
            sortable: true,
            format: row => formatResult(row['ResultDisplay']),
            right: true
        },
        {
            id: 'unit',
            name: 'Unit',
            selector: row => row['Unit'],
            width: '90px',
            sortable: true,
            right: true
        }
    ];

    const toxicityColumns = [
        {
            id: 'stationcode',
            name: 'Station',
            selector: row => row['StationCode'],
            width: '95px',
            wrap: true,
            sortable: true,
        },
        {
            id: 'species',
            name: 'Species',
            selector: row => row['Species'],
            width: '130px',
            wrap: true,
            sortable: true
        },
        {
            id: 'sampledate',
            name: 'Sample Date',
            selector: row => row['SampleDate'],
            width: '113px',
            wrap: true,
            sortable: true,
            format: row => formatDate(row['SampleDate']),
            right: true
        },
        {
            id: 'result',
            name: 'Result',
            selector: row => row['ResultDisplay'],
            width: '90px',
            sortable: true,
            format: row => formatResult(row['ResultDisplay']),
            right: true
        },
        {
            id: 'unit',
            name: 'Unit',
            selector: row => row['Unit'],
            width: '80px',
            sortable: true,
            right: true
        }
    ]

    const tissueColumns = [
        {
            id: 'species',
            name: 'Species',
            selector: row => row['Species'],
            width: '150px',
            wrap: true,
            sortable: true
        },
        {
            id: 'sampleyear',
            name: 'Year',
            selector: row => row['SampleYear'],
            width: '70px',
            wrap: true,
            sortable: true,
            //format: row => formatDate(row['SampleDate']),
            right: true
        },
        {
            id: 'result',
            name: 'Result',
            selector: row => row['ResultDisplay'],
            width: '85px',
            sortable: true,
            format: row => formatResult(row['ResultDisplay']),
            right: true
        },
        {
            id: 'unit',
            name: 'Unit',
            selector: row => row['Unit'],
            width: '90px',
            sortable: true,
            right: true
        },
        {
            id: 'sampletype',
            name: 'Sample Type',
            selector: row => row['CompositeIndividual'],
            width: '120px',
            sortable: true,
            right: true
        },
        {
            id: 'tissueprep',
            name: 'Tissue Prep',
            selector: row => row['TissuePrep'],
            width: '140px',
            sortable: true,
            right: true
        }
    ];

    useEffect(() => {
        if (data && data.sites) {
            // Get site keys/codes
            const stationKeys = Object.keys(data.sites);
            let allSitesData = [];
            for (const i of stationKeys) {
                allSitesData = allSitesData.concat(data.sites[i]);
            }
            // Sort by SampleDate and Station/Species
            let col1, col2;
            if (analyte.source === 'tissue') {
                col1 = 'SampleYear'; // Sort by SampleYear first and Species second
                col2 = 'Species'; 
            } else if (analyte.source === 'toxicity') {
                col1 = 'SampleDate';
                col2 = 'StationCode';
            } else {
                col1 = 'SampleDate';
                col2 = 'StationCode';
            }
            // This order will sort the records in descending order on col1. Within each date/year grouping, it will sort in ascending order on col2
            allSitesData.sort((a, b) => b[col1] - a[col1] || a[col2].localeCompare(b[col2]));
            setTableData(allSitesData);
        }
    }, [data]);

    const displayColumns = 
        analyte.source === 'chemistry' ? chemistryColumns 
        : analyte.source === 'habitat' ? chemistryColumns
        : analyte.source === 'tissue' ? tissueColumns 
        : analyte.source === 'toxicity' ? toxicityColumns 
        : null;

    return (
        <div className={container}>
            { tableData ? 
                <DataTable 
                    columns={displayColumns} 
                    customStyles={customStyles}
                    data={tableData} 
                    //fixedHeader
                    highlightOnHover
                    defaultSortFieldId={'SampleDate'}
                    defaultSortAsc={false}
                    dense
                    pagination
                />
            : null }
        </div>
    )
}