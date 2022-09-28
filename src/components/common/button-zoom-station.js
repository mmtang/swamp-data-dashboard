import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function ButtonZoomStation({ setZoomToStation, station }) {   
    const handleClick = () => {
        if (station) {
            setZoomToStation(station);
        }
    }

    return (
        <Button 
            compact 
            onClick={handleClick} 
            onKeyPress={handleClick}
            size='tiny'
        >
            <Icon name='zoom' />
            Zoom to
        </Button>
    )
}