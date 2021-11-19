import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { active } from './filter-by-extent.module.css';

export default function FilterByExtent({ filteredByExtent, setFilteredByExtent }) {   
    const handleClick = () => {
        setFilteredByExtent(!filteredByExtent);
    }

    return (
        <Button 
            compact 
            className={filteredByExtent ? active : null}
            size='tiny'
            onClick={handleClick} 
            onKeyPress={handleClick}
        >
            <Icon name='filter' />
            Filter by map extent
        </Button>
    )
}