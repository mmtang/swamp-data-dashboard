import React from 'react';
import { Button } from 'semantic-ui-react';

export default function ClearFilters({ setAnalyte, setCategory, setProgram, setRegion }) {   
    const buttonContainer = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '0.8em'
    }

    const handleClick = () => {
        setAnalyte(null);
        setCategory(null);
        setProgram(null);
        setRegion(null);
    }

    return (
        <div style={buttonContainer}>
            <Button 
                compact 
                onClick={handleClick} 
                onKeyPress={handleClick}
                size='tiny'
            >
            Clear all
        </Button>
        </div>
    )
}