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
            basic
            color='grey'
            icon='zoom'
            onClick={handleClick} 
            onKeyPress={handleClick}
            size='mini'
        />
    )
}