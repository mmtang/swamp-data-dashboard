import React from 'react';
import { Button } from 'semantic-ui-react';

import { rightButton } from './clear-filters.module.css';

export default function ClearFilters({ 
    setSelectedAnalyte,
    setSelectedCategory,
    setSelectedProgram,
    setSelectedRegion,
    setSelectedSpecies
}) {  
    const handleClick = () => {
        // Reset filters
        setSelectedAnalyte(null);
        setSelectedCategory(null);
        setSelectedProgram(null);
        setSelectedRegion(null);
        setSelectedSpecies(null);
    }

    return (
        <Button 
            basic
            className={rightButton}
            color='grey'
            compact 
            onClick={handleClick} 
            onKeyPress={handleClick}
            size='small'
        >
            Clear filters
        </Button>
    )
}