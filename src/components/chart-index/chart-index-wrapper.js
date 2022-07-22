import React from 'react';
import ChartIndex from './chart-index';
import HelpIcon from '../icons/help-icon';

// Component for wrapping chart button and help icon to keep the two together
export default function ChartIndexWrapper({ text, selectedSites, analyte }) {
    return (
        <div style={{ display: 'inline-block' }}>
            <ChartIndex 
                text={text}
                selectedSites={selectedSites} 
                analyte={analyte} 
            />
            <HelpIcon>
                <p>To use the graph function, select an indicator from the <strong>Filters</strong> section above and at least one site from the table below. A maximum of five stations can be graphed at one time.</p>
            </HelpIcon>
        </div>
    )
};