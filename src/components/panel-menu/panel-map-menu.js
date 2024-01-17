import React, { useState } from 'react';
import BulkDownload from '../map-controls/bulk-download';
import { Icon } from 'semantic-ui-react';
import { 
    container, 
    menuItem, 
    menuWrapper, 
    statContainer, 
    statLabel 
} from './panel-map-menu.module.css';

export default function PanelMapMenu({ 
    analyte,
    program,
    region,
    setView, 
    species,
    stationData,
    tableData,
    view
}) {   
    // Set state in the parent component (panel-map-menu) instead of the child component (bulk-download) because 
    const [dataModalVisible, setDataModalVisible] = useState(false);

    const showTable = !((analyte && analyte.source === 'tissue') || (species && species.source === 'tissue'));

    const handleDataClick = () => {
        if (dataModalVisible === false) {
            setDataModalVisible(true);
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
            {/* Station count */} 
            <div>
                { tableData ? 
                    <div className={statContainer}>
                        <span className={statLabel}>{tableData.length}&nbsp;&nbsp;stations</span>
                    </div> 
                    : null 
                }
            </div>
        </div>
    )
}