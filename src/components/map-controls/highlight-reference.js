import React from 'react';
import HelpIcon from '../icons/help-icon';
import { Checkbox } from 'semantic-ui-react';

import { referenceSitesText } from '../../constants/constants-app';

export default function HighlightReference({ 
    disableReferenceSites,
    highlightReferenceSites, 
    setHighlightReferenceSites 
}) {
    const calciteMatch = {
        color: '#323232',
        fontSize: '0.96em',
        padding: '9px 9px 4px 9px'
    }

    const handleReferenceChange = (val) => {
        if (val === true) {
            // If user toggles to highlight reference sites
            setHighlightReferenceSites(true);
        } else {
            setHighlightReferenceSites(false);
        }
    };

    return (
        <div>
            <Checkbox 
                checked={highlightReferenceSites}
                disabled={disableReferenceSites}
                label='Show reference sites' 
                onChange={(e, data) => handleReferenceChange(data.checked)}
                style={calciteMatch}
            />
            <HelpIcon>
                <div style={{ fontSize: '0.92em' }}>
                    {referenceSitesText}
                </div>
            </HelpIcon>
        </div>
    )
}