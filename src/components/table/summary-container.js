import React, { useEffect, useState } from 'react';
import SummarySubMenu from '../panel-menu/summary-sub-menu';
import SummaryTable from '../table/summary-table';

import { container } from './summary-container.module.css';

export default function SummaryContainer({ 
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
    // State variables
    const [allRowKeys, setAllRowKeys] = useState([]); // Array for tracking all visible rows in the summary table
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Array of table row ID values for tracking which rows are expanded/collapsed
    const [searchText, setSearchText] = useState('');
    const [visibleStations, setVisibleStations] = useState(null);

    useEffect(() => {
        setSearchText(''); // Reset search text whenever new filters are applied or removed
    }, [analyte, program, region, species]);

    // Use the inherited tableData passed from the map component to get a unique list of sites
    // Use this list to control which sites are shown in the table
    useEffect(() => {
        if (tableData && analyte && analyte.source === 'tissue') {
            setSearchText(''); // Reset search
            const stations = tableData.map(d => d.StationCode);
            const uniqueStations = [...new Set(stations)];
            setVisibleStations(uniqueStations);
        }
    }, [tableData]);

    if ((analyte && analyte.source === 'tissue') || (species && species.source === 'tissue')) {
        return (
            <div className={container}>
                <SummarySubMenu 
                    allRowKeys={allRowKeys}
                    searchText={searchText}
                    setExpandedRowKeys={setExpandedRowKeys}
                    setSearchText={setSearchText} 
                />
                <SummaryTable 
                    analyte={analyte}
                    comparisonSites={comparisonSites}
                    expandedRowKeys={expandedRowKeys}
                    program={program}
                    region={region}
                    searchText={searchText}
                    selecting={selecting}
                    setAllRowKeys={setAllRowKeys}
                    setComparisonSites={setComparisonSites}
                    setExpandedRowKeys={setExpandedRowKeys}
                    setMessageModal={setMessageModal}
                    setMessageModalVisible={setMessageModalVisible}
                    setSelecting={setSelecting}
                    setStation={setStation}
                    setStationLoading={setStationLoading}
                    species={species}
                    station={station}
                    visibleStations={visibleStations}
                />
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
    
}