import React from 'react';
import ChartIndex from './chart-index';
import HelpIcon from '../icons/help-icon';

export default function ChartIndexWrapper({ text, selectedSites, analyte }) {
    return (
        <div style={{ display: 'inline-block' }}>
            <ChartIndex 
                text={text}
                selectedSites={selectedSites} 
                analyte={analyte} 
            />
            <HelpIcon>
                <p>To use the graph function, select an indicator from the <strong>Filters</strong> section above and at least one site from the table below. A maximum of four sites can be graphed at one time.</p>
            </HelpIcon>
        </div>
    )
};