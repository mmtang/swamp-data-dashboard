import React, { useState } from 'react';
import SummarySubMenu from '../panel-menu/summary-sub-menu';
import SummaryTable from '../table/summary-table';

import { container } from './summary-container.module.css';

export default function SummaryContainer({ 
    analyte,
    program,
    region,
    species,
    view
}) {   
    // State variables
    const [allRowKeys, setAllRowKeys] = useState([]); // Array for tracking all visible rows in the summary table
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Array of table row ID values for tracking which rows are expanded/collapsed
    const [searchText, setSearchText] = useState('');

    return (
        <div className={container}>
            <SummarySubMenu 
                allRowKeys={allRowKeys}
                setExpandedRowKeys={setExpandedRowKeys}
                setSearchText={setSearchText} 
            />
            <SummaryTable 
                analyte={analyte}
                expandedRowKeys={expandedRowKeys}
                program={program}
                region={region}
                searchText={searchText}
                setAllRowKeys={setAllRowKeys}
                setExpandedRowKeys={setExpandedRowKeys}
                species={species}
                view={view}
            />
        </div>
    )
}