import React from 'react';
import { Checkbox } from 'semantic-ui-react';

export default function HighlightReference({ setHighlightReferenceSites }) {
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
                label='Show reference sites' 
                onChange={(e, data) => handleReferenceChange(data.checked)}
                style={calciteMatch}
            />
        </div>
    )
}