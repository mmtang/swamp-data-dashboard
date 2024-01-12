import React, { useEffect, useState } from 'react';
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
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        console.log(searchText);
    }, [searchText]);

    return (
        <div className={container}>
            <SummarySubMenu 
                setSearchText={setSearchText} 
            />
            <SummaryTable 
                analyte={analyte}
                program={program}
                region={region}
                species={species}
                view={view}
            />
        </div>
    )
}