import React from 'react';
import { Icon } from 'semantic-ui-react';
import { 
    container, 
    menuItem, 
    menuWrapper, 
    statContainer, 
    statLabel 
} from './panel-map-menu.module.css';

export default function PanelMapMenu({ 
    setView, 
    tableData,
    view
}) {   
    const selectedStyle = {
        backgroundColor: '#00b5ad'
    }

    const handleClick = (val) => {
        if (val !== view) {
            setView(val);
        }
    }

    return (
        <div className={container}>
            <div className={menuWrapper}>
                {/* Map */}
                <div 
                    className={menuItem} 
                    style={view === 'map' ? selectedStyle : null}
                    onClick={() => handleClick('map')}
                >
                    <Icon fitted inverted 
                        size='large'
                        name='map' 
                    />
                    <span>Map</span>
                </div>
                {/* Table */}
                <div 
                    className={menuItem} 
                    style={view === 'table' ? selectedStyle : null}
                    onClick={() => handleClick('table')}
                >
                    <Icon fitted inverted 
                        size='large'
                        name='table' 
                    />
                    <span>Table</span>
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