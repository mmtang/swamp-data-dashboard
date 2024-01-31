import React, { useState } from 'react';
import BulkDownload from '../map-controls/bulk-download';
import { Icon, Popup } from 'semantic-ui-react';
import { 
    container, 
    iconContainer,
    menuItem, 
    menuWrapper, 
    rightContainer,
    statContainer, 
    statLabel 
} from './panel-map-menu.module.css';

export default function PanelMapMenu({ 
    analyte,
    filterByMapExtent,
    program,
    region,
    setFilterByMapExtent,
    setView, 
    species,
    stationData,
    tableData,
    view
}) {   
    // Set state in the parent component (panel-map-menu) instead of the child component (bulk-download) because 
    const [dataModalVisible, setDataModalVisible] = useState(false);

    const showTable = !((analyte && analyte.source === 'tissue') || (species && species.source === 'tissue'));

    const popupStyle = {
        borderRadius: 0,
        fontSize: '0.85em',
        opacity: 1,
        padding: '1em'
    }

    const handleDataClick = () => {
        if (dataModalVisible === false) {
            setDataModalVisible(true);
        }
    }

    const handleFilterClick = () => {
        if (filterByMapExtent === false) {
            setFilterByMapExtent(true);
        } else {
            setFilterByMapExtent(false);
        }
    }

    const handleMapClick = () => {
        setView('map');
    }

    const handleTableClick = () => {
        setView('table');
    }

    const handleSummaryClick = () => {
        setView('summary');
    }

    return (
        <div className={container}>
            <div className={menuWrapper}>
                {/* Map */}
                { view !== 'map' ? 
                    <div className={menuItem} onClick={handleMapClick}>
                        <div>
                            <Icon fitted inverted 
                                size='large'
                                name='map'
                            />
                            <span>Map</span>
                        </div>
                    </div>
                : null }
                {/* Table */}
                { view !== 'table' && showTable ?
                    <div className={menuItem} onClick={handleTableClick}>
                        <div>
                            <Icon fitted inverted 
                                size='large'
                                name='table'
                            />
                            <span>Table</span>
                        </div>
                    </div>
                : null }
                {/* Tissue Summary */}
                { view !== 'summary' && !showTable ?
                    <div className={menuItem} onClick={handleSummaryClick}>
                        <div>
                            <Icon fitted inverted 
                                size='large'
                                name='table'
                            />
                            <span>Table</span>
                        </div>
                    </div>
                : null }
                {/* Download */}
                <div className={menuItem} onClick={handleDataClick}>
                    <BulkDownload 
                        analyte={analyte} 
                        dataModalVisible={dataModalVisible}
                        program={program} 
                        region={region} 
                        species={species}
                        setDataModalVisible={setDataModalVisible}
                        stationData={stationData} 
                    />
                </div>
            </div>
            
            <div className={rightContainer}>
                {/* Station count */} 
                { tableData ? 
                    <div className={statContainer}>
                        <span className={statLabel}>{tableData.length}&nbsp;&nbsp;stations</span>
                    </div> 
                : null }
                {/* Filter by map extent icon */} 
                <div className={iconContainer} style={{ opacity: filterByMapExtent ? '100%' : '60%' }}>
                    <Popup
                        inverted
                        content='Filter table by map extent'
                        style={popupStyle}
                        trigger={
                            <Icon 
                                color={ filterByMapExtent ? 'teal' : null }
                                fitted
                                inverted 
                                link
                                name='filter' 
                                onClick={handleFilterClick}
                                position='top left'
                            />
                        }
                    />
                </div>
            </div>
        </div>
    )
}