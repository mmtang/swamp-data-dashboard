import React from 'react';
import { Icon, Label } from 'semantic-ui-react'

import { wrapper } from './table-clear.module.css';

export default function TableClear({ selectedAnalytes, setSelectedAnalytes }) {
    const labelStyle = {
        borderRadius: 0
    }

    const handleClear = () => {
        setSelectedAnalytes([]);
    }

    return (
        <div className={wrapper}>
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