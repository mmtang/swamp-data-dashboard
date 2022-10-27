import React from 'react';
import { Loader } from 'semantic-ui-react';

export default function LoaderPanel({ children }) {
    const containerStyle = {
            display: 'flex',
            justifyContent: 'center',
            zIndex: 900,
            position: 'fixed',
            top: '110px',
            width: '65vw',
            height: 'calc(100vh - 110px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }

    return (
        <div style={containerStyle}>
            <Loader active inverted />
        </div>
    )
}