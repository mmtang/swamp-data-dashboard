import React from 'react';
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
    stationData,
    tableData,
    view
}) {   
    const handleViewClick = () => {
        if (view === 'map') {
            setView('table');
        } else {
            setView('map');
        }
    }

    return (
        <div className={container}>
            <div className={menuWrapper}>
                {/* Map & Table */}
                <div className={menuItem} onClick={handleViewClick}>
                    <div>
                        <Icon fitted inverted 
                            size='large'
                            name={ view === 'map' ? 'table' : 'map' }
                        />
                        <span>{ view === 'map' ? 'Table' : 'Map' }</span>
                    </div>
                </div>
                {/* Download */}
                <div className={menuItem}>
                    <BulkDownload 
                        analyte={analyte} 
                        program={program} 
                        region={region} 
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