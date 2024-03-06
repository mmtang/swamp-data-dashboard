import React, { useEffect, useState } from 'react';
import HighlightReference from '../map-controls/highlight-reference';

import { Icon } from 'semantic-ui-react';

import { container, content, contentWrapper, expandArrow, header } from './map-legend.module.css';

export default function MapLegend({ 
    disableReferenceSites,
    highlightReferenceSites, 
    mapLoaded, 
    setHighlightReferenceSites 
}) {
    const [expanded, setExpanded] = useState(false);
    const displayStyle = expanded === true ? 'block' : 'none';

    const handleClick = () => {
        if (expanded) {
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    };

    useEffect(() => {
        if (mapLoaded) {
            setExpanded(true);
        }
    }, [mapLoaded]);

    return (
        <div className={container}>
            <div className={header}>
                Map Layers
                <Icon 
                    className={expandArrow} 
                    name={expanded === true ? 'angle up' : 'angle down'} 
                    onClick={handleClick}
                />
            </div>
            <div className={contentWrapper} style={{ display: displayStyle }}>
                {/*
                <HighlightReference 
                    disableReferenceSites={disableReferenceSites}
                    highlightReferenceSites={highlightReferenceSites} 
                    setHighlightReferenceSites={setHighlightReferenceSites}  
                />
                */}  
                <div id='map-legend-container' className={content} />
            </div>  
        </div>
    )
}