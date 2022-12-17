import React from 'react';
import { Icon } from 'semantic-ui-react';
// Import styles
import { 
    container, 
    menuItem, 
    menuWrapper, 
    statContainer, 
    statLabel 
} from './panel-map-menu.module.css';


export default function PanelMapMenu({ 
    setView, 
    stationData, 
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
            <div>
                { stationData ? 
                    <div className={statContainer}>
                        <span className={statLabel}>{stationData.length}&nbsp;&nbsp;stations</span>
                    </div> 
                    : null 
                }
            </div>
        </div>
    )
}