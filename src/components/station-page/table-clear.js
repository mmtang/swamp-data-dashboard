import React from 'react';
import { Icon, Label } from 'semantic-ui-react'

export default function TableClear({ selectedAnalytes, setSelectedAnalytes }) {
    const labelStyle = {
        borderRadius: 0
    }

    const handleClear = () => {
        setSelectedAnalytes([]);
    }

    return (
        <div style={{ marginTop: '0.5em' }}>
            { selectedAnalytes.length > 0 ? 
                <Label basic color='blue' size='small' style={labelStyle}>
                    {selectedAnalytes.length} selected
                    <Icon name='delete' onClick={handleClear} />
                </Label>
                : <div></div>
            }
        </div>
    )
}