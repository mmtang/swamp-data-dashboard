import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { rowButton } from './map-controls.module.css';

export default function ZoomToSelected({ setZoomedToSites }) {   
    const handleClick = () => {
        setZoomedToSites(true);
    }

    return (
        <Button 
            className={rowButton}
            compact 
            size='tiny'
            onClick={handleClick} 
            onKeyPress={handleClick}
        >
            <Icon name='zoom-in' />
            Zoom to selected
        </Button>
    )
}