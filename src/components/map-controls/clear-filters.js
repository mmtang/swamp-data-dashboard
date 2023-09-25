import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { rightButton } from './clear-filters.module.css';

export default function ClearFilters({ setAnalyte, setCategory, setProgram, setRegion, setSpecies }) {  
    const handleClick = () => {
        setAnalyte(null);
        setCategory(null);
        setProgram(null);
        setRegion(null);
        setSpecies(null);
    }

    return (
        <Button 
            className={rightButton}
            compact 
            onClick={handleClick} 
            onKeyPress={handleClick}
            size='tiny'
        >
            Clear all
        </Button>
    )
}