import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default function ClearFilters({ setAnalyte, setCategory, setProgram, setRegion }) {   
    const handleClick = () => {
        setAnalyte(null);
        setCategory(null);
        setProgram(null);
        setRegion(null);
    }

    return (
        <Button 
            compact 
            onClick={handleClick} 
            onKeyPress={handleClick}
            size='tiny'
        >
            <Icon name='x' />
            Clear all
        </Button>
    )
}