import React from 'react';
import { Loader } from 'semantic-ui-react';

export default function LoaderMenu() {
    const containerStyle = {
        alignItems: 'center',
        border: '1px solid #6e6e6e',
        color: '#808080',
        display: 'flex',
        fontSize: '13px',
        height: '34px',
        justifyContent: 'space-between',
        padding: '2px 8px',
        width: '100%'
    };

    return (
        <div style={containerStyle}>
            <div>Loading</div>
            <div>
                <Loader active inline size='mini' />
            </div>
        </div>
    )
}